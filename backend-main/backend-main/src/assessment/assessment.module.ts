import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { Assessment, AssessmentAnswerOption, AssessmentCategory, AssessmentQuestion, AssessmentQuestionPivot, AssessmentRiskSegment } from './entities';
import { AssessmentCategoryController } from './assessment-category/assessment-category.controller';
import { AssessmentCategoryService } from './assessment-category/assessment-category.service';
import { AssessmentRiskSegmentController } from './assessment-risk-segment/assessment-risk-segment.controller';
import { AssessmentRiskSegmentService } from './assessment-risk-segment/assessment-risk-segment.service';
import { AssessmentQuestionController } from './assessment-question/assessment-question.controller';
import { AssessmentQuestionService } from './assessment-question/assessment-question.service';
import { AssessmentAnswerOptionController } from './assessment-answer-option/assessment-answer-option.controller';
import { AssessmentAnswerOptionService } from './assessment-answer-option/assessment-answer-option.service';
import { AssessmentQuestionPivotController } from './assessment-question-pivot/assessment-question-pivot.controller';
import { AssessmentQuestionPivotService } from './assessment-question-pivot/assessment-question-pivot.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Assessment,
      AssessmentCategory,
      AssessmentQuestion,
      AssessmentAnswerOption,
      AssessmentRiskSegment,
      AssessmentQuestionPivot
    ]),
    S3Module
  ],
  controllers: [AssessmentController, AssessmentCategoryController, AssessmentRiskSegmentController, AssessmentQuestionController, AssessmentAnswerOptionController, AssessmentQuestionPivotController],
  providers: [AssessmentService, AssessmentCategoryService, AssessmentRiskSegmentService, AssessmentQuestionService, AssessmentAnswerOptionService, AssessmentQuestionPivotService],
})
export class AssessmentModule { }
