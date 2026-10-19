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
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('offices')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @Roles(1)
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officeService.create(createOfficeDto);
  }

  @Post('/sync')
  @Roles(1)
  syncData() {
    return this.officeService.syncData();
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('divisionId') divisionId?: string,
  ) {
    return this.officeService.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      search,
      divisionId: divisionId ? +divisionId : undefined,
    });
  }

  @Get('/selectoffice')
  selectOffice(@Query('divisionId') divisionId?: number) {
    return this.officeService.selectOffice(divisionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.officeService.findOne(+id);
  }

  @Put(':id')
  @Roles(1)
  update(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officeService.update(+id, updateOfficeDto);
  }
}
