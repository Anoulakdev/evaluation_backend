import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { externalApi } from '../../../utils/external-api';
import { CreateUserDto } from '../dto/create-user.dto';
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
   Fetch Employees from API
======================= */

async function fetchEmployees(
  createUserDto: CreateUserDto,
): Promise<ApiEmployee[]> {
  try {
    const response = await externalApi.get<ApiEmployeeResponse>(
      `/organization-svc/employee/get?search=${createUserDto.username}`,
    );

    const employees = response.data.data?.employees || [];
    return employees;
  } catch (err: unknown) {
    let message = 'Failed to fetch employees';
    if (err instanceof Error) message = err.message;

    console.error(message);
    throw new Error(message);
  }
}

/* =======================
   Create User with Employee Sync
======================= */

export async function createUser(
  prisma: PrismaService,
  createUserDto: CreateUserDto,
) {
  if (!process.env.DEFAULT_PASSWORD) {
    throw new InternalServerErrorException('DEFAULT_PASSWORD is not defined');
  }

  // Hash password beforehand (since it doesn't depend on DB state)
  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);

  let matchedEmployee: ApiEmployee | undefined;
  try {
    const employees = await fetchEmployees(createUserDto);
    matchedEmployee = employees?.find(
      (emp) => emp.emp_code === createUserDto.username,
    );
  } catch (err: unknown) {
    console.warn(
      `Could not fetch employee for username ${createUserDto.username}:`,
      err,
    );
  }

  return prisma.$transaction(async (tx) => {
    // Check if username already exists
    const existingUser = await tx.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException(
        'ຊື່ຜູ້ໃຊ້ / ລະຫັດພະນັກງານ ນີ້ມີຢູ່ໃນລະບົບແລ້ວ',
      );
    }

    let dept: any = null;
    let div: any = null;
    let off: any = null;
    let unit: any = null;
    let pos: any = null;

    if (matchedEmployee) {
      const rawPosId = matchedEmployee.office?.pos_id;
      const rawDeptId = matchedEmployee.office?.department_id;
      const rawDivId = matchedEmployee.office?.division_id;
      const rawOfficeId = matchedEmployee.office?.office_id;
      const rawUnitId = matchedEmployee.office?.unit_id;

      [dept, div, off, unit, pos] = await Promise.all([
        rawDeptId
          ? tx.department.findUnique({ where: { id: rawDeptId } })
          : null,
        rawDivId ? tx.division.findUnique({ where: { id: rawDivId } }) : null,
        rawOfficeId
          ? tx.office.findUnique({ where: { id: rawOfficeId } })
          : null,
        rawUnitId ? tx.unit.findUnique({ where: { id: rawUnitId } }) : null,
        rawPosId ? tx.position.findUnique({ where: { id: rawPosId } }) : null,
      ]);
    }

    const apiImgUrl = matchedEmployee?.image
      ? `${process.env.URL_API}/organization-svc/employee/getEmpImg/${matchedEmployee.emp_code}/${matchedEmployee.image}`
      : null;

    const user = await tx.user.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword,
        roleId: createUserDto.roleId,
        first_name: matchedEmployee?.first_name_la || null,
        last_name: matchedEmployee?.last_name_la || null,
        emp_code: matchedEmployee?.emp_code || null,
        status: matchedEmployee?.status || 'A',
        gender: matchedEmployee?.gender || null,
        tel: matchedEmployee?.phone || null,
        email: matchedEmployee?.email || null,
        empimg: apiImgUrl,
        posId: pos ? pos.id : null,
        departmentId: dept ? dept.id : null,
        divisionId: div ? div.id : null,
        officeId: off ? off.id : null,
        unitId: unit ? unit.id : null,
      },
      select: {
        id: true,
        username: true,
        roleId: true,
        first_name: true,
        last_name: true,
        emp_code: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  });
}
