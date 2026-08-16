import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export async function resultDetail(prisma: PrismaService, emp_code: string) {
  if (!emp_code || !emp_code.trim()) {
    throw new BadRequestException('emp_code is required');
  }

  const user = await prisma.user.findFirst({
    where: {
      emp_code: emp_code.trim(),
    },
    select: {
      id: true,
      roleId: true,
      division: {
        select: {
          id: true,
          branch_id: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const total = await prisma.total.findMany({
    where: {
      receiverId: user.id,
    },
    orderBy: {
      roleId: 'asc',
    },
    include: {
      giver: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          emp_code: true,
          empimg: true,
          departmentId: true,
        },
      },
      receiver: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          emp_code: true,
          empimg: true,
        },
      },
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const groupedByRole = total.reduce(
    (acc, item) => {
      const baseRoleName = item.role?.name || 'Unassigned';
      let suffix = '';

      if (item.together) {
        const targetRole = item.roleId;
        if (targetRole === 7) {
          suffix = ' (ພາຍໃນໜ່ວຍງານ)';
        } else if (targetRole === 6) {
          suffix = ' (ພາຍໃນຫ້ອງການ)';
        } else if (targetRole === 5) {
          suffix = ' (ພາຍໃນພະແນກ/ສູນ/ສາຂາ)';
        } else if (targetRole === 4) {
          suffix = ' (ພາຍໃນຝ່າຍ/ສະຖາບັນ/ຫ້ອງການ)';
        }
      }

      const roleName = `${baseRoleName}${suffix}`;

      if (!acc[roleName]) {
        acc[roleName] = {
          items: [],
          summary: null,
        };
      }
      acc[roleName].items.push(item);
      return acc;
    },
    {} as Record<string, { items: typeof total; summary: any }>,
  );

  // Compute sums and averages for each role group
  Object.keys(groupedByRole).forEach((roleName) => {
    const group = groupedByRole[roleName];
    const items = group.items;
    const count = items.length;
    if (count > 0) {
      const sumS1 = items.reduce(
        (sum: number, i: any) => sum + (i.s1_score || 0),
        0,
      );
      const sumS2 = items.reduce(
        (sum: number, i: any) => sum + (i.s2_score || 0),
        0,
      );
      const sumS3 = items.reduce(
        (sum: number, i: any) => sum + (i.s3_score || 0),
        0,
      );
      const sumS4 = items.reduce(
        (sum: number, i: any) => sum + (i.s4_score || 0),
        0,
      );
      const sumTotal = items.reduce(
        (sum: number, i: any) => sum + (i.total_score || 0),
        0,
      );
      const sumPercent = items.reduce(
        (sum: number, i: any) => sum + (i.percent_score || 0),
        0,
      );

      group.summary = {
        s1_score: sumS1,
        s2_score: sumS2,
        s3_score: sumS3,
        s4_score: sumS4,
        total_score: sumTotal,
        percent_score: Number(sumPercent.toFixed(2)),
        avg_s1_score: Number((sumS1 / count).toFixed(2)),
        avg_s2_score: Number((sumS2 / count).toFixed(2)),
        avg_s3_score: Number((sumS3 / count).toFixed(2)),
        avg_s4_score: Number((sumS4 / count).toFixed(2)),
        avg_total_score: Number((sumTotal / count).toFixed(2)),
        avg_percent_score: Number((sumPercent / count).toFixed(2)),
        count,
      };
    }
  });

  // 360 Degree Weight Percentage Calculation Matrix
  const receiverRoleId = user.roleId;
  const branchId = user.division?.branch_id;

  let weightedCalculation: any = null;

  const getAvg = (filterFn: (item: any) => boolean): number | null => {
    const matched = total.filter(filterFn);
    if (matched.length === 0) return null;
    const sum = matched.reduce((acc, i) => acc + (i.percent_score || 0), 0);
    return Number((sum / matched.length).toFixed(2));
  };

  const getCombined = (scores: (number | null)[]): number => {
    const valid = scores.filter((s): s is number => s !== null);
    if (valid.length === 0) return 0;
    const sum = valid.reduce((acc, s) => acc + s, 0);
    return Number((sum / valid.length).toFixed(2));
  };

  // Helper to resolve role name in Lao
  const getRoleName = (id: number): string => {
    const found = total.find((t) => t.roleId === id)?.role?.name;
    if (found) return found;
    const roleMap: Record<number, string> = {
      2: 'ຜູ້ອຳນວຍການໃຫຍ່',
      3: 'ຮອງຜູ້ອຳນວຍການໃຫ່ຍ',
      4: 'ຄະນະຝ່າຍ/ສະຖາບັນ/ຫ້ອງການ',
      5: 'ຄະນະພະແນກ/ສູນ/ສາຂາ',
      6: 'ຄະນະຫ້ອງການ',
      7: 'ຄະນະໜ່ວຍງານ',
      8: 'ວິຊາການ',
      9: 'ປະເມີນຕົນເອງ',
    };
    return roleMap[id] || `Role ${id}`;
  };

  if (receiverRoleId === 7) {
    // ----------------------------------------------------
    // ROLE ID 7 (ພະນັກງານທົ່ວໄປ)
    // ----------------------------------------------------
    const avg7True = getAvg((i) => i.roleId === 7 && i.together === true);
    const avg8 = getAvg((i) => i.roleId === 8);
    const validGroupAScores = [avg7True, avg8].filter(
      (s): s is number => s !== null,
    );
    const avgGroupA =
      validGroupAScores.length > 0
        ? Number(
            (
              validGroupAScores.reduce((acc, s) => acc + s, 0) /
              validGroupAScores.length
            ).toFixed(2),
          )
        : 95;
    const weightA = Number(((avgGroupA * 35) / 100).toFixed(2));

    const rawAvg7False = getAvg((i) => i.roleId === 7 && i.together === false);
    const avgGroupB = rawAvg7False !== null ? rawAvg7False : 95;
    const weightB = Number(((avgGroupB * 20) / 100).toFixed(2));

    const targetMiddleRoleId = branchId === 2 ? 6 : 5;
    const avgMiddle = getAvg((i) => i.roleId === targetMiddleRoleId) || 0;
    const weightC = Number(((avgMiddle * 30) / 100).toFixed(2));

    const avg9 = getAvg((i) => i.roleId === 9) || 0;
    const weightD = Number(((avg9 * 15) / 100).toFixed(2));

    const finalTotal = Number(
      (weightA + weightB + weightC + weightD).toFixed(2),
    );

    weightedCalculation = {
      receiver_roleId: 7,
      branch_id: branchId,
      groupA: {
        label: `${getRoleName(7)} (ພາຍໃນໜ່ວຍງານ) + ${getRoleName(8)}`,
        weight_percent: 35,
        avg_score: avgGroupA,
        weighted_score: weightA,
      },
      groupB: {
        label: `${getRoleName(7)}`,
        weight_percent: 20,
        avg_score: avgGroupB,
        weighted_score: weightB,
      },
      groupC: {
        label: branchId === 2 ? getRoleName(6) : getRoleName(5),
        weight_percent: 30,
        avg_score: avgMiddle,
        weighted_score: weightC,
      },
      groupD: {
        label: getRoleName(9),
        weight_percent: 15,
        avg_score: avg9,
        weighted_score: weightD,
      },
      final_weighted_total: finalTotal,
    };
  } else if (receiverRoleId === 6) {
    // ----------------------------------------------------
    // ROLE ID 6 (ຫົວໜ້າຫ້ອງການ)
    // ----------------------------------------------------
    const avg6True = getAvg((i) => i.roleId === 6 && i.together === true) || 0;
    const weightA = Number(((avg6True * 15) / 100).toFixed(2));

    const avg6False =
      getAvg((i) => i.roleId === 6 && i.together === false) || 0;
    const weightB = Number(((avg6False * 15) / 100).toFixed(2));

    const avg7 = getAvg((i) => i.roleId === 7);
    const avg8 = getAvg((i) => i.roleId === 8);
    const combinedSubordinates = getCombined([avg7, avg8]);
    const weightC = Number(((combinedSubordinates * 25) / 100).toFixed(2));

    const avg5 = getAvg((i) => i.roleId === 5) || 0;
    const weightD = Number(((avg5 * 30) / 100).toFixed(2));

    const avg9 = getAvg((i) => i.roleId === 9) || 0;
    const weightE = Number(((avg9 * 15) / 100).toFixed(2));

    const finalTotal = Number(
      (weightA + weightB + weightC + weightD + weightE).toFixed(2),
    );

    weightedCalculation = {
      receiver_roleId: 6,
      branch_id: branchId,
      groupA: {
        label: `${getRoleName(6)} (ພາຍໃນຫ້ອງການ)`,
        weight_percent: 15,
        avg_score: avg6True,
        weighted_score: weightA,
      },
      groupB: {
        label: `${getRoleName(6)}`,
        weight_percent: 15,
        avg_score: avg6False,
        weighted_score: weightB,
      },
      groupC: {
        label: `${getRoleName(7)} + ${getRoleName(8)}`,
        weight_percent: 25,
        avg_score: combinedSubordinates,
        weighted_score: weightC,
      },
      groupD: {
        label: getRoleName(5),
        weight_percent: 30,
        avg_score: avg5,
        weighted_score: weightD,
      },
      groupE: {
        label: getRoleName(9),
        weight_percent: 15,
        avg_score: avg9,
        weighted_score: weightE,
      },
      final_weighted_total: finalTotal,
    };
  } else if (receiverRoleId === 5) {
    // ----------------------------------------------------
    // ROLE ID 5 (ຫົວໜ້າພະແນກ)
    // ----------------------------------------------------
    let combinedSubordinates = 0;
    if (branchId === 2) {
      const avg6 = getAvg((i) => i.roleId === 6);
      const avg7 = getAvg((i) => i.roleId === 7);
      const avg8 = getAvg((i) => i.roleId === 8);
      combinedSubordinates = getCombined([avg6, avg7, avg8]);
    } else {
      const avg7 = getAvg((i) => i.roleId === 7);
      const avg8 = getAvg((i) => i.roleId === 8);
      combinedSubordinates = getCombined([avg7, avg8]);
    }
    const weightA = Number(((combinedSubordinates * 25) / 100).toFixed(2));

    const avg5True = getAvg((i) => i.roleId === 5 && i.together === true) || 0;
    const weightB = Number(((avg5True * 15) / 100).toFixed(2));

    const avg5False =
      getAvg((i) => i.roleId === 5 && i.together === false) || 0;
    const weightC = Number(((avg5False * 15) / 100).toFixed(2));

    const avg4 = getAvg((i) => i.roleId === 4) || 0;
    const weightD = Number(((avg4 * 30) / 100).toFixed(2));

    const avg9 = getAvg((i) => i.roleId === 9) || 0;
    const weightE = Number(((avg9 * 15) / 100).toFixed(2));

    const finalTotal = Number(
      (weightA + weightB + weightC + weightD + weightE).toFixed(2),
    );

    weightedCalculation = {
      receiver_roleId: 5,
      branch_id: branchId,
      groupA: {
        label:
          branchId === 2
            ? `${getRoleName(6)} + ${getRoleName(7)} + ${getRoleName(8)}`
            : `${getRoleName(7)} + ${getRoleName(8)}`,
        weight_percent: 25,
        avg_score: combinedSubordinates,
        weighted_score: weightA,
      },
      groupB: {
        label: `${getRoleName(5)} (ພາຍໃນພະແນກ/ສູນ/ສາຂາ)`,
        weight_percent: 15,
        avg_score: avg5True,
        weighted_score: weightB,
      },
      groupC: {
        label: `${getRoleName(5)}`,
        weight_percent: 15,
        avg_score: avg5False,
        weighted_score: weightC,
      },
      groupD: {
        label: getRoleName(4),
        weight_percent: 30,
        avg_score: avg4,
        weighted_score: weightD,
      },
      groupE: {
        label: getRoleName(9),
        weight_percent: 15,
        avg_score: avg9,
        weighted_score: weightE,
      },
      final_weighted_total: finalTotal,
    };
  } else if (receiverRoleId === 4) {
    // ----------------------------------------------------
    // ROLE ID 4 (ຫົວໜ້າຝ່າຍ)
    // ----------------------------------------------------
    const avg4True = getAvg((i) => i.roleId === 4 && i.together === true) || 0;
    const weightA = Number(((avg4True * 15) / 100).toFixed(2));

    const avg4False =
      getAvg((i) => i.roleId === 4 && i.together === false) || 0;
    const weightB = Number(((avg4False * 15) / 100).toFixed(2));

    const avg5 = getAvg((i) => i.roleId === 5);
    const avg7 = getAvg((i) => i.roleId === 7);
    const combinedSubordinates = getCombined([avg5, avg7]);
    const weightC = Number(((combinedSubordinates * 25) / 100).toFixed(2));

    const avg3 = getAvg((i) => i.roleId === 3) || 0;
    const weightD = Number(((avg3 * 30) / 100).toFixed(2));

    const avg9 = getAvg((i) => i.roleId === 9) || 0;
    const weightE = Number(((avg9 * 15) / 100).toFixed(2));

    const finalTotal = Number(
      (weightA + weightB + weightC + weightD + weightE).toFixed(2),
    );

    weightedCalculation = {
      receiver_roleId: 4,
      branch_id: branchId,
      groupA: {
        label: `${getRoleName(4)} (ພາຍໃນຝ່າຍ/ສະຖາບັນ/ຫ້ອງການ)`,
        weight_percent: 15,
        avg_score: avg4True,
        weighted_score: weightA,
      },
      groupB: {
        label: `${getRoleName(4)}`,
        weight_percent: 15,
        avg_score: avg4False,
        weighted_score: weightB,
      },
      groupC: {
        label: `${getRoleName(5)} + ${getRoleName(7)}`,
        weight_percent: 25,
        avg_score: combinedSubordinates,
        weighted_score: weightC,
      },
      groupD: {
        label: getRoleName(3),
        weight_percent: 30,
        avg_score: avg3,
        weighted_score: weightD,
      },
      groupE: {
        label: getRoleName(9),
        weight_percent: 15,
        avg_score: avg9,
        weighted_score: weightE,
      },
      final_weighted_total: finalTotal,
    };
  } else if (receiverRoleId === 3) {
    // ----------------------------------------------------
    // ROLE ID 3 (ຜູ້ບໍລິຫານ)
    // ----------------------------------------------------
    const avg2 = getAvg((i) => i.roleId === 2) || 0;
    const weightA = Number(((avg2 * 30) / 100).toFixed(2));

    const avg3 = getAvg((i) => i.roleId === 3) || 0;
    const weightB = Number(((avg3 * 15) / 100).toFixed(2));

    // Department IDs under direction for each receiver
    const directedDeptMap: Record<number, number[]> = {
      4: [6, 4, 22],
      5: [2],
      9: [2],
      3: [3, 21],
      6: [10, 11, 12],
      7: [8],
    };

    const targetDepts = directedDeptMap[user.id] || [];

    // Role 4 ທີ່ຖືກຊີ້ນຳ (25%)
    const avg4Directed =
      getAvg(
        (i) =>
          i.roleId === 4 &&
          i.giver?.departmentId &&
          targetDepts.includes(i.giver.departmentId),
      ) || 0;
    const weightC = Number(((avg4Directed * 25) / 100).toFixed(2));

    // Role 4 ທີ່ບໍ່ໄດ້ຖືກຊີ້ນຳ (15%)
    const avg4Undirected =
      getAvg(
        (i) =>
          i.roleId === 4 &&
          (!i.giver?.departmentId ||
            !targetDepts.includes(i.giver.departmentId)),
      ) || 0;
    const weightD = Number(((avg4Undirected * 15) / 100).toFixed(2));

    const avg9 = getAvg((i) => i.roleId === 9) || 0;
    const weightE = Number(((avg9 * 15) / 100).toFixed(2));

    const finalTotal = Number(
      (weightA + weightB + weightC + weightD + weightE).toFixed(2),
    );

    weightedCalculation = {
      receiver_roleId: 3,
      branch_id: branchId,
      groupA: {
        label: getRoleName(2),
        weight_percent: 30,
        avg_score: avg2,
        weighted_score: weightA,
      },
      groupB: {
        label: getRoleName(3),
        weight_percent: 15,
        avg_score: avg3,
        weighted_score: weightB,
      },
      groupC: {
        label: `${getRoleName(4)} (ຄະນະຝ່າຍຊີ້ນຳ)`,
        weight_percent: 25,
        avg_score: avg4Directed,
        weighted_score: weightC,
      },
      groupD: {
        label: `${getRoleName(4)}`,
        weight_percent: 15,
        avg_score: avg4Undirected,
        weighted_score: weightD,
      },
      groupE: {
        label: getRoleName(9),
        weight_percent: 15,
        avg_score: avg9,
        weighted_score: weightE,
      },
      final_weighted_total: finalTotal,
    };
  }

  return {
    ...groupedByRole,
    ...(weightedCalculation
      ? { _weightedCalculation: weightedCalculation }
      : {}),
  };
}
