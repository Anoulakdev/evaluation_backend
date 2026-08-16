import { PrismaService } from '../../../prisma/prisma.service';

export interface FindAllDivisionOptions {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: number;
}

export async function findAllDivision(
  prisma: PrismaService,
  options: FindAllDivisionOptions = {},
) {
  const where: any = {};
  const andFilters: any[] = [];

  if (options.departmentId !== undefined && options.departmentId !== null) {
    where.departmentId = Number(options.departmentId);
  }

  if (options.search) {
    const q = options.search.trim();
    if (q) {
      andFilters.push({
        OR: [
          { division_name: { contains: q, mode: 'insensitive' } },
          { division_code: { contains: q, mode: 'insensitive' } },
          { short_name: { contains: q, mode: 'insensitive' } },
          { department: { department_name: { contains: q, mode: 'insensitive' } } },
        ],
      });
    }
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const orderBy = { id: 'asc' as const };
  const include = { department: true };

  const page = options.page ? Number(options.page) : undefined;
  const limit = options.limit ? Number(options.limit) : undefined;

  if (page !== undefined && limit !== undefined && page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.division.findMany({
        where,
        orderBy,
        include,
        skip,
        take,
      }),
      prisma.division.count({ where }),
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

  return prisma.division.findMany({
    where,
    orderBy,
    include,
  });
}
