import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { Prisma } from '../../../../generated/prisma/client';

export interface FindAllUserOptions {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: number;
  status?: string;
  departmentId?: number;
  divisionId?: number;
  officeId?: number;
  unitId?: number;
  posId?: number;
}

export async function findAllUser(
  prisma: PrismaService,
  user: AuthUser,
  options: FindAllUserOptions = {},
) {
  const where: Prisma.UserWhereInput = {};
  const andFilters: Prisma.UserWhereInput[] = [];

  const currentUserRoleId =
    user?.roleId !== undefined && user?.roleId !== null
      ? Number(user.roleId)
      : undefined;

  let allowedRoles: number[] | null = null;
  if (currentUserRoleId === 11) {
    allowedRoles = [1, 12, 13, 14];
  } else if (
    currentUserRoleId === 1 ||
    currentUserRoleId === 13 ||
    currentUserRoleId === 14
  ) {
    allowedRoles = [2, 3, 4, 5, 6, 7, 8, 9];
  }

  const hasRoleIdOption =
    options.roleId !== undefined &&
    options.roleId !== null &&
    options.roleId !== ('' as unknown) &&
    !isNaN(Number(options.roleId));

  if (allowedRoles) {
    if (hasRoleIdOption) {
      const selectedRoleId = Number(options.roleId);
      if (allowedRoles.includes(selectedRoleId)) {
        where.roleId = selectedRoleId;
      } else {
        where.roleId = { in: [] };
      }
    } else {
      where.roleId = { in: allowedRoles };
    }
  } else if (hasRoleIdOption) {
    where.roleId = Number(options.roleId);
  }

  if (options.status) {
    let statusValue = options.status;
    if (statusValue === 'Active') statusValue = 'A';
    if (statusValue === 'Inactive') statusValue = 'C';
    where.status = statusValue;
  }

  if (currentUserRoleId === 13 && user?.departmentId) {
    const userDeptId = Number(user.departmentId);
    where.departmentId = userDeptId;
    if ([10, 11, 12].includes(userDeptId)) {
      where.division = {
        branch_id: 1,
      };
    }
  } else if (currentUserRoleId === 14) {
    if (user?.departmentId) {
      where.departmentId = Number(user.departmentId);
    }
    if (user?.divisionId) {
      where.divisionId = Number(user.divisionId);
    }
  } else if (
    options.departmentId !== undefined &&
    options.departmentId !== null &&
    options.departmentId !== ('' as unknown) &&
    !isNaN(Number(options.departmentId)) &&
    Number(options.departmentId) > 0
  ) {
    where.departmentId = Number(options.departmentId);
  }

  if (
    currentUserRoleId !== 14 &&
    options.divisionId !== undefined &&
    options.divisionId !== null &&
    options.divisionId !== ('' as unknown) &&
    !isNaN(Number(options.divisionId)) &&
    Number(options.divisionId) > 0
  ) {
    where.divisionId = Number(options.divisionId);
  }

  if (
    options.officeId !== undefined &&
    options.officeId !== null &&
    options.officeId !== ('' as unknown) &&
    !isNaN(Number(options.officeId)) &&
    Number(options.officeId) > 0
  ) {
    where.officeId = Number(options.officeId);
  }

  if (
    options.unitId !== undefined &&
    options.unitId !== null &&
    options.unitId !== ('' as unknown) &&
    !isNaN(Number(options.unitId)) &&
    Number(options.unitId) > 0
  ) {
    where.unitId = Number(options.unitId);
  }

  if (
    options.posId !== undefined &&
    options.posId !== null &&
    options.posId !== ('' as unknown) &&
    !isNaN(Number(options.posId)) &&
    Number(options.posId) > 0
  ) {
    where.posId = Number(options.posId);
  }

  if (options.search) {
    const searchLower = options.search.trim();
    if (searchLower) {
      andFilters.push({
        OR: [
          { username: { contains: searchLower, mode: 'insensitive' } },
          { first_name: { contains: searchLower, mode: 'insensitive' } },
          { last_name: { contains: searchLower, mode: 'insensitive' } },
          { emp_code: { contains: searchLower, mode: 'insensitive' } },
          { tel: { contains: searchLower, mode: 'insensitive' } },
          { email: { contains: searchLower, mode: 'insensitive' } },
        ],
      });
    }
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const page =
    options.page !== undefined
      ? Math.max(1, Number(options.page) || 1)
      : undefined;
  const limit =
    options.limit !== undefined
      ? Math.max(1, Number(options.limit) || 10)
      : undefined;

  const select = {
    id: true,
    username: true,
    status: true,
    roleId: true,
    role: true,
    first_name: true,
    last_name: true,
    emp_code: true,
    gender: true,
    tel: true,
    email: true,
    empimg: true,
    departmentId: true,
    divisionId: true,
    officeId: true,
    unitId: true,
    posId: true,
    rank: true,
    department: true,
    division: true,
    office: true,
    unit: true,
    position: true,
  };

  const orderBy: Prisma.UserOrderByWithRelationInput[] = [
    { roleId: 'asc' },
    {
      position: {
        poscodeId: 'asc',
      },
    },
    {
      division: {
        division_code: 'asc',
      },
    },
    {
      rank: 'asc',
    },
    {
      emp_code: 'asc',
    },
  ];

  if (page !== undefined && limit !== undefined) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        select,
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  return prisma.user.findMany({
    where,
    orderBy,
    select,
  });
}
