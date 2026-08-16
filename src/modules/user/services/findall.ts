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

  if (options.roleId !== undefined && options.roleId !== null) {
    where.roleId = Number(options.roleId);
  }

  if (options.status) {
    let statusValue = options.status;
    if (statusValue === 'Active') statusValue = 'A';
    if (statusValue === 'Inactive') statusValue = 'C';
    where.status = statusValue;
  }

  if (options.departmentId !== undefined && options.departmentId !== null) {
    where.departmentId = Number(options.departmentId);
  }

  if (options.divisionId !== undefined && options.divisionId !== null) {
    where.divisionId = Number(options.divisionId);
  }

  if (options.officeId !== undefined && options.officeId !== null) {
    where.officeId = Number(options.officeId);
  }

  if (options.unitId !== undefined && options.unitId !== null) {
    where.unitId = Number(options.unitId);
  }

  if (options.posId !== undefined && options.posId !== null) {
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

  const page = options.page ? Number(options.page) : undefined;
  const limit = options.limit ? Number(options.limit) : undefined;

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
      id: 'asc',
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
