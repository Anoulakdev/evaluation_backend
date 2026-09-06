import { PrismaService } from '../../../prisma/prisma.service';

export async function selectPosition(prisma: PrismaService) {
  return prisma.position.findMany({
    orderBy: {
      poscodeId: 'asc',
    },
  });
}
