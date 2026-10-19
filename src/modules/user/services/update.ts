import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

export async function updateUser(
  prisma: PrismaService,
  id: number,
  updateUserDto: UpdateUserDto,
) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException('user not found');

  const data: any = {};
  if (updateUserDto.posId !== undefined) {
    data.posId = updateUserDto.posId ? Number(updateUserDto.posId) : null;
  }
  if (updateUserDto.departmentId !== undefined) {
    data.departmentId = updateUserDto.departmentId
      ? Number(updateUserDto.departmentId)
      : null;
  }
  if (updateUserDto.divisionId !== undefined) {
    data.divisionId = updateUserDto.divisionId
      ? Number(updateUserDto.divisionId)
      : null;
  }
  if (updateUserDto.officeId !== undefined) {
    data.officeId = updateUserDto.officeId
      ? Number(updateUserDto.officeId)
      : null;
  }
  if (updateUserDto.unitId !== undefined) {
    data.unitId = updateUserDto.unitId ? Number(updateUserDto.unitId) : null;
  }
  if (
    updateUserDto.roleId !== undefined &&
    updateUserDto.roleId !== null &&
    Number(updateUserDto.roleId) > 0
  ) {
    data.roleId = Number(updateUserDto.roleId);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });

  return {
    message: 'User updated successfully',
    data: {
      id: updatedUser.id,
      roleId: updatedUser.roleId,
    },
  };
}
