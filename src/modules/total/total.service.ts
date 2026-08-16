import { Injectable } from '@nestjs/common';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createTotal } from './services/create';
import { checkEvaluation } from './services/checkEvaluation';
import { resultDetail } from './services/resultDetail';
import { resultAll } from './services/resultAll';

@Injectable()
export class TotalService {
  constructor(private prisma: PrismaService) {}

  create(user: AuthUser, createTotalDto: CreateTotalDto) {
    return createTotal(this.prisma, user, createTotalDto);
  }

  checkEvaluation(user: AuthUser, receiverId: number) {
    return checkEvaluation(this.prisma, user, receiverId);
  }

  resultDetail(emp_code: string) {
    return resultDetail(this.prisma, emp_code);
  }

  resultAll(
    departmentId?: number,
    divisionId?: number,
    page?: number,
    limit?: number,
    search?: string,
  ) {
    return resultAll(
      this.prisma,
      departmentId,
      divisionId,
      page,
      limit,
      search,
    );
  }
}
