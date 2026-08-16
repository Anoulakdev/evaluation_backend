import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createOffice } from './services/create';
import { updateOffice } from './services/update';
import { findAllOffice, FindAllOfficeOptions } from './services/findall';
import { findOneOffice } from './services/findone';
import { syncData } from './services/syncData';
import { selectOffice } from './services/selectOffice';

@Injectable()
export class OfficeService {
  constructor(private prisma: PrismaService) {}

  create(createOfficeDto: CreateOfficeDto) {
    return createOffice(this.prisma, createOfficeDto);
  }

  update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return updateOffice(this.prisma, id, updateOfficeDto);
  }

  syncData() {
    return syncData(this.prisma);
  }

  findAll(options?: FindAllOfficeOptions | number) {
    if (typeof options === 'number') {
      return findAllOffice(this.prisma, { divisionId: options });
    }
    return findAllOffice(this.prisma, options);
  }

  selectOffice(divisionId?: number) {
    return selectOffice(this.prisma, divisionId);
  }

  findOne(id: number) {
    return findOneOffice(this.prisma, id);
  }
}
