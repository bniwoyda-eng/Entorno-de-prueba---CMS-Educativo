import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EnrollmentsController } from './enrollment.controller';
import { EnrollmentsService } from './enrollment.service';
import { EducatorEnrollment, StudentEnrollment } from './entities';
import { Course, Educator, User, Student, StudentProgress, Material } from 'src/exports/entities';
import { EducatorEnrollmentStrategy, EnrollmentStrategyFactory, StudentEnrollmentStrategy } from './strategy';

@Module({
    imports: [
        HttpModule,
        AuthModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([
            Course,
            Educator,
            EducatorEnrollment,
            Student,
            StudentEnrollment,
            StudentProgress,
            User,
            Material,
        ]),
    ],

    controllers: [EnrollmentsController],
    providers: [
        EnrollmentsService,
        EnrollmentStrategyFactory,
        EducatorEnrollmentStrategy,
        StudentEnrollmentStrategy
    ],
})
export class EnrollmentModule { }
