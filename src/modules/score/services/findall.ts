import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllScore(prisma: PrismaService) {
  return prisma.score.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
