import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { Prisma } from '../../../../generated/prisma/client';

export async function getUser(
  prisma: PrismaService,
  user: AuthUser,
  roleId: number,
) {
  let where: Prisma.UserWhereInput | undefined;
  const targetRoleId = Number(roleId);

  if (user.roleId === 8 && user.division?.branch_id === 1) {
    if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 7) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        unitId: user.unitId,
      };
    }
  } else if (user.roleId === 8 && user.division?.branch_id === 2) {
    if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 6) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        officeId: user.officeId,
      };
    } else if (targetRoleId === 7) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        unitId: user.unitId,
      };
    }
  } else if (user.roleId === 7 && user.division?.branch_id === 1) {
    if (targetRoleId === 4) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 7) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 9) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 7 && user.division?.branch_id === 2) {
    if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 6) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        officeId: user.officeId,
      };
    } else if (targetRoleId === 7) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        officeId: user.officeId,
      };
    } else if (targetRoleId === 9) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 6) {
    if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 6) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 7) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        officeId: user.officeId,
      };
    } else if (targetRoleId === 9) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 5 && user.division?.branch_id === 1) {
    if (targetRoleId === 4) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 7) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 9) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 5 && user.division?.branch_id === 2) {
    if (targetRoleId === 4) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 6) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 9) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 4) {
    if (targetRoleId === 3) {
      where = {
        roleId: targetRoleId,
        status: 'A',
      };
    } else if (targetRoleId === 4) {
      where = {
        roleId: targetRoleId,
        status: 'A',
      };
    } else if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 9) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 3) {
    if (targetRoleId === 3) {
      where = {
        roleId: targetRoleId,
        status: 'A',
      };
    } else if (targetRoleId === 4) {
      where = {
        roleId: targetRoleId,
        status: 'A',
      };
    } else if (targetRoleId === 9) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 2) {
    if (targetRoleId === 3) {
      where = {
        roleId: targetRoleId,
        status: 'A',
      };
    }
  }

  if (!where) {
    return [];
  }

  if (targetRoleId !== 9) {
    where.id = { not: user.id };
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: [
      { roleId: 'asc' },
      { departmentId: 'asc' },
      { divisionId: 'asc' },
      { officeId: 'asc' },
      { unitId: 'asc' },
      { posId: 'asc' },
      { emp_code: 'asc' },
    ],
    select: {
      id: true,
      first_name: true,
      last_name: true,
      emp_code: true,
      empimg: true,
    },
  });

  if (users.length === 0) return [];

  const userIds = users.map((u) => u.id);
  const evaluations = await prisma.total.findMany({
    where: {
      giverId: user.id,
      receiverId: { in: userIds },
    },
    select: {
      receiverId: true,
    },
  });

  const evaluatedSet = new Set(evaluations.map((e) => e.receiverId));

  return users.map((u) => ({
    ...u,
    isEvaluated: evaluatedSet.has(u.id),
  }));
}
