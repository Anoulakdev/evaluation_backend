import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';

export async function checkEvaluation(
  prisma: PrismaService,
  user: AuthUser,
  receiverId: number,
) {
  const count = await prisma.total.count({
    where: {
      giverId: user.id,
      receiverId: Number(receiverId),
    },
  });

  return count > 0;
}
