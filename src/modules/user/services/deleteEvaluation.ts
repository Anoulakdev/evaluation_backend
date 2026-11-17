import { HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export async function deleteEvaluation(
  prisma: PrismaService,
  giverId: number,
) {
  const user = await prisma.user.findUnique({
    where: { id: giverId },
    select: { id: true, username: true, first_name: true, last_name: true },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const result = await prisma.total.deleteMany({
    where: {
      giverId,
    },
  });

  return {
    statusCode: HttpStatus.OK,
    message: 'Delete evaluation successfully',
    deletedCount: result.count,
    giverId,
  };
}
