import {
  HttpStatus,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from '../dto/change-password.dto';

export async function changePassword(
  prisma: PrismaService,
  currentUser: AuthUser,
  id: number,
  dto: ChangePasswordDto,
) {
  if (
    currentUser.id !== id &&
    currentUser.roleId !== 1 &&
    currentUser.roleId !== 11
  ) {
    throw new ForbiddenException('ທ່ານບໍ່ມີສິດປ່ຽນລະຫັດຜ່ານຂອງຜູ້ໃຊ້ນີ້');
  }
  const { password1, password2 } = dto;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new NotFoundException('User not found');

  if (password1 !== password2) {
    throw new BadRequestException('Password not match');
  }

  const hashedPassword = await bcrypt.hash(password1, 10);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return {
    statusCode: HttpStatus.OK,
    message: 'Change password successfully',
  };
}
