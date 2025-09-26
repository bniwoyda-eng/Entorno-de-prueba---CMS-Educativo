import { Repository, DataSource } from 'typeorm';
import { Logger, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { AssessmentQuestionPivot } from '../entities';
import { handleDBExceptions } from 'src/helpers';
import { AttachQuestionToAssessmentDto } from '../dto/attach-question-to-assessment.dto';
import { AssessmentService } from '../assessment.service';

@Injectable()
export class AssessmentQuestionPivotService {
    private readonly logger = new Logger(AssessmentQuestionPivotService.name);

    constructor(
        @InjectRepository(AssessmentQuestionPivot)
        private assessmentQuestionPivotRepository: Repository<AssessmentQuestionPivot>,
        @InjectDataSource()
        private dataSource: DataSource,
        @Inject(forwardRef(() => AssessmentService))
        private assessmentService: AssessmentService,
    ) { }

    async attachQuestionToAssessment(dto: AttachQuestionToAssessmentDto): Promise<AssessmentQuestionPivot> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const assessmentQuestionPivot = queryRunner.manager.create(AssessmentQuestionPivot, dto);
            await queryRunner.manager.save(assessmentQuestionPivot);
            
            // Actualizar el maxScore del assessment
            await this.assessmentService.updateAssessmentMaxScore(dto.id_assessment, queryRunner.manager);
            
            await queryRunner.commitTransaction();
            return assessmentQuestionPivot;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            handleDBExceptions(error, this.logger);
        } finally {
            await queryRunner.release();
        }
    }

    async detachQuestionFromAssessment(id: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // First get the assessment ID before deleting the pivot
            const assessmentQuestionPivot = await queryRunner.manager.findOne(AssessmentQuestionPivot, { 
                where: { id }, 
                relations: ['assessment'] 
            });
            
            if (!assessmentQuestionPivot) {
                throw new NotFoundException('Assessment question pivot not found');
            }
            
            const assessmentId = assessmentQuestionPivot.assessment.id;
            
            // Delete the pivot (soft delete)
            await queryRunner.manager.softDelete(AssessmentQuestionPivot, id);

            // Reorder existing questions for this assessment
            const remainingPivots = await queryRunner.manager.find(AssessmentQuestionPivot, { 
                where: { 
                    assessment: { id: assessmentId },
                    delete_date: null  // Solo pivots activos
                },
                order: { order: 'ASC' }
            });
            
            // Reorder starting from 0
            for (let i = 0; i < remainingPivots.length; i++) {
                remainingPivots[i].order = i;
                await queryRunner.manager.save(remainingPivots[i]);
            }

            // Actualizar el maxScore del assessment
            await this.assessmentService.updateAssessmentMaxScore(assessmentId, queryRunner.manager);
            
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            handleDBExceptions(error, this.logger);
        } finally {
            await queryRunner.release();
        }
    }

    async getQuestionsByAssessmentId(assessmentId: string): Promise<AssessmentQuestionPivot[]> {
        return this.assessmentQuestionPivotRepository.find({ 
            where: { assessment: { id: assessmentId } }, 
            order: { order: 'ASC' } 
        });
    }

    async reorderQuestions(assessmentId: string, questions: AssessmentQuestionPivot[]): Promise<void> {
        const assessmentQuestionPivots = await this.assessmentQuestionPivotRepository.find({ 
            where: { assessment: { id: assessmentId } } 
        });

        for (let i = 0; i < questions.length; i++) {
            const question = assessmentQuestionPivots.find(q => q.id === questions[i].id);
            if (question) {
                question.order = i;
                await this.assessmentQuestionPivotRepository.save(question);
            }
        }
    }
}
