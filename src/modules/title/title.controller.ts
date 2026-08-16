import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TitleService } from './title.service';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('titles')
export class TitleController {
  constructor(private readonly titleService: TitleService) {}

  @Post()
  create(@Body() createTitleDto: CreateTitleDto) {
    return this.titleService.create(createTitleDto);
  }

  @Get()
  findAll() {
    return this.titleService.findAll();
  }

  @Get('selecttitle')
  selectTitle() {
    return this.titleService.selectTitle();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.titleService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTitleDto: UpdateTitleDto) {
    return this.titleService.update(+id, updateTitleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.titleService.remove(+id);
  }
}
