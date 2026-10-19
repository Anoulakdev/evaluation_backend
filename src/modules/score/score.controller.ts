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
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  @Roles(1)
  create(@Body() createScoreDto: CreateScoreDto) {
    return this.scoreService.create(createScoreDto);
  }

  @Get()
  findAll() {
    return this.scoreService.findAll();
  }

  @Get('selectscore')
  selectScore() {
    return this.scoreService.selectScore();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scoreService.findOne(+id);
  }

  @Put(':id')
  @Roles(1)
  update(@Param('id') id: string, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoreService.update(+id, updateScoreDto);
  }

  @Delete(':id')
  @Roles(1)
  remove(@Param('id') id: string) {
    return this.scoreService.remove(+id);
  }
}
