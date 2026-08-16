import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneScore(prisma: PrismaService, id: number) {
  const score = await prisma.score.findUnique({ where: { id } });
  if (!score) throw new NotFoundException('score not found');
  return score;
}
