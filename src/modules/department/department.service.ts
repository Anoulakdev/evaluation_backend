import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createDepartment } from './services/create';
import { updateDepartment } from './services/update';
import {
  findAllDepartment,
  FindAllDepartmentOptions,
} from './services/findall';
import { findOneDepartment } from './services/findone';
import { syncData } from './services/syncData';
import { selectDepartment } from './services/selectDepartment';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    return createDepartment(this.prisma, createDepartmentDto);
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return updateDepartment(this.prisma, id, updateDepartmentDto);
  }

  syncData() {
    return syncData(this.prisma);
  }

  findAll(options?: FindAllDepartmentOptions) {
    return findAllDepartment(this.prisma, options);
  }

  selectDepartment() {
    return selectDepartment(this.prisma);
  }

  findOne(id: number) {
    return findOneDepartment(this.prisma, id);
  }
}
