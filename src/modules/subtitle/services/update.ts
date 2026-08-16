import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateSubtitleDto } from '../dto/update-subtitle.dto';
import { NotFoundException } from '@nestjs/common';

export async function updateSubTitle(
  prisma: PrismaService,
  id: number,
  updateSubtitleDto: UpdateSubtitleDto,
) {
  const subtitle = await prisma.subTitle.findUnique({ where: { id } });
  if (!subtitle) throw new NotFoundException('subtitle not found');

  return prisma.subTitle.update({
    where: { id },
    data: {
      titleId: Number(updateSubtitleDto.titleId),
      name: updateSubtitleDto.name,
    },
  });
}
