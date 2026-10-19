import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DivisionService } from './division.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import type { UserRequest } from '../../interfaces/user-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('divisions')
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @Post()
  @Roles(1)
  create(@Body() createDivisionDto: CreateDivisionDto) {
    return this.divisionService.create(createDivisionDto);
  }

  @Post('/sync')
  @Roles(1)
  syncData() {
    return this.divisionService.syncData();
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.divisionService.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      search,
      departmentId: departmentId ? +departmentId : undefined,
    });
  }

  @Get('/selectdivision')
  selectDivision(
    @Req() req: UserRequest,
    @Query('departmentId') departmentId?: number,
  ) {
    return this.divisionService.selectDivision(req.user, departmentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.divisionService.findOne(+id);
  }

  @Put(':id')
  @Roles(1)
  update(
    @Param('id') id: string,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ) {
    return this.divisionService.update(+id, updateDivisionDto);
  }
}
