import { PrismaService } from '../../../prisma/prisma.service';

export async function selectOffice(prisma: PrismaService, divisionId?: number) {
  const where = divisionId ? { divisionId: Number(divisionId) } : undefined;

  return prisma.office.findMany({
    where: where,
    orderBy: {
      id: 'asc',
    },
    include: {
      division: true,
    },
  });
}
