import { Injectable } from '@nestjs/common';
import { CreateSubtitleDto } from './dto/create-subtitle.dto';
import { UpdateSubtitleDto } from './dto/update-subtitle.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createSubTitle } from './services/create';
import { findAllSubTitle } from './services/findall';
import { findOneSubTitle } from './services/findone';
import { updateSubTitle } from './services/update';
import { removeSubTitle } from './services/remove';
import { selectSubTitle } from './services/selectSubTitle';

@Injectable()
export class SubtitleService {
  constructor(private prisma: PrismaService) {}

  create(createSubtitleDto: CreateSubtitleDto) {
    return createSubTitle(this.prisma, createSubtitleDto);
  }

  findAll() {
    return findAllSubTitle(this.prisma);
  }

  selectSubTitle(titleId: number) {
    return selectSubTitle(this.prisma, titleId);
  }

  findOne(id: number) {
    return findOneSubTitle(this.prisma, id);
  }

  update(id: number, updateSubtitleDto: UpdateSubtitleDto) {
    return updateSubTitle(this.prisma, id, updateSubtitleDto);
  }

  remove(id: number) {
    return removeSubTitle(this.prisma, id);
  }
}
