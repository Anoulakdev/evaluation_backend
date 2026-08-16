import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTitleDto } from '../dto/create-title.dto';

export async function createTitle(
  prisma: PrismaService,
  createTitleDto: CreateTitleDto,
) {
  return prisma.title.create({
    data: createTitleDto,
  });
}
