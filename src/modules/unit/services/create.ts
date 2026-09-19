import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUnitDto } from '../dto/create-unit.dto';

export async function createUnit(
  prisma: PrismaService,
  createUnitDto: CreateUnitDto,
) {
  const lastUnit = await prisma.unit.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  });

  const nextId = (lastUnit?.id ?? 0) + 1;

  return prisma.unit.create({
    data: {
      id: nextId,
      unit_name: createUnitDto.unit_name,
      unit_code: createUnitDto.unit_code || null,
      unit_type: createUnitDto.unit_type || null,
      divisionId: createUnitDto.divisionId
        ? Number(createUnitDto.divisionId)
        : null,
      officeId: createUnitDto.officeId ? Number(createUnitDto.officeId) : null,
    },
  });
}
