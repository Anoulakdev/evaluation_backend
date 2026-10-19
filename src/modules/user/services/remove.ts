import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export async function removeUser(prisma: PrismaService, id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          givers: true,
          receivers: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user._count.givers > 0 || user._count.receivers > 0) {
    throw new BadRequestException(
      'ບໍ່ສາມາດລຶບຜູ້ໃຊ້ນີ້ໄດ້ ເນື່ອງຈາກມີປະຫວັດການປະເມີນຢູ່ໃນລະບົບ (ແນະນຳໃຫ້ປ່ຽນສະຖານະເປັນ Inactive ແທນ)',
    );
  }

  await prisma.user.delete({ where: { id } });

  return {
    statusCode: HttpStatus.OK,
    message: 'User deleted successfully',
    userId: id,
  };
}
