import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';

export async function selectRole(prisma: PrismaService, user: AuthUser) {
  if (user.roleId === 1) {
    return prisma.role.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 8 && user.division?.branch_id === 1) {
    return prisma.role.findMany({
      where: {
        id: { in: [5, 7] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 8 && user.division?.branch_id === 2) {
    return prisma.role.findMany({
      where: {
        id: { in: [5, 6, 7] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 7 && user.division?.branch_id === 1) {
    return prisma.role.findMany({
      where: {
        id: { in: [4, 5, 7, 9] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 7 && user.division?.branch_id === 2) {
    return prisma.role.findMany({
      where: {
        id: { in: [5, 6, 7, 9] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 6) {
    return prisma.role.findMany({
      where: {
        id: { in: [5, 6, 7, 9] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 5 && user.division?.branch_id === 1) {
    return prisma.role.findMany({
      where: {
        id: { in: [4, 5, 7, 9] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 5 && user.division?.branch_id === 2) {
    return prisma.role.findMany({
      where: {
        id: { in: [4, 5, 6, 9] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 4) {
    return prisma.role.findMany({
      where: {
        id: { in: [3, 4, 5, 9] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 3) {
    return prisma.role.findMany({
      where: {
        id: { in: [3, 4, 9] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 2) {
    return prisma.role.findMany({
      where: {
        id: { in: [3] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
  return [];
}
