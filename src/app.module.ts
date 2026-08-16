import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { DivisionModule } from './modules/division/division.module';
import { OfficeModule } from './modules/office/office.module';
import { UnitModule } from './modules/unit/unit.module';
import { PositiongroupModule } from './modules/positiongroup/positiongroup.module';
import { PositioncodeModule } from './modules/positioncode/positioncode.module';
import { PositionModule } from './modules/position/position.module';
import { RoleModule } from './modules/role/role.module';
import { TotalModule } from './modules/total/total.module';
import { TitleModule } from './modules/title/title.module';
import { SubtitleModule } from './modules/subtitle/subtitle.module';
import { ScoreModule } from './modules/score/score.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    AuthModule,
    DepartmentModule,
    DivisionModule,
    OfficeModule,
    UnitModule,
    PositiongroupModule,
    PositioncodeModule,
    PositionModule,
    RoleModule,
    TotalModule,
    TitleModule,
    SubtitleModule,
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
