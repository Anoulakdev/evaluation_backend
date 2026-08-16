import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateOfficeDto } from '../dto/update-office.dto';

export async function updateOffice(
  prisma: PrismaService,
  id: number,
  updateOfficeDto: UpdateOfficeDto,
) {
  const office = await prisma.office.findUnique({
    where: { id },
  });

  if (!office) {
    throw new NotFoundException(`Office with ID ${id} not found`);
  }

  return prisma.office.update({
    where: { id },
    data: {
      ...(updateOfficeDto.office_name && {
        office_name: updateOfficeDto.office_name,
      }),
      ...(updateOfficeDto.office_code !== undefined && {
        office_code: updateOfficeDto.office_code,
      }),
      ...(updateOfficeDto.divisionId !== undefined && {
        divisionId: Number(updateOfficeDto.divisionId),
      }),
    },
  });
}
