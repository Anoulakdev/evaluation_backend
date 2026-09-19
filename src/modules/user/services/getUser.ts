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

  if (user.roleId === 9 && user.division?.branch_id === 1) {
    if (targetRoleId === 6) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 8) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        unitId: user.unitId,
      };
    }
  } else if (user.roleId === 9 && user.division?.branch_id === 2) {
    if (targetRoleId === 7) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        officeId: user.officeId,
      };
    } else if (targetRoleId === 8) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        unitId: user.unitId,
      };
    }
  } else if (user.roleId === 8 && user.division?.branch_id === 1) {
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
    } else if (targetRoleId === 8) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 10) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 8 && user.division?.branch_id === 2) {
    if (targetRoleId === 6) {
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
    } else if (targetRoleId === 8) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        officeId: user.officeId,
      };
    } else if (targetRoleId === 10) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 7) {
    if (targetRoleId === 6) {
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
    } else if (targetRoleId === 8) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        officeId: user.officeId,
      };
    } else if (targetRoleId === 10) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 6 && user.division?.branch_id === 1) {
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
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 8) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 10) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 6 && user.division?.branch_id === 2) {
    if (targetRoleId === 6) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        division: user.division,
      };
    } else if (targetRoleId === 7) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        divisionId: user.divisionId,
      };
    } else if (targetRoleId === 10) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 5) {
    if (targetRoleId === 3) {
      const deptToSupervisorMap: Record<number, number> = {
        2: 3,
        10: 4,
        11: 4,
        12: 4,
        21: 5,
        3: 5,
        22: 5,
        8: 6,
        6: 7,
        4: 7,
      };
      const targetUserId = user.departmentId
        ? deptToSupervisorMap[user.departmentId]
        : undefined;

      where = {
        roleId: targetRoleId,
        status: 'A',
        id: targetUserId ? targetUserId : -1,
      };
    } else if (targetRoleId === 4) {
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
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 10) {
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
    } else if (targetRoleId === 6) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: user.departmentId,
      };
    } else if (targetRoleId === 10) {
      where = {
        id: user.id,
        status: 'A',
      };
    }
  } else if (user.roleId === 3) {
    const directedDeptMap: Record<number, number[]> = {
      3: [2],
      4: [10, 11, 12],
      5: [21, 3, 22],
      6: [8],
      7: [6, 4],
    };
    const targetDepts = directedDeptMap[user.id] || [];

    if (targetRoleId === 3) {
      where = {
        roleId: targetRoleId,
        status: 'A',
      };
    } else if (targetRoleId === 4) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: { in: targetDepts },
      };
    } else if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: { in: targetDepts },
      };
    } else if (targetRoleId === 10) {
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
    } else if (targetRoleId === 4) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: { in: [1, 9] },
      };
    } else if (targetRoleId === 5) {
      where = {
        roleId: targetRoleId,
        status: 'A',
        departmentId: { in: [1, 9] },
      };
    }
  }

  if (!where) {
    return [];
  }

  if (targetRoleId !== 10) {
    if (where.id && typeof where.id === 'object') {
      where.id = { ...where.id, not: user.id };
    } else if (typeof where.id === 'number') {
      where.id = { equals: where.id, not: user.id };
    } else {
      where.id = { not: user.id };
    }
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
