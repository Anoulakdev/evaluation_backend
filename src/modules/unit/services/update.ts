import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateUnitDto } from '../dto/update-unit.dto';

export async function updateUnit(
  prisma: PrismaService,
  id: number,
  updateUnitDto: UpdateUnitDto,
) {
  const unit = await prisma.unit.findUnique({
    where: { id },
  });

  if (!unit) {
    throw new NotFoundException(`Unit with ID ${id} not found`);
  }

  return prisma.unit.update({
    where: { id },
    data: {
      ...(updateUnitDto.unit_name && {
        unit_name: updateUnitDto.unit_name,
      }),
      ...(updateUnitDto.unit_code !== undefined && {
        unit_code: updateUnitDto.unit_code,
      }),
      ...(updateUnitDto.unit_type !== undefined && {
        unit_type: updateUnitDto.unit_type,
      }),
      ...(updateUnitDto.divisionId !== undefined && {
        divisionId: updateUnitDto.divisionId ? Number(updateUnitDto.divisionId) : null,
      }),
      ...(updateUnitDto.officeId !== undefined && {
        officeId: updateUnitDto.officeId ? Number(updateUnitDto.officeId) : null,
      }),
    },
  });
}
