import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { CreateTotalDto } from '../dto/create-total.dto';
import { NotFoundException } from '@nestjs/common';

export async function createTotal(
  prisma: PrismaService,
  user: AuthUser,
  createTotalDto: CreateTotalDto,
) {
  const receiver = await prisma.user.findFirst({
    where: {
      id: createTotalDto.receiverId,
    },
    select: {
      id: true,
      roleId: true,
      departmentId: true,
      divisionId: true,
      officeId: true,
      unitId: true,
    },
  });
  if (!receiver) {
    throw new NotFoundException('Receiver not found');
  }

  let together = false;

  if (receiver.roleId === 7) {
    if (
      receiver.roleId === user.roleId &&
      receiver.unitId != null &&
      receiver.unitId === user.unitId
    ) {
      together = true;
    }
  } else if (receiver.roleId === 6) {
    if (
      receiver.roleId === user.roleId &&
      receiver.officeId != null &&
      receiver.officeId === user.officeId
    ) {
      together = true;
    }
  } else if (receiver.roleId === 5) {
    if (
      receiver.roleId === user.roleId &&
      receiver.divisionId != null &&
      receiver.divisionId === user.divisionId
    ) {
      together = true;
    }
  } else if (receiver.roleId === 4) {
    if (
      receiver.roleId === user.roleId &&
      receiver.departmentId != null &&
      receiver.departmentId === user.departmentId
    ) {
      together = true;
    }
  }

  const isSelf = Number(user.id) === Number(createTotalDto.receiverId);
  const finalRoleId = isSelf ? 9 : user.roleId;

  return prisma.total.create({
    data: {
      roleId: finalRoleId,
      giverId: user.id,
      receiverId: createTotalDto.receiverId,
      together,
      s1_1: createTotalDto.s1_1,
      s1_2: createTotalDto.s1_2,
      s1_3: createTotalDto.s1_3,
      s1_4: createTotalDto.s1_4,
      s1_5: createTotalDto.s1_5,
      s1_6: createTotalDto.s1_6,
      s1_score: createTotalDto.s1_score,
      s2_1: createTotalDto.s2_1,
      s2_2: createTotalDto.s2_2,
      s2_3: createTotalDto.s2_3,
      s2_4: createTotalDto.s2_4,
      s2_5: createTotalDto.s2_5,
      s2_score: createTotalDto.s2_score,
      s3_1: createTotalDto.s3_1,
      s3_2: createTotalDto.s3_2,
      s3_3: createTotalDto.s3_3,
      s3_score: createTotalDto.s3_score,
      s4_1: createTotalDto.s4_1,
      s4_2: createTotalDto.s4_2,
      s4_score: createTotalDto.s4_score,
      total_score: createTotalDto.total_score,
      percent_score: createTotalDto.percent_score,
    },
  });
}
