import { PrismaService } from '../../../prisma/prisma.service';

export interface FindAllUnitOptions {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: number;
  divisionId?: number;
  officeId?: number;
}

export async function findAllUnit(
  prisma: PrismaService,
  options: FindAllUnitOptions = {},
) {
  const where: any = {};
  const andFilters: any[] = [];

  if (options.departmentId !== undefined && options.departmentId !== null) {
    andFilters.push({
      OR: [
        { division: { departmentId: Number(options.departmentId) } },
        {
          office: { division: { departmentId: Number(options.departmentId) } },
        },
      ],
    });
  }

  if (options.divisionId !== undefined && options.divisionId !== null) {
    andFilters.push({
      OR: [
        { divisionId: Number(options.divisionId) },
        { office: { divisionId: Number(options.divisionId) } },
      ],
    });
  }

  if (options.officeId !== undefined && options.officeId !== null) {
    where.officeId = Number(options.officeId);
  }

  if (options.search) {
    const q = options.search.trim();
    if (q) {
      andFilters.push({
        OR: [
          { unit_name: { contains: q, mode: 'insensitive' } },
          { unit_code: { contains: q, mode: 'insensitive' } },
          { division: { division_name: { contains: q, mode: 'insensitive' } } },
          { office: { office_name: { contains: q, mode: 'insensitive' } } },
          {
            office: {
              division: { division_name: { contains: q, mode: 'insensitive' } },
            },
          },
        ],
      });
    }
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  const orderBy = { id: 'asc' as const };
  const include = { division: true, office: { include: { division: true } } };

  const page = options.page ? Number(options.page) : undefined;
  const limit = options.limit ? Number(options.limit) : undefined;

  if (page !== undefined && limit !== undefined && page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        orderBy,
        include,
        skip,
        take,
      }),
      prisma.unit.count({ where }),
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

  return prisma.unit.findMany({
    where,
    orderBy,
    include,
  });
}
