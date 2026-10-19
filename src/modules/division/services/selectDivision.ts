import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { Prisma } from '../../../../generated/prisma/client';

export async function selectDivision(
  prisma: PrismaService,
  user: AuthUser,
  departmentId?: number,
) {
  const where: Prisma.DivisionWhereInput = {};

  if (
    departmentId !== undefined &&
    departmentId !== null &&
    departmentId !== ('' as unknown) &&
    !isNaN(Number(departmentId))
  ) {
    const deptId = Number(departmentId);
    where.departmentId = deptId;

    if (Number(user?.roleId) === 13 && [10, 11, 12].includes(deptId)) {
      where.branch_id = 1;
    }
  }

  return prisma.division.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: {
      id: 'asc',
    },
    include: {
      department: true,
    },
  });
}
