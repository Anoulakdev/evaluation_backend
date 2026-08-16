-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "roleId" INTEGER NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "emp_code" VARCHAR(255),
    "gender" VARCHAR(255),
    "tel" VARCHAR(255),
    "email" VARCHAR(255),
    "empimg" VARCHAR(255),
    "posId" INTEGER,
    "departmentId" INTEGER,
    "divisionId" INTEGER,
    "officeId" INTEGER,
    "unitId" INTEGER,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL,
    "department_name" VARCHAR(255),
    "department_code" VARCHAR(50),
    "department_status" VARCHAR(50) NOT NULL DEFAULT 'A',

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" INTEGER NOT NULL,
    "division_name" VARCHAR(255),
    "division_code" VARCHAR(50),
    "division_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "branch_id" INTEGER,
    "short_name" VARCHAR(255),
    "insur_code" VARCHAR(255),
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Office" (
    "id" INTEGER NOT NULL,
    "office_name" VARCHAR(255),
    "office_code" VARCHAR(50),
    "office_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "divisionId" INTEGER,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" INTEGER NOT NULL,
    "unit_name" VARCHAR(255),
    "unit_code" VARCHAR(50),
    "unit_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "unit_type" VARCHAR(50),
    "divisionId" INTEGER,
    "officeId" INTEGER,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionGroup" (
    "id" INTEGER NOT NULL,
    "pos_group_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "PositionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionCode" (
    "id" INTEGER NOT NULL,
    "pos_code_name" VARCHAR(255) NOT NULL,
    "pos_code_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "posgroupId" INTEGER,

    CONSTRAINT "PositionCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" INTEGER NOT NULL,
    "pos_name" VARCHAR(255) NOT NULL,
    "pos_status" VARCHAR(50) NOT NULL DEFAULT 'A',
    "poscodeId" INTEGER,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Title" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTitle" (
    "id" SERIAL NOT NULL,
    "titleId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SubTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "sc_num" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Total" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "giverId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "together" BOOLEAN NOT NULL DEFAULT false,
    "s1_1" INTEGER NOT NULL DEFAULT 0,
    "s1_2" INTEGER NOT NULL DEFAULT 0,
    "s1_3" INTEGER NOT NULL DEFAULT 0,
    "s1_4" INTEGER NOT NULL DEFAULT 0,
    "s1_5" INTEGER NOT NULL DEFAULT 0,
    "s1_6" INTEGER NOT NULL DEFAULT 0,
    "s1_score" INTEGER NOT NULL DEFAULT 0,
    "s2_1" INTEGER NOT NULL DEFAULT 0,
    "s2_2" INTEGER NOT NULL DEFAULT 0,
    "s2_3" INTEGER NOT NULL DEFAULT 0,
    "s2_4" INTEGER NOT NULL DEFAULT 0,
    "s2_5" INTEGER NOT NULL DEFAULT 0,
    "s2_score" INTEGER NOT NULL DEFAULT 0,
    "s3_1" INTEGER NOT NULL DEFAULT 0,
    "s3_2" INTEGER NOT NULL DEFAULT 0,
    "s3_3" INTEGER NOT NULL DEFAULT 0,
    "s3_score" INTEGER NOT NULL DEFAULT 0,
    "s4_1" INTEGER NOT NULL DEFAULT 0,
    "s4_2" INTEGER NOT NULL DEFAULT 0,
    "s4_score" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "percent_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "Total_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_emp_code_key" ON "User"("emp_code");

-- CreateIndex
CREATE INDEX "User_departmentId_idx" ON "User"("departmentId");

-- CreateIndex
CREATE INDEX "User_divisionId_idx" ON "User"("divisionId");

-- CreateIndex
CREATE INDEX "User_officeId_idx" ON "User"("officeId");

-- CreateIndex
CREATE INDEX "User_unitId_idx" ON "User"("unitId");

-- CreateIndex
CREATE INDEX "User_posId_idx" ON "User"("posId");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_status_roleId_idx" ON "User"("status", "roleId");

-- CreateIndex
CREATE INDEX "User_divisionId_status_idx" ON "User"("divisionId", "status");

-- CreateIndex
CREATE INDEX "User_officeId_status_idx" ON "User"("officeId", "status");

-- CreateIndex
CREATE INDEX "User_unitId_status_idx" ON "User"("unitId", "status");

-- CreateIndex
CREATE INDEX "User_departmentId_status_idx" ON "User"("departmentId", "status");

-- CreateIndex
CREATE INDEX "Division_departmentId_idx" ON "Division"("departmentId");

-- CreateIndex
CREATE INDEX "Office_divisionId_idx" ON "Office"("divisionId");

-- CreateIndex
CREATE INDEX "Unit_divisionId_idx" ON "Unit"("divisionId");

-- CreateIndex
CREATE INDEX "Unit_officeId_idx" ON "Unit"("officeId");

-- CreateIndex
CREATE INDEX "Total_giverId_idx" ON "Total"("giverId");

-- CreateIndex
CREATE INDEX "Total_receiverId_idx" ON "Total"("receiverId");

-- CreateIndex
CREATE INDEX "Total_giverId_receiverId_idx" ON "Total"("giverId", "receiverId");

-- CreateIndex
CREATE INDEX "Total_receiverId_roleId_idx" ON "Total"("receiverId", "roleId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_posId_fkey" FOREIGN KEY ("posId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionCode" ADD CONSTRAINT "PositionCode_posgroupId_fkey" FOREIGN KEY ("posgroupId") REFERENCES "PositionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_poscodeId_fkey" FOREIGN KEY ("poscodeId") REFERENCES "PositionCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTitle" ADD CONSTRAINT "SubTitle_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Total" ADD CONSTRAINT "Total_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Total" ADD CONSTRAINT "Total_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Total" ADD CONSTRAINT "Total_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
