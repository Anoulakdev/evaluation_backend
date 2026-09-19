import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { CreateTotalDto } from '../dto/create-total.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export async function createTotal(
  prisma: PrismaService,
  user: AuthUser,
  createTotalDto: CreateTotalDto,
) {
  const receiverId = Number(createTotalDto.receiverId);

  const receiver = await prisma.user.findUnique({
    where: {
      id: receiverId,
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

  const existingTotal = await prisma.total.findFirst({
    where: {
      giverId: user.id,
      receiverId: receiverId,
    },
  });
  if (existingTotal) {
    throw new BadRequestException('ທ່ານໄດ້ປະເມີນພະນັກງານຄົນນີ້ແລ້ວ');
  }

  const isSelf = Number(user.id) === receiverId;
  const finalRoleId = isSelf ? 10 : user.roleId;

  let together = false;

  if (!isSelf) {
    if (receiver.roleId === 8) {
      if (
        user.roleId === 8 &&
        receiver.unitId != null &&
        receiver.unitId === user.unitId
      ) {
        together = true;
      }
    } else if (receiver.roleId === 7) {
      if (
        user.roleId === 7 &&
        receiver.officeId != null &&
        receiver.officeId === user.officeId
      ) {
        together = true;
      }
    } else if (receiver.roleId === 6) {
      if (
        user.roleId === 6 &&
        receiver.divisionId != null &&
        receiver.divisionId === user.divisionId
      ) {
        together = true;
      }
    } else if (receiver.roleId === 5) {
      if (
        (user.roleId === 4 || user.roleId === 5) &&
        receiver.departmentId != null &&
        receiver.departmentId === user.departmentId
      ) {
        together = true;
      }
    } else if (receiver.roleId === 4) {
      if (
        user.roleId === 5 &&
        receiver.departmentId != null &&
        receiver.departmentId === user.departmentId
      ) {
        together = true;
      }
    }
  }

  const s1_score =
    createTotalDto.s1_1 +
    createTotalDto.s1_2 +
    createTotalDto.s1_3 +
    createTotalDto.s1_4 +
    createTotalDto.s1_5 +
    createTotalDto.s1_6;
  const s2_score =
    createTotalDto.s2_1 +
    createTotalDto.s2_2 +
    createTotalDto.s2_3 +
    createTotalDto.s2_4 +
    createTotalDto.s2_5;
  const s3_score =
    createTotalDto.s3_1 + createTotalDto.s3_2 + createTotalDto.s3_3;
  const s4_score = createTotalDto.s4_1 + createTotalDto.s4_2;
  const total_score = s1_score + s2_score + s3_score + s4_score;

  const subtitleCount = await prisma.subTitle.count();
  const maxPossibleScore = (subtitleCount || 16) * 10;
  const percent_score =
    maxPossibleScore > 0
      ? Number(((total_score / maxPossibleScore) * 100).toFixed(2))
      : 0;

  return prisma.total.create({
    data: {
      roleId: finalRoleId,
      giverId: user.id,
      receiverId,
      together,
      s1_1: createTotalDto.s1_1,
      s1_2: createTotalDto.s1_2,
      s1_3: createTotalDto.s1_3,
      s1_4: createTotalDto.s1_4,
      s1_5: createTotalDto.s1_5,
      s1_6: createTotalDto.s1_6,
      s1_score,
      s2_1: createTotalDto.s2_1,
      s2_2: createTotalDto.s2_2,
      s2_3: createTotalDto.s2_3,
      s2_4: createTotalDto.s2_4,
      s2_5: createTotalDto.s2_5,
      s2_score,
      s3_1: createTotalDto.s3_1,
      s3_2: createTotalDto.s3_2,
      s3_3: createTotalDto.s3_3,
      s3_score,
      s4_1: createTotalDto.s4_1,
      s4_2: createTotalDto.s4_2,
      s4_score,
      total_score,
      percent_score,
    },
  });
}
