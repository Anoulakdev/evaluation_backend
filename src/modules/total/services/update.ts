import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { UpdateTotalDto } from '../dto/update-total.dto';
import { getSubtitleCount } from './subtitleHelper';

export async function updateTotal(
  prisma: PrismaService,
  user: AuthUser,
  id: number,
  dto: UpdateTotalDto,
) {
  const existing = await prisma.total.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundException('ບໍ່ພົບຂໍ້ມູນການປະເມີນນີ້');
  }

  if (existing.giverId !== user.id) {
    throw new ForbiddenException('ທ່ານບໍ່ມີສິດແກ້ໄຂການປະເມີນນີ້');
  }

  if (existing.approve) {
    throw new BadRequestException('ການປະເມີນນີ້ຖືກຢືນຢັນແລ້ວ ບໍ່ສາມາດແກ້ໄຂໄດ້');
  }

  const s1_1 = dto.s1_1 !== undefined ? Number(dto.s1_1) : existing.s1_1;
  const s1_2 = dto.s1_2 !== undefined ? Number(dto.s1_2) : existing.s1_2;
  const s1_3 = dto.s1_3 !== undefined ? Number(dto.s1_3) : existing.s1_3;
  const s1_4 = dto.s1_4 !== undefined ? Number(dto.s1_4) : existing.s1_4;
  const s1_5 = dto.s1_5 !== undefined ? Number(dto.s1_5) : existing.s1_5;
  const s1_6 = dto.s1_6 !== undefined ? Number(dto.s1_6) : existing.s1_6;
  const s1_score = s1_1 + s1_2 + s1_3 + s1_4 + s1_5 + s1_6;

  const s2_1 = dto.s2_1 !== undefined ? Number(dto.s2_1) : existing.s2_1;
  const s2_2 = dto.s2_2 !== undefined ? Number(dto.s2_2) : existing.s2_2;
  const s2_3 = dto.s2_3 !== undefined ? Number(dto.s2_3) : existing.s2_3;
  const s2_4 = dto.s2_4 !== undefined ? Number(dto.s2_4) : existing.s2_4;
  const s2_5 = dto.s2_5 !== undefined ? Number(dto.s2_5) : existing.s2_5;
  const s2_score = s2_1 + s2_2 + s2_3 + s2_4 + s2_5;

  const s3_1 = dto.s3_1 !== undefined ? Number(dto.s3_1) : existing.s3_1;
  const s3_2 = dto.s3_2 !== undefined ? Number(dto.s3_2) : existing.s3_2;
  const s3_3 = dto.s3_3 !== undefined ? Number(dto.s3_3) : existing.s3_3;
  const s3_score = s3_1 + s3_2 + s3_3;

  const s4_1 = dto.s4_1 !== undefined ? Number(dto.s4_1) : existing.s4_1;
  const s4_2 = dto.s4_2 !== undefined ? Number(dto.s4_2) : existing.s4_2;
  const s4_score = s4_1 + s4_2;

  const total_score = s1_score + s2_score + s3_score + s4_score;

  const subtitleCount = await getSubtitleCount(prisma);
  const maxPossibleScore = (subtitleCount || 16) * 10;
  const percent_score =
    maxPossibleScore > 0
      ? Number(((total_score / maxPossibleScore) * 100).toFixed(2))
      : 0;

  return prisma.total.update({
    where: { id },
    data: {
      s1_1,
      s1_2,
      s1_3,
      s1_4,
      s1_5,
      s1_6,
      s1_score,
      s2_1,
      s2_2,
      s2_3,
      s2_4,
      s2_5,
      s2_score,
      s3_1,
      s3_2,
      s3_3,
      s3_score,
      s4_1,
      s4_2,
      s4_score,
      total_score,
      percent_score,
    },
  });
}
