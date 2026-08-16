import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateDepartmentDto } from '../dto/update-department.dto';

export async function updateDepartment(
  prisma: PrismaService,
  id: number,
  updateDepartmentDto: UpdateDepartmentDto,
) {
  const department = await prisma.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new NotFoundException(`Department with ID ${id} not found`);
  }

  return prisma.department.update({
    where: { id },
    data: {
      ...(updateDepartmentDto.department_name && {
        department_name: updateDepartmentDto.department_name,
      }),
      ...(updateDepartmentDto.department_code !== undefined && {
        department_code: updateDepartmentDto.department_code,
      }),
    },
  });
}
