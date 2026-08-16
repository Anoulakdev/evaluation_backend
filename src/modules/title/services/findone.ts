import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneTitle(prisma: PrismaService, id: number) {
  const title = await prisma.title.findUnique({ where: { id } });
  if (!title) throw new NotFoundException('title not found');
  return title;
}
