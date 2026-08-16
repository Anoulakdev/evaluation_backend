import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateScoreDto } from '../dto/update-score.dto';
import { NotFoundException } from '@nestjs/common';

export async function updateScore(
  prisma: PrismaService,
  id: number,
  updateScoreDto: UpdateScoreDto,
) {
  const score = await prisma.score.findUnique({ where: { id } });
  if (!score) throw new NotFoundException('score not found');

  return prisma.score.update({
    where: { id },
    data: {
      sc_num: Number(updateScoreDto.sc_num),
    },
  });
}
