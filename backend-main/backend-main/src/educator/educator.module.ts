import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Educator } from './entities/educator.entity';
import { EducatorController } from './educator.controller';
import { EducatorService } from './educator.service';

import { AuthModule, CommonModule } from 'src/exports/modules';
import { Institution } from 'src/exports/entities';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => CommonModule),
    TypeOrmModule.forFeature([Educator, Institution]),
  ],
  controllers: [EducatorController],
  providers: [EducatorService],
  exports: [EducatorService],
})

export class EducatorModule { }
