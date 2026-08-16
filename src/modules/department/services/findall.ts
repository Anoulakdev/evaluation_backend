import { PrismaService } from '../../../prisma/prisma.service';

export interface FindAllDepartmentOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export async function findAllDepartment(
  prisma: PrismaService,
  options: FindAllDepartmentOptions = {},
) {
  const where: any = {};
  const andFilters: any[] = [];

  if (options.search) {
    const q = options.search.trim();
    if (q) {
      andFilters.push({
        OR: [
          { department_name: { contains: q, mode: 'insensitive' } },
          { department_code: { contains: q, mode: 'insensitive' } },
        ],
      });
    }
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const orderBy = { id: 'asc' as const };

  const page = options.page ? Number(options.page) : undefined;
  const limit = options.limit ? Number(options.limit) : undefined;

  if (page !== undefined && limit !== undefined && page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.department.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.department.count({ where }),
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

  return prisma.department.findMany({
    where,
    orderBy,
  });
}
