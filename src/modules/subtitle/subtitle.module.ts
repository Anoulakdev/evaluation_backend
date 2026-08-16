import { Module } from '@nestjs/common';
import { SubtitleService } from './subtitle.service';
import { SubtitleController } from './subtitle.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SubtitleController],
  providers: [SubtitleService, PrismaService],
})
export class SubtitleModule {}
