import { Injectable } from '@nestjs/common';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createDivision } from './services/create';
import { updateDivision } from './services/update';
import { findAllDivision, FindAllDivisionOptions } from './services/findall';
import { findOneDivision } from './services/findone';
import { syncData } from './services/syncData';
import { selectDivision } from './services/selectDivision';

@Injectable()
export class DivisionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDivisionDto: CreateDivisionDto) {
    return createDivision(this.prisma, createDivisionDto);
  }

  update(id: number, updateDivisionDto: UpdateDivisionDto) {
    return updateDivision(this.prisma, id, updateDivisionDto);
  }

  syncData() {
    return syncData(this.prisma);
  }

  findAll(options?: FindAllDivisionOptions | number) {
    if (typeof options === 'number') {
      return findAllDivision(this.prisma, { departmentId: options });
    }
    return findAllDivision(this.prisma, options);
  }

  selectDivision(user: AuthUser, departmentId?: number) {
    return selectDivision(this.prisma, user, departmentId);
  }

  findOne(id: number) {
    return findOneDivision(this.prisma, id);
  }
}
