import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities';
import { Answer } from 'src/answer/entities';
import { Question } from 'src/question/entities';
import { StudentProgress } from 'src/progress/entities';
import { Student } from 'src/exports/entities';
import { ProgressModule, AuthModule } from 'src/exports/modules';
import { Lesson, Material } from 'src/exports/entities';

@Module({
    imports: [
        HttpModule,
        AuthModule,
        ProgressModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([
            Lesson,
            Material,
            Quiz,
            Answer,
            Question,
            StudentProgress,
            Student
        ]),
    ],
    controllers: [QuizController],
    providers: [QuizService],
})
export class QuizModule { }
