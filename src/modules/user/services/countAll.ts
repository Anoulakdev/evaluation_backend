import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { selectRole } from '../../role/services/selectRole';
import { getUser } from './getUser';

export interface RoleEvaluationSummary {
  roleId: number;
  roleName: string;
  total: number;
  evaluated: number;
  remaining: number;
  isCompleted: boolean;
}

export interface CountAllResult {
  total: number;
  evaluated: number;
  remaining: number;
  isAllCompleted: boolean;
  uniqueTotal: number;
  uniqueEvaluated: number;
  uniqueRemaining: number;
  approvedCount: number;
  isAllApproved: boolean;
  roles: RoleEvaluationSummary[];
}

export async function countAll(
  prisma: PrismaService,
  user: AuthUser,
): Promise<CountAllResult> {
  // 1. ดึงกลุ่มบทบาทเป้าหมายทั้งหมดที่ user คนนี้มีสิทธิ์ประเมิน
  const roles = await selectRole(prisma, user);

  if (!roles || roles.length === 0) {
    return {
      total: 0,
      evaluated: 0,
      remaining: 0,
      isAllCompleted: true,
      uniqueTotal: 0,
      uniqueEvaluated: 0,
      uniqueRemaining: 0,
      approvedCount: 0,
      isAllApproved: false,
      roles: [],
    };
  }

  // 2. ดึงข้อมูล Total ทั้งหมดของ user คนนี้เพียงครั้งเดียว เพื่อใช้คำนวณและลดการ Query ซ้ำซ้อน (Eliminate N+1)
  const userTotals = await prisma.total.findMany({
    where: { giverId: user.id },
    select: { id: true, receiverId: true, approve: true },
  });
  const evaluatedSet = new Set(userTotals.map((t) => t.receiverId));
  const approvedCount = userTotals.filter((t) => t.approve).length;

  // 3. ดึงรายชื่อพนักงานที่ต้องประเมินในแต่ละบทบาทแบบขนาน โดยส่ง evaluatedSet เข้าไป
  const roleResults = await Promise.all(
    roles.map(async (role) => {
      const usersInRole = await getUser(prisma, user, role.id, evaluatedSet);
      const total = usersInRole.length;
      const evaluated = usersInRole.filter((u) => u.isEvaluated).length;
      const remaining = Math.max(0, total - evaluated);

      return {
        roleId: role.id,
        roleName: role.name,
        total,
        evaluated,
        remaining,
        isCompleted: total > 0 && remaining === 0,
        users: usersInRole,
      };
    }),
  );

  // 4. สรุปรวมสถิติทั้งหมด
  let total = 0;
  let evaluated = 0;
  const uniqueUsers = new Set<number>();
  const uniqueEvaluatedUsers = new Set<number>();

  const roleSummaries: RoleEvaluationSummary[] = roleResults.map((r) => {
    total += r.total;
    evaluated += r.evaluated;

    for (const u of r.users) {
      uniqueUsers.add(u.id);
      if (u.isEvaluated) {
        uniqueEvaluatedUsers.add(u.id);
      }
    }

    return {
      roleId: r.roleId,
      roleName: r.roleName,
      total: r.total,
      evaluated: r.evaluated,
      remaining: r.remaining,
      isCompleted: r.isCompleted,
    };
  });

  const remaining = Math.max(0, total - evaluated);
  const uniqueTotal = uniqueUsers.size;
  const uniqueEvaluated = uniqueEvaluatedUsers.size;
  const uniqueRemaining = Math.max(0, uniqueTotal - uniqueEvaluated);

  const isAllApproved =
    total > 0 &&
    remaining === 0 &&
    userTotals.length >= total &&
    approvedCount === userTotals.length;

  return {
    total,
    evaluated,
    remaining,
    isAllCompleted: total > 0 && remaining === 0,
    uniqueTotal,
    uniqueEvaluated,
    uniqueRemaining,
    approvedCount,
    isAllApproved,
    roles: roleSummaries,
  };
}
