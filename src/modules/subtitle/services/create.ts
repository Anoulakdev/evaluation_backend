import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSubtitleDto } from '../dto/create-subtitle.dto';

export async function createSubTitle(
  prisma: PrismaService,
  createSubtitleDto: CreateSubtitleDto,
) {
  return prisma.subTitle.create({
    data: {
      titleId: Number(createSubtitleDto.titleId),
      name: createSubtitleDto.name,
    },
  });
}
