import { PrismaService } from '../../../prisma/prisma.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';

export async function removeScore(prisma: PrismaService, id: number) {
  const score = await prisma.score.findUnique({ where: { id } });
  if (!score) throw new NotFoundException('score not found');

  await prisma.score.delete({ where: { id } });
  return {
    statusCode: HttpStatus.OK,
    message: 'score deleted successfully',
  };
}
