import {
  BadRequestException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { externalApi } from '../../../utils/external-api';
import * as bcrypt from 'bcryptjs';

interface ApiEmployeeOffice {
  pos_id?: number | null;
  department_id?: number | null;
  division_id?: number | null;
  office_id?: number | null;
  unit_id?: number | null;
  employeeStatus?: {
    emps_id?: number | null;
  } | null;
}

interface ApiEmployee {
  emp_id: number;
  first_name_la: string;
  last_name_la: string;
  emp_code: string;
  status: string;
  gender: string;
  phone: string;
  email: string;
  image: string;
  office?: ApiEmployeeOffice | null;
}

interface ApiEmployeeResponse {
  statusCode?: number;
  message?: string;
  data?: {
    total_record?: number;
    employees?: ApiEmployee[];
  };
}

/* =======================
   Static O(1) Role Lookup Sets
======================= */
const ROLE_4_POS_IDS = new Set([125, 124, 143, 5, 6, 7, 105]);
const ROLE_5_POS_IDS = new Set([126, 144, 9, 11, 10]);
const ROLE_6_POS_IDS = new Set([
  103, 17, 114, 18, 13, 16, 14, 19, 129, 134, 20, 141, 132, 22, 106, 15, 29,
  128, 131, 112, 127, 26, 21, 25, 24, 119, 121, 99, 27, 28, 90, 39, 47, 100,
  120, 145, 41,
]);
const ROLE_7_POS_IDS = new Set([107, 30, 116, 40, 133]);
const ROLE_8_POS_IDS = new Set([
  34, 136, 137, 104, 91, 50, 44, 45, 52, 51, 118, 102,
]);

function getRoleIdByPosId(posId?: number | null): number {
  if (!posId) return 9;
  if (posId === 2) return 2;
  if (posId === 3) return 3;
  if (ROLE_4_POS_IDS.has(posId)) return 4;
  if (ROLE_5_POS_IDS.has(posId)) return 5;
  if (ROLE_6_POS_IDS.has(posId)) return 6;
  if (ROLE_7_POS_IDS.has(posId)) return 7;
  if (ROLE_8_POS_IDS.has(posId)) return 8;
  return 9;
}

/* =======================
   Fetch Employees from API with Retry & Timeout
====================== */

async function fetchEmployeesByDepartmentId(
  departmentId: number,
  retries = 3,
): Promise<ApiEmployee[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await externalApi.get<ApiEmployeeResponse>(
        `/organization-svc/employee/get?department_id=${departmentId}`,
        { timeout: 120000 },
      );

      const employees = response.data.data?.employees || [];
      return employees.filter(
        (emp) => emp.office?.employeeStatus?.emps_id === 1,
      );
    } catch (err: unknown) {
      console.warn(
        `Attempt ${attempt}/${retries} failed to fetch employees for department_id=${departmentId}:`,
        err instanceof Error ? err.message : err,
      );
      if (attempt === retries) {
        throw new GatewayTimeoutException(
          `การเชื่อมต่อระบบ API พนักงานภายนอกใช้เวลานานเกินกำหนด (Timeout) สำหรับแผนก ID ${departmentId} กรุณาลองใหม่อีกครั้ง`,
        );
      }
      // Wait 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  return [];
}

/* =======================
   Sync Users by Department ID
======================= */

export async function syncUser(prisma: PrismaService, departmentId: number) {
  if (!departmentId || isNaN(Number(departmentId))) {
    throw new BadRequestException('Department ID is required');
  }

  const deptId = Number(departmentId);

  // Check if department exists in local database
  const existingDept = await prisma.department.findUnique({
    where: { id: deptId },
  });

  if (!existingDept) {
    throw new NotFoundException(`Department with ID ${deptId} not found`);
  }

  if (!process.env.DEFAULT_PASSWORD) {
    throw new InternalServerErrorException('DEFAULT_PASSWORD is not defined');
  }

  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);

  const apiEmployees = await fetchEmployeesByDepartmentId(deptId);

  if (!apiEmployees.length) {
    return {
      success: true,
      total: 0,
      updated: 0,
      created: 0,
      message: 'No employees/users retrieved for this department',
    };
  }

  // Deduplicate by emp_code to prevent concurrent upsert unique collision in same transaction
  const uniqueEmployees = Array.from(
    new Map(
      apiEmployees
        .filter((e) => Boolean(e.emp_code && e.emp_code.trim()))
        .map((e) => [e.emp_code.trim(), e]),
    ).values(),
  );

  if (!uniqueEmployees.length) {
    return {
      success: true,
      total: 0,
      updated: 0,
      created: 0,
      message: 'No valid employees retrieved for this department',
    };
  }

  const empCodes = uniqueEmployees.map((e) => e.emp_code);

  // Master Data Foreign Key validation & scoped user query
  const [
    existingDepts,
    existingDivs,
    existingOffices,
    existingUnits,
    existingPositions,
    existingUsers,
  ] = await Promise.all([
    prisma.department.findMany({ select: { id: true } }),
    prisma.division.findMany({ select: { id: true } }),
    prisma.office.findMany({ select: { id: true } }),
    prisma.unit.findMany({ select: { id: true } }),
    prisma.position.findMany({ select: { id: true } }),
    prisma.user.findMany({
      where: { username: { in: empCodes } },
      select: { username: true },
    }),
  ]);

  const validDeptIds = new Set(existingDepts.map((d) => d.id));
  const validDivIds = new Set(existingDivs.map((d) => d.id));
  const validOfficeIds = new Set(existingOffices.map((o) => o.id));
  const validUnitIds = new Set(existingUnits.map((u) => u.id));
  const validPosIds = new Set(existingPositions.map((p) => p.id));
  const existingUsernames = new Set(existingUsers.map((u) => u.username));

  let updated = 0;
  let created = 0;

  const batchSize = 50;
  const baseUrl = (process.env.URL_API || '').replace(/\/+$/, '');

  for (let i = 0; i < uniqueEmployees.length; i += batchSize) {
    const batch = uniqueEmployees.slice(i, i + batchSize);

    // Track counts
    for (const emp of batch) {
      if (!emp.emp_code) continue;
      if (!existingUsernames.has(emp.emp_code)) created++;
      else updated++;
    }

    // Execute batch inside an interactive transaction with Promise.all
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        batch.map((emp) => {
          if (!emp.emp_code) return Promise.resolve();

          const apiImgUrl = emp.image
            ? `${baseUrl}/organization-svc/employee/getEmpImg/${emp.emp_code}/${emp.image}`
            : null;

          const rawPosId = emp.office?.pos_id;
          const rawDeptId = emp.office?.department_id;
          const rawDivId = emp.office?.division_id;
          const rawOfficeId = emp.office?.office_id;
          const rawUnitId = emp.office?.unit_id;

          const roleId = getRoleIdByPosId(rawPosId);

          const userData = {
            first_name: emp.first_name_la,
            last_name: emp.last_name_la,
            emp_code: emp.emp_code,
            status: emp.status || 'A',
            gender: emp.gender,
            tel: emp.phone,
            email: emp.email,
            empimg: apiImgUrl,
            roleId: roleId,
            posId: rawPosId && validPosIds.has(rawPosId) ? rawPosId : null,
            departmentId:
              rawDeptId && validDeptIds.has(rawDeptId) ? rawDeptId : null,
            divisionId: rawDivId && validDivIds.has(rawDivId) ? rawDivId : null,
            officeId:
              rawOfficeId && validOfficeIds.has(rawOfficeId)
                ? rawOfficeId
                : null,
            unitId: rawUnitId && validUnitIds.has(rawUnitId) ? rawUnitId : null,
          };

          const updateData = { ...userData };
          delete (updateData as { roleId?: number }).roleId;

          return tx.user.upsert({
            where: { username: emp.emp_code },
            update: updateData,
            create: {
              username: emp.emp_code,
              password: hashedPassword,
              ...userData,
            },
          });
        }),
      );
    });
  }

  return {
    success: true,
    total: apiEmployees.length,
    updated,
    created,
    message: 'Users synced successfully',
  };
}
