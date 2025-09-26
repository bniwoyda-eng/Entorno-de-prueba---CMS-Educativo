import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Material, Lesson, Student, StudentProgress, Course } from 'src/exports/entities';
import { StudentEnrollment } from 'src/enrollment/entities/student-enrollment.entity';
import { StudentModule } from 'src/student/student.module';

@Module({
    imports: [
        HttpModule,
        AuthModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([
            Student,
            Course,
            Lesson,
            Material,
            StudentProgress,
            StudentEnrollment
        ]),
        StudentModule,
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule { }
