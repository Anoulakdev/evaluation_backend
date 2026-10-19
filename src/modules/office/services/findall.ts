import { PrismaService } from '../../../prisma/prisma.service';

export interface FindAllOfficeOptions {
  page?: number;
  limit?: number;
  search?: string;
  divisionId?: number;
}

export async function findAllOffice(
  prisma: PrismaService,
  options: FindAllOfficeOptions = {},
) {
  const where: any = {};
  const andFilters: any[] = [];

  if (
    options.divisionId !== undefined &&
    options.divisionId !== null &&
    options.divisionId !== ('' as unknown) &&
    !isNaN(Number(options.divisionId)) &&
    Number(options.divisionId) > 0
  ) {
    where.divisionId = Number(options.divisionId);
  }

  if (options.search) {
    const q = options.search.trim();
    if (q) {
      andFilters.push({
        OR: [
          { office_name: { contains: q, mode: 'insensitive' } },
          { office_code: { contains: q, mode: 'insensitive' } },
          { division: { division_name: { contains: q, mode: 'insensitive' } } },
        ],
      });
    }
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const orderBy = { id: 'asc' as const };
  const include = { division: true };

  const page = options.page ? Number(options.page) : undefined;
  const limit = options.limit ? Number(options.limit) : undefined;

  if (page !== undefined && limit !== undefined && page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.office.findMany({
        where,
        orderBy,
        include,
        skip,
        take,
      }),
      prisma.office.count({ where }),
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

  return prisma.office.findMany({
    where,
    orderBy,
    include,
  });
}
