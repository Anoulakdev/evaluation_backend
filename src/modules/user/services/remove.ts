import { PrismaService } from '../../../prisma/prisma.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';

export async function removeUser(prisma: PrismaService, id: number) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await prisma.user.delete({ where: { id } });

  return {
    statusCode: HttpStatus.OK,
    message: 'User deleted successfully',
    userId: id,
  };
}
