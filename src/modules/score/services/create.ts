import { PrismaService } from '../../../prisma/prisma.service';
import { CreateScoreDto } from '../dto/create-score.dto';

export async function createScore(
  prisma: PrismaService,
  createScoreDto: CreateScoreDto,
) {
  return prisma.score.create({
    data: {
      sc_num: Number(createScoreDto.sc_num),
    },
  });
}
