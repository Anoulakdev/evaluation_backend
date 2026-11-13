import { HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export async function removeUser(prisma: PrismaService, id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // ລຶບປະຫວັດການປະເມີນທີ່ກ່ຽວຂ້ອງທັງໝົດໃນ table Total (ທັງຜູ້ປະເມີນ ແລະ ຜູ້ຖືກປະເມີນ) ກ່ອນລຶບຜູ້ໃຊ້
  await prisma.$transaction([
    prisma.total.deleteMany({
      where: {
        OR: [{ giverId: id }, { receiverId: id }],
      },
    }),
    prisma.user.delete({
      where: { id },
    }),
  ]);

  return {
    statusCode: HttpStatus.OK,
    message: 'User deleted successfully',
    userId: id,
  };
}
