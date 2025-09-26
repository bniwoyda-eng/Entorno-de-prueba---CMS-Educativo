import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CalendarEvent,
  CalendarEventTag,
  Chat,
  Course,
  Educator,
  EducatorEnrollment,
  EducatorProgress,
  Institution,
  Lesson,
  Material,
  Message,
  Student,
  StudentEnrollment,
  StudentProgress,
  Tag,
  User,
} from 'src/exports/entities';
import { Quiz } from 'src/quiz/entities';
import { Question } from 'src/question/entities';
import { Answer } from 'src/answer/entities';
import { AnswerOptions } from 'src/answer-option/entities';
import { StudentModule } from 'src/student/student.module';
import { Resource, ResourceAttachment, ResourceComment } from 'src/resources/entities';
import { Post, PostComment, PostImage, PostTag } from 'src/post/entities';
import { S3Module } from 'src/s3/s3.module';
import { Assessment, AssessmentAnswerOption, AssessmentCategory, AssessmentQuestion, AssessmentQuestionPivot, AssessmentRiskSegment } from 'src/assessment/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Answer,
      AnswerOptions,
      Course,
      Educator,
      EducatorEnrollment,
      EducatorProgress,
      Institution,
      Lesson,
      Material,
      Question,
      Quiz,
      Resource,
      ResourceAttachment,
      ResourceComment,
      Student,
      StudentEnrollment,
      StudentProgress,
      User,
      Tag,
      Post,
      PostImage,
      PostTag,
      PostComment,
      Chat,
      Message,
      CalendarEvent,
      CalendarEventTag,
      Assessment,
      AssessmentQuestion,
      AssessmentQuestionPivot,
      AssessmentAnswerOption,
      AssessmentRiskSegment,
      AssessmentCategory
    ]),
    StudentModule,
    S3Module,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }
