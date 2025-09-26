import { Module } from '@nestjs/common';
import { AutomapperModule } from '@automapper/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfig } from './config';
import { InstitutionModule } from './institutions/institutions.module';
import { classes } from '@automapper/classes';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { MaterialsModule } from './materials/materials.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { StudentModule } from './student/student.module';
import { QuizModule } from './quiz/quiz.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import { AnswerOptionModule } from './answer-option/answer-option.module';
import { SeedModule } from './seed/seed.module';
import { ResourcesModule } from './resources/resources.module';
import { EducatorModule } from './educator/educator.module';
import { ProgressModule } from './progress/progress.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { S3Module } from './s3/s3.module';
import { ChatModule } from './chat/chat.module';
import { CalendarEventModule } from './calendar-event/calendar-event.module';
import { AssessmentModule } from './assessment/assessment.module';

@Module({
    imports: [
        ...DatabaseConfig,
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        ScheduleModule.forRoot(),

        CacheModule.register({
            ttl: 3600, // Lifetime in seconds (1 hour)
            max: 1000, // Maximum number of items in cache
        }),
        AuthModule,
        InstitutionModule,
        CoursesModule,
        LessonsModule,
        MaterialsModule,
        EnrollmentModule,
        StudentModule,
        QuizModule,
        AnswerModule,
        QuestionModule,
        AnswerOptionModule,
        SeedModule,
        ResourcesModule,
        EducatorModule,
        ProgressModule,
        PostModule,
        TagModule,
        S3Module,
        ChatModule,
        CalendarEventModule,
        AssessmentModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
