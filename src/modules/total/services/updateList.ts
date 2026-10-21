import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { countAll } from '../../user/services/countAll';

export async function updateList(
  prisma: PrismaService,
  user: AuthUser,
  input: number[] | { ids: number[] },
) {
  const rawIds = Array.isArray(input)
    ? input
    : Array.isArray(input?.ids)
      ? input.ids
      : [];

  const validIds = rawIds
    .map((id) => Number(id))
    .filter((id) => !isNaN(id) && id > 0);

  if (validIds.length === 0) {
    throw new BadRequestException(
      'ກະລຸນາສົ່ງ id ເປັນ array (ids is required and must not be empty)',
    );
  }

  const where: { id: { in: number[] }; giverId?: number } = {
    id: { in: validIds },
  };

  // Only SuperAdmin (role 1) can bulk-approve across different givers;
  // all other users can only approve evaluations they themselves created,
  // and must have completed evaluations for all assigned users.
  if (user.roleId !== 1) {
    where.giverId = user.id;

    const counts = await countAll(prisma, user);
    if (!counts.isAllCompleted) {
      throw new BadRequestException(
        `ທ່ານຍັງປະເມີນບໍ່ຄົບຕາມຈຳນວນທີ່ກຳນົດ (ຍັງເຫຼືອ ${counts.remaining} ທ່ານ)`,
      );
    }
  }

  const result = await prisma.total.updateMany({
    where,
    data: {
      approve: true,
    },
  });

  return {
    success: true,
    message: 'ອັບເດດສະຖານະອະນຸມັດສຳເລັດ',
    count: result.count,
  };
}
