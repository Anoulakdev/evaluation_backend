import { Injectable } from '@nestjs/common';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createTitle } from './services/create';
import { findAllTitle } from './services/findall';
import { findOneTitle } from './services/findone';
import { updateTitle } from './services/update';
import { removeTitle } from './services/remove';
import { selectTitle } from './services/selectTitle';

@Injectable()
export class TitleService {
  constructor(private prisma: PrismaService) {}

  create(createTitleDto: CreateTitleDto) {
    return createTitle(this.prisma, createTitleDto);
  }

  findAll() {
    return findAllTitle(this.prisma);
  }

  selectTitle() {
    return selectTitle(this.prisma);
  }

  findOne(id: number) {
    return findOneTitle(this.prisma, id);
  }

  update(id: number, updateTitleDto: UpdateTitleDto) {
    return updateTitle(this.prisma, id, updateTitleDto);
  }

  remove(id: number) {
    return removeTitle(this.prisma, id);
  }
}
