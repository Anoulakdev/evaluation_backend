import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';

export async function getEvaluationStatus(
  prisma: PrismaService,
  user: AuthUser,
  targetUserId?: number,
): Promise<boolean> {
  const userId = targetUserId ? Number(targetUserId) : user.id;

  const totals = await prisma.total.findMany({
    where: {
      giverId: userId,
    },
    select: {
      giverId: true,
      approve: true,
    },
    distinct: ['giverId', 'approve'],
  });

  const hasTrue = totals.some((t) => t.approve === true);
  const hasFalse = totals.some((t) => t.approve === false);

  // approve ຕ້ອງເປັນ true ທັງໝົດ (ມີ approve: true ແລະ ບໍ່ມີ approve: false)
  return hasTrue && !hasFalse;
}
