import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneSubTitle(prisma: PrismaService, id: number) {
  const subtitle = await prisma.subTitle.findUnique({
    where: { id },
    include: {
      title: true,
    },
  });
  if (!subtitle) throw new NotFoundException('subtitle not found');
  return subtitle;
}
