import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';

export async function selectRole(prisma: PrismaService, user: AuthUser) {
  if (user.roleId === 1 || user.roleId === 13 || user.roleId === 14) {
    return prisma.role.findMany({
      where: {
        id: { in: [2, 3, 4, 5, 6, 7, 8, 9] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 11) {
    return prisma.role.findMany({
      where: {
        id: { in: [1, 12, 13, 14] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 9 && user.division?.branch_id === 1) {
    return prisma.role.findMany({
      where: {
        id: { in: [6, 8, 9, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 9 && user.division?.branch_id === 2) {
    return prisma.role.findMany({
      where: {
        id: { in: [7, 8, 9, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 8 && user.division?.branch_id === 1) {
    return prisma.role.findMany({
      where: {
        id: { in: [4, 5, 6, 8, 9, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 8 && user.division?.branch_id === 2) {
    return prisma.role.findMany({
      where: {
        id: { in: [6, 7, 8, 9, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 7) {
    return prisma.role.findMany({
      where: {
        id: { in: [6, 7, 8, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 6 && user.division?.branch_id === 1) {
    return prisma.role.findMany({
      where: {
        id: { in: [4, 5, 6, 8, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 6 && user.division?.branch_id === 2) {
    return prisma.role.findMany({
      where: {
        id: { in: [6, 7, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 5) {
    return prisma.role.findMany({
      where: {
        id: { in: [3, 4, 5, 6, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 4) {
    return prisma.role.findMany({
      where: {
        id: { in: [3, 4, 5, 6, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 3) {
    return prisma.role.findMany({
      where: {
        id: { in: [3, 4, 5, 10] },
      },
      orderBy: {
        id: 'asc',
      },
    });
  } else if (user.roleId === 2) {
    const allowedRoles = Number(user.id) === 8 ? [4, 5] : [3, 4, 5];
    return prisma.role.findMany({
      where: {
        id: { in: allowedRoles },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
  return [];
}
