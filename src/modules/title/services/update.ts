import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateTitleDto } from '../dto/update-title.dto';
import { NotFoundException } from '@nestjs/common';

export async function updateTitle(
  prisma: PrismaService,
  id: number,
  updateTitleDto: UpdateTitleDto,
) {
  const title = await prisma.title.findUnique({ where: { id } });
  if (!title) throw new NotFoundException('title not found');

  return prisma.title.update({
    where: { id },
    data: updateTitleDto,
  });
}
