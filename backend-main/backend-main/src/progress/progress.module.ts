import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';

import { Course, Educator, EducatorEnrollment, Student, StudentEnrollment } from 'src/exports/entities';
import { AuthModule, CommonModule } from 'src/exports/modules';
import { StudentProgress, EducatorProgress } from './entities';
import { EducatorProgressStrategy, ProgressStrategyFactory, StudentProgressStrategy } from './strategy';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    TypeOrmModule.forFeature([
      Course,
      Educator,
      EducatorEnrollment,
      EducatorProgress,
      Student,
      StudentEnrollment,
      StudentProgress,
    ]),
  ],
  controllers: [ProgressController],
  providers: [
    ProgressService,
    ProgressStrategyFactory,
    EducatorProgressStrategy,
    StudentProgressStrategy
  ],
  exports: [
    ProgressService,
  ],
})
export class ProgressModule { }
