import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';

export async function resultList(prisma: PrismaService, user: AuthUser) {
  const result = await prisma.total.findMany({
    where: {
      giverId: user.id,
    },
    include: {
      receiver: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          emp_code: true,
          empimg: true,
          gender: true,
          roleId: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
            select: {
              id: true,
              department_name: true,
            },
          },
          division: {
            select: {
              id: true,
              division_name: true,
            },
          },
          office: {
            select: {
              id: true,
              office_name: true,
            },
          },
          unit: {
            select: {
              id: true,
              unit_name: true,
            },
          },
          position: {
            select: {
              id: true,
              pos_name: true,
            },
          },
        },
      },
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      { receiver: { roleId: 'asc' } },
      {
        receiver: {
          division: {
            division_code: 'asc',
          },
        },
      },
      {
        receiver: {
          position: {
            poscodeId: 'asc',
          },
        },
      },
      { receiver: { rank: 'asc' } },
      { receiver: { emp_code: 'asc' } },
    ],
  });

  return result;
}
