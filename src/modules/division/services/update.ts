import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateDivisionDto } from '../dto/update-division.dto';

export async function updateDivision(
  prisma: PrismaService,
  id: number,
  updateDivisionDto: UpdateDivisionDto,
) {
  const division = await prisma.division.findUnique({
    where: { id },
  });

  if (!division) {
    throw new NotFoundException(`Division with ID ${id} not found`);
  }

  return prisma.division.update({
    where: { id },
    data: {
      ...(updateDivisionDto.division_name && {
        division_name: updateDivisionDto.division_name,
      }),
      ...(updateDivisionDto.division_code !== undefined && {
        division_code: updateDivisionDto.division_code,
      }),
      ...(updateDivisionDto.departmentId !== undefined && {
        departmentId: Number(updateDivisionDto.departmentId),
      }),
      ...(updateDivisionDto.branch_id !== undefined && {
        branch_id: updateDivisionDto.branch_id
          ? Number(updateDivisionDto.branch_id)
          : null,
      }),
      ...(updateDivisionDto.short_name !== undefined && {
        short_name: updateDivisionDto.short_name,
      }),
      ...(updateDivisionDto.insur_code !== undefined && {
        insur_code: updateDivisionDto.insur_code,
      }),
    },
  });
}
