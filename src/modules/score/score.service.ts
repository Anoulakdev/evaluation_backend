import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { createScore } from './services/create';
import { findAllScore } from './services/findall';
import { findOneScore } from './services/findone';
import { updateScore } from './services/update';
import { removeScore } from './services/remove';
import { selectScore } from './services/selectScore';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  create(createScoreDto: CreateScoreDto) {
    return createScore(this.prisma, createScoreDto);
  }

  findAll() {
    return findAllScore(this.prisma);
  }

  selectScore() {
    return selectScore(this.prisma);
  }

  findOne(id: number) {
    return findOneScore(this.prisma, id);
  }

  update(id: number, updateScoreDto: UpdateScoreDto) {
    return updateScore(this.prisma, id, updateScoreDto);
  }

  remove(id: number) {
    return removeScore(this.prisma, id);
  }
}
