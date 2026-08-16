import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

export async function findOneUser(prisma: PrismaService, id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      roleId: true,
      role: true,
      first_name: true,
      last_name: true,
      emp_code: true,
      gender: true,
      tel: true,
      email: true,
      empimg: true,
      departmentId: true,
      divisionId: true,
      officeId: true,
      unitId: true,
      posId: true,
      department: true,
      division: true,
      office: true,
      unit: true,
      position: true,
    },
  });
  if (!user) throw new NotFoundException('User not found');
  return user;
}
