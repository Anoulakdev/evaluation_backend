import { PrismaService } from '../../../prisma/prisma.service';

export async function selectScore(prisma: PrismaService) {
  return prisma.score.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
