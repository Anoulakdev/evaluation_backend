import { PrismaService } from '../../../prisma/prisma.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';

export async function removeTitle(prisma: PrismaService, id: number) {
  const title = await prisma.title.findUnique({ where: { id } });
  if (!title) throw new NotFoundException('title not found');

  await prisma.title.delete({ where: { id } });
  return {
    statusCode: HttpStatus.OK,
    message: 'title deleted successfully',
  };
}
