import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SubtitleService } from './subtitle.service';
import { CreateSubtitleDto } from './dto/create-subtitle.dto';
import { UpdateSubtitleDto } from './dto/update-subtitle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subtitles')
export class SubtitleController {
  constructor(private readonly subtitleService: SubtitleService) {}

  @Post()
  @Roles(1)
  create(@Body() createSubtitleDto: CreateSubtitleDto) {
    return this.subtitleService.create(createSubtitleDto);
  }

  @Get()
  findAll() {
    return this.subtitleService.findAll();
  }

  @Get('selectsubtitle')
  selectSubTitle(@Query('titleId') titleId: number) {
    return this.subtitleService.selectSubTitle(titleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subtitleService.findOne(+id);
  }

  @Put(':id')
  @Roles(1)
  update(
    @Param('id') id: string,
    @Body() updateSubtitleDto: UpdateSubtitleDto,
  ) {
    return this.subtitleService.update(+id, updateSubtitleDto);
  }

  @Delete(':id')
  @Roles(1)
  remove(@Param('id') id: string) {
    return this.subtitleService.remove(+id);
  }
}
