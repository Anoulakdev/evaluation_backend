import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';

export async function checkEvaluation(
  prisma: PrismaService,
  user: AuthUser,
  receiverId: number,
) {
  if (!receiverId || isNaN(Number(receiverId))) {
    return false;
  }

  const existing = await prisma.total.findUnique({
    where: {
      giverId_receiverId: {
        giverId: user.id,
        receiverId: Number(receiverId),
      },
    },
    select: { id: true },
  });

  return !!existing;
}
