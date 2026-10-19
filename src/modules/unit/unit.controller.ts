import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @Roles(1)
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Post('/sync')
  @Roles(1)
  syncData() {
    return this.unitService.syncData();
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('divisionId') divisionId?: string,
    @Query('officeId') officeId?: string,
  ) {
    return this.unitService.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      search,
      departmentId: departmentId ? +departmentId : undefined,
      divisionId: divisionId ? +divisionId : undefined,
      officeId: officeId ? +officeId : undefined,
    });
  }

  @Get('/selectunit')
  selectUnit(
    @Query('divisionId') divisionId?: number,
    @Query('officeId') officeId?: number,
  ) {
    return this.unitService.selectUnit(divisionId, officeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(+id);
  }

  @Put(':id')
  @Roles(1)
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(+id, updateUnitDto);
  }
}
