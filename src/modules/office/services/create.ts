import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOfficeDto } from '../dto/create-office.dto';

export async function createOffice(
  prisma: PrismaService,
  createOfficeDto: CreateOfficeDto,
) {
  const lastOffice = await prisma.office.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  });

  const nextId = (lastOffice?.id ?? 0) + 1;

  return prisma.office.create({
    data: {
      id: nextId,
      office_name: createOfficeDto.office_name,
      office_code: createOfficeDto.office_code || null,
      divisionId: Number(createOfficeDto.divisionId),
    },
  });
}
