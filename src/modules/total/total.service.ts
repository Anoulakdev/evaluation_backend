import { Injectable } from '@nestjs/common';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createTotal } from './services/create';
import { checkEvaluation } from './services/checkEvaluation';
import { resultDetail } from './services/resultDetail';
import { resultAll } from './services/resultAll';
import { resultList } from './services/resultList';
import { updateList } from './services/updateList';
import { updateTotal } from './services/update';

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
    roleId?: number,
  ) {
    return resultAll(
      this.prisma,
      departmentId,
      divisionId,
      page,
      limit,
      search,
      roleId,
    );
  }

  resultList(user: AuthUser) {
    return resultList(this.prisma, user);
  }

  updateList(user: AuthUser, ids: number[] | { ids: number[] }) {
    return updateList(this.prisma, user, ids);
  }

  update(user: AuthUser, id: number, updateTotalDto: UpdateTotalDto) {
    return updateTotal(this.prisma, user, id, updateTotalDto);
  }
}
