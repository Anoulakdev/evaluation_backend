import { PrismaService } from '../../../prisma/prisma.service';

export async function selectSubTitle(prisma: PrismaService, titleId: number) {
  return prisma.subTitle.findMany({
    where: {
      titleId,
    },
    orderBy: {
      id: 'asc',
    },
  });
}
