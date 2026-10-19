import * as dotenv from 'dotenv';
import { PrismaService } from '../src/prisma/prisma.service';
import { createUser } from '../src/modules/user/services/create';

// Sync service imports (Required to populate master data tables so employee foreign keys don't fail)
import { syncData as createDepartment } from '../src/modules/department/services/syncData';
import { syncData as createDivision } from '../src/modules/division/services/syncData';
import { syncData as createOffice } from '../src/modules/office/services/syncData';
import { syncData as createUnit } from '../src/modules/unit/services/syncData';
import { createPositionGroup } from '../src/modules/positiongroup/services/create';
import { createPositionCode } from '../src/modules/positioncode/services/create';
import { createPosition } from '../src/modules/position/services/create';

dotenv.config();

async function main() {
  const prisma = new PrismaService();

  console.log('Start seeding...');

  try {
    // 1. Seed Roles
    console.log('Seeding roles...');
    const roles = [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'ຜູ້ອຳນວຍການ' },
      { id: 3, name: 'ຮອງຜູ້ອຳນວຍການ' },
      { id: 4, name: 'ຫົວໜ້າຝ່າຍ/ສະຖາບັນ/ຫ້ອງການ' },
      { id: 5, name: 'ຮອງຫົວໜ້າຝ່າຍ/ສະຖາບັນ/ຫ້ອງການ' },
      { id: 6, name: 'ຄະນະພະແນກ/ສູນ/ສາຂາ' },
      { id: 7, name: 'ຄະນະຫ້ອງການ' },
      { id: 8, name: 'ຄະນະໜ່ວຍງານ' },
      { id: 9, name: 'ວິຊາການ' },
      { id: 10, name: 'ຕົນເອງ' },
      { id: 11, name: 'SuperAdmin' },
      { id: 12, name: 'Boss' },
      { id: 13, name: 'AdminDepartment' },
      { id: 14, name: 'AdminBranch' },
    ];
    for (const r of roles) {
      await prisma.role.upsert({
        where: { id: r.id },
        update: { name: r.name },
        create: { id: r.id, name: r.name },
      });
    }

    console.log('Seeding title...');
    const titles = [
      { id: 1, name: 'ຄວາມເປັນຜູ້ນໍາ ແລະ ການສ້າງແຮງຈູງໃຈ' },
      { id: 2, name: 'ແນວທາງການປະຕິບັດວຽກງານ ແລະ ການບໍລິຫານ' },
      { id: 3, name: 'ການສື່ສານ ແລະ ມະນຸດສຳພັນ' },
      { id: 4, name: 'ປະຕິບັດລະບຽບ ແລະ ຈັນຍາບັນ' },
    ];
    for (const t of titles) {
      await prisma.title.upsert({
        where: { id: t.id },
        update: { name: t.name },
        create: { id: t.id, name: t.name },
      });
    }

    console.log('Seeding subTitle...');
    const subTitles = [
      { id: 1, titleId: 1, name: 'ມີຄວາມຍຸດຕິທຳ, ຮັບຟັງຄວາມຄິດເຫັນຂອງທີມງານ.' },
      {
        id: 2,
        titleId: 1,
        name: 'ມີຄວາມຮັບຜິດຊອບຕໍ່ຄວາມຜິດພາດຂອງຕົນ ແລະ ຂອງທີມງານ.',
      },
      {
        id: 3,
        titleId: 1,
        name: 'ເສຍສະຫຼະເພື່ອສ່ວນລວມ ກໍຄືການຈັດຕັ້ງ ຟຟລ ຫຼາຍກວ່າສ່ວນຕົວ.',
      },
      {
        id: 4,
        titleId: 1,
        name: 'ສາມາດສ້າງແຮງຈູງໃຈ ແລະ ຊຸກຍູ້ໃຫ້ທີມງານຢາກພັດທະນາຕົນເອງ.',
      },
      {
        id: 5,
        titleId: 1,
        name: 'ມີການຍ້ອງຍໍຊົມເຊີຍຕໍ່ທີມງານ ກໍລະນີມີຜົນງານ ແລະ ມີການຄຳແນະນຳແນວທາງເພື່ອແກ້ໄຂຈຸດອ່ອນ ເປັນການກໍ່ສ້າງເຊິ່ງກັນ ແລະ ກັນ.',
      },
      {
        id: 6,
        titleId: 1,
        name: '(ສໍາລັບລະດັບສູງ: ຮອງຜູ້ອໍານວຍການ-ຮອງຝ່າຍ) ມີວິໄສທັດ ສາມາດກຳນົດທິດທາງ ແລະ ເປົ້າໝາຍ ຍຸດທະສາດ ໄດ້ຢ່າງຊັດເຈນ.',
      },
      {
        id: 7,
        titleId: 2,
        name: 'ມອບໝາຍວຽກງານຊັດເຈນ, ເໝາະສົມກັບຄວາມສາມາດຂອງບຸກຄະລາກອນ.',
      },
      {
        id: 8,
        titleId: 2,
        name: 'ການບໍລິຫານການປ່ຽນແປງວິທີການເຮັດວຽກ ເພື່ອໃຫ້ພັດທະນາການຈັດຕັ້ງຕົນ.',
      },
      {
        id: 9,
        titleId: 2,
        name: 'ມີຄວາມຫ້າວຫັນ, ຄວາມຄິດລິເລີ່ມ ແລະ ຫົວຄິດປະດິດສ້າງ ໃນການນໍາໃຊ້ເຄື່ອງມື ແລະ ເຕັກໂນໂລຊີ ເຂົ້າໃນວຽກງານ.',
      },
      {
        id: 10,
        titleId: 2,
        name: 'ການແກ້ໄຂບັນຫາສະເພາະໜ້າ ແລະ ຕັດສິນໃຈໃນວຽກງານໄດ້ຢ່າງເໝາະສົມ ທັນການ.',
      },
      {
        id: 11,
        titleId: 2,
        name: 'ຕິດຕາມ ແລະ ໃຫ້ຄຳແນະນຳ ເພື່ອຊ່ວຍເຫຼືອທິມງານໃນການແກ້ໄຂບັນຫາວຽກງານ.',
      },
      {
        id: 12,
        titleId: 3,
        name: 'ສື່ສານຄຳສັ່ງ ນະໂຍບາຍ ແລະ ຂໍ້ມູນຕ່າງໆ ຈາກຂັ້ນເທິງໃຫ້ທີມງານຮັບຊາບຢ່າງຄົບຖ້ວນ ແລະ ຊັດເຈນ.',
      },
      {
        id: 13,
        titleId: 3,
        name: 'ສາມາດຄວບຄຸມອາລົມໄດ້ດີໃນສະຖານະການທີ່ມີຄວາມກົດດັນ ຫຼື ເມື່ອເກີດຄວາມຂັດແຍ່ງ.',
      },
      {
        id: 14,
        titleId: 3,
        name: 'ມີມະນຸດສຳພັນດີ.',
      },
      {
        id: 15,
        titleId: 4,
        name: 'ປະຕິບັດໂຕເປັນແບບຢ່າງທີ່ດີ ໃນການຮັກສາລະບຽບວິໃນ, ເຄົາລົບການຈັດຕັ້ງ ແລະ ຈັນຍາບັນຂອງບໍລິສັດ.',
      },
      {
        id: 16,
        titleId: 4,
        name: 'ມີຄວາມຊື່ສັດບໍລິສຸດ, ໂປ່ງໃສ ໃນການບໍລິຫານວຽກງານ ແລະ ບຸກຄະລາກອນ.',
      },
    ];
    for (const t of subTitles) {
      await prisma.subTitle.upsert({
        where: { id: t.id },
        update: { titleId: t.titleId, name: t.name },
        create: { id: t.id, titleId: t.titleId, name: t.name },
      });
    }

    console.log('Seeding scores...');
    const scores = [
      { id: 1, sc_num: 1 },
      { id: 2, sc_num: 2 },
      { id: 3, sc_num: 3 },
      { id: 4, sc_num: 4 },
      { id: 5, sc_num: 5 },
      { id: 6, sc_num: 6 },
      { id: 7, sc_num: 7 },
      { id: 8, sc_num: 8 },
      { id: 9, sc_num: 9 },
      { id: 10, sc_num: 10 },
    ];
    for (const s of scores) {
      await prisma.score.upsert({
        where: { id: s.id },
        update: { sc_num: s.sc_num },
        create: { id: s.id, sc_num: s.sc_num },
      });
    }

    // 2. Sync Master Data sequentially (handling dependencies)
    // This is REQUIRED because Employee creation references these tables via Foreign Keys.
    console.log('Syncing departments...');
    await createDepartment(prisma);

    console.log('Syncing divisions...');
    await createDivision(prisma);

    console.log('Syncing offices...');
    await createOffice(prisma);

    console.log('Syncing units...');
    await createUnit(prisma);

    console.log('Syncing position groups...');
    await createPositionGroup(prisma);

    console.log('Syncing position codes...');
    await createPositionCode(prisma);

    console.log('Syncing positions...');
    await createPosition(prisma);

    // 3. Seed User
    const usersToSeed = [
      { username: 'admin', roleId: 1 },
      { username: '44276', roleId: 2 },
      { username: '44334', roleId: 3 },
      { username: '12840', roleId: 3 },
      { username: '27057', roleId: 3 },
      { username: '38811', roleId: 3 },
      { username: '35408', roleId: 3 },
      { username: '44697', roleId: 2 },
      { username: 'TTT', roleId: 11 },
      { username: 'vankham', roleId: 12 },
    ];

    const results: any[] = [];
    for (const user of usersToSeed) {
      console.log(`Seeding user ${user.username}...`);
      const existingUser = await prisma.user.findUnique({
        where: { username: user.username },
      });

      if (!existingUser) {
        const result = await createUser(prisma, user);
        results.push(result);
      } else {
        console.log(`User ${user.username} already exists, skipping.`);
      }
    }

    console.log(
      'Seeding completed successfully:',
      JSON.stringify(results, null, 2),
    );
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

//npx prisma db seed
