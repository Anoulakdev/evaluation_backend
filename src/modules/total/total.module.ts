import { Module } from '@nestjs/common';
import { TotalService } from './total.service';
import { TotalController } from './total.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TotalController],
  providers: [TotalService, PrismaService],
})
export class TotalModule {}
