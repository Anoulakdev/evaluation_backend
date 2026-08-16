import { PrismaService } from '../../../prisma/prisma.service';

export async function selectUnit(
  prisma: PrismaService,
  divisionId?: number,
  officeId?: number,
) {
  let where: any = {};

  if (divisionId) {
    const division = await prisma.division.findUnique({
      where: { id: Number(divisionId) },
      select: { branch_id: true },
    });

    if (division?.branch_id === 1) {
      // สำหรับ Division ที่เป็นสำนักงานใหญ่ (branch_id = 1) -> กรองด้วย divisionId
      where = { divisionId: Number(divisionId) };
    } else if (officeId) {
      // สำหรับ Division ที่เป็นสาขา (branch_id = 2 หรืออื่นๆ) ถ้าส่ง officeId มา -> กรองด้วย officeId
      where = { officeId: Number(officeId) };
    } else {
      // ถ้าเป็นสาขาแต่ยังไม่ได้ส่ง officeId มา -> กรองด้วย Office ใน Division นั้น
      where = { office: { divisionId: Number(divisionId) } };
    }
  } else if (officeId) {
    where = { officeId: Number(officeId) };
  }

  return prisma.unit.findMany({
    where: where,
    orderBy: {
      id: 'asc',
    },
    include: {
      division: true,
      office: true,
    },
  });
}
