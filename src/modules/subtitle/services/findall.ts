import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllSubTitle(prisma: PrismaService) {
  return prisma.subTitle.findMany({
    include: {
      title: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
}
