import { PrismaService } from '../../../prisma/prisma.service';

export async function selectTitle(prisma: PrismaService) {
  return prisma.title.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
