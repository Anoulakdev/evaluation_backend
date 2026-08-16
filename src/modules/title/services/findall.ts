import { PrismaService } from '../../../prisma/prisma.service';

export async function findAllTitle(prisma: PrismaService) {
  return prisma.title.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}
