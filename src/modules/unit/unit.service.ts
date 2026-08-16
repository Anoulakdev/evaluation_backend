import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createUnit } from './services/create';
import { updateUnit } from './services/update';
import { findAllUnit, FindAllUnitOptions } from './services/findall';
import { findOneUnit } from './services/findone';
import { syncData } from './services/syncData';
import { selectUnit } from './services/selectUnit';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  create(createUnitDto: CreateUnitDto) {
    return createUnit(this.prisma, createUnitDto);
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return updateUnit(this.prisma, id, updateUnitDto);
  }

  syncData() {
    return syncData(this.prisma);
  }

  findAll(options?: FindAllUnitOptions | number, officeId?: number) {
    if (typeof options === 'number') {
      return findAllUnit(this.prisma, { divisionId: options, officeId });
    }
    return findAllUnit(this.prisma, options);
  }

  selectUnit(divisionId?: number, officeId?: number) {
    return selectUnit(this.prisma, divisionId, officeId);
  }

  findOne(id: number) {
    return findOneUnit(this.prisma, id);
  }
}
