import { PrismaService } from '../../../prisma/prisma.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';

export async function removeSubTitle(prisma: PrismaService, id: number) {
  const subtitle = await prisma.subTitle.findUnique({ where: { id } });
  if (!subtitle) throw new NotFoundException('subtitle not found');

  await prisma.subTitle.delete({ where: { id } });
  return {
    statusCode: HttpStatus.OK,
    message: 'subtitle deleted successfully',
  };
}
