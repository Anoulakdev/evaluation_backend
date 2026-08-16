import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDivisionDto } from '../dto/create-division.dto';

export async function createDivision(
  prisma: PrismaService,
  createDivisionDto: CreateDivisionDto,
) {
  // Find the max/latest ID and add 1
  const lastDivision = await prisma.division.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  });

  const nextId = (lastDivision?.id ?? 0) + 1;

  return prisma.division.create({
    data: {
      id: nextId,
      division_name: createDivisionDto.division_name,
      division_code: createDivisionDto.division_code || null,
      departmentId: Number(createDivisionDto.departmentId),
      branch_id: createDivisionDto.branch_id ? Number(createDivisionDto.branch_id) : null,
      short_name: createDivisionDto.short_name || null,
      insur_code: createDivisionDto.insur_code || null,
    },
  });
}
