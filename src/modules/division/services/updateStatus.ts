import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export async function updateStatus(
  prisma: PrismaService,
  id: number,
  actived: string,
) {
  const division = await prisma.division.findUnique({ where: { id } });

  if (!division) {
    throw new NotFoundException(`Division with ID ${id} not found`);
  }

  // Optional: validate allowed status values
  const allowedStatuses = ['A', 'C']; // A = Active, C = Inactive
  if (!allowedStatuses.includes(actived)) {
    throw new BadRequestException(
      'Invalid status value. Allowed values are A (Active) or C (Inactive)',
    );
  }

  await prisma.division.update({
    where: { id },
    data: { division_status: actived },
  });

  return {
    statusCode: HttpStatus.OK,
    message: 'Update status successfully',
  };
}
