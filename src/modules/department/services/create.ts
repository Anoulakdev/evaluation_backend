import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';

export async function createDepartment(
  prisma: PrismaService,
  createDepartmentDto: CreateDepartmentDto,
) {
  // Find the max/latest ID and add 1
  const lastDepartment = await prisma.department.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  });

  const nextId = (lastDepartment?.id ?? 0) + 1;

  return prisma.department.create({
    data: {
      id: nextId,
      department_name: createDepartmentDto.department_name,
      department_code: createDepartmentDto.department_code || null,
    },
  });
}
