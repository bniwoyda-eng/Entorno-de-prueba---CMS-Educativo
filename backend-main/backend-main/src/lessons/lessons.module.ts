import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Lesson } from './entities';
import { Course } from 'src/courses/entities';
import { Material } from 'src/materials/entities';
import { MaterialsListener } from 'src/materials/listeners/materials.listeners';
import { CoursesModule } from 'src/courses/courses.module';
import { Student } from 'src/exports/entities';

@Module({
    imports: [
        HttpModule,
        AuthModule,
        CoursesModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([Lesson, Course, Student, Material]),
    ],
    controllers: [LessonsController],
    providers: [LessonsService, MaterialsListener],
    exports: [LessonsService],
})
export class LessonsModule {}
