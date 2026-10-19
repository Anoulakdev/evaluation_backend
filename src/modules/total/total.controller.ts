import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TotalService } from './total.service';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';
import type { UserRequest } from '../../interfaces/user-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('totals')
export class TotalController {
  constructor(private readonly totalService: TotalService) {}

  @Post()
  create(@Req() req: UserRequest, @Body() createTotalDto: CreateTotalDto) {
    return this.totalService.create(req.user, createTotalDto);
  }

  @Get('/checkevaluation')
  checkEvaluation(
    @Req() req: UserRequest,
    @Query('receiverId') receiverId: number,
  ) {
    return this.totalService.checkEvaluation(req.user, receiverId);
  }

  @Get('/resultdetail')
  @Roles(1, 12)
  resultDetail(@Query('emp_code') emp_code: string) {
    return this.totalService.resultDetail(emp_code);
  }

  @Get('/resultall')
  @Roles(1, 12)
  resultAll(
    @Query('departmentId') departmentId?: number,
    @Query('divisionId') divisionId?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('roleId') roleId?: number,
  ) {
    return this.totalService.resultAll(
      departmentId,
      divisionId,
      page,
      limit,
      search,
      roleId,
    );
  }

  @Get('/resultlist')
  resultList(@Req() req: UserRequest) {
    return this.totalService.resultList(req.user);
  }

  @Put('/updatelist')
  updateList(@Req() req: UserRequest, @Body() ids: number[]) {
    return this.totalService.updateList(req.user, ids);
  }

  @Put(':id')
  update(
    @Req() req: UserRequest,
    @Param('id') id: string,
    @Body() updateTotalDto: UpdateTotalDto,
  ) {
    return this.totalService.update(req.user, +id, updateTotalDto);
  }
}
