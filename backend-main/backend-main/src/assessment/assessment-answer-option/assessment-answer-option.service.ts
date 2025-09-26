import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Logger, NotFoundException, Injectable, HttpException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { CreateAssessmentAnswerOptionDto, UpdateAssessmentAnswerOptionDto } from '../dto/index';
import { AssessmentAnswerOption, AssessmentQuestion, AssessmentQuestionPivot } from '../entities';
import { handleDBExceptions } from 'src/helpers';
import { AssessmentService } from '../assessment.service';

@Injectable()
export class AssessmentAnswerOptionService {
    private readonly logger = new Logger(AssessmentAnswerOptionService.name);

    constructor(
        @InjectRepository(AssessmentAnswerOption)
        private assessmentAnswerOptionRepository: Repository<AssessmentAnswerOption>,
        @InjectDataSource()
        private dataSource: DataSource,
        @Inject(forwardRef(() => AssessmentService))
        private assessmentService: AssessmentService,
    ) { }

    /**
     * Actualiza automáticamente el maxScore de una pregunta de evaluación
     * basado en el score más alto de sus opciones de respuesta activas
     */
    private async updateQuestionMaxScore(
        id_assessment_question: string, 
        manager?: QueryRunner['manager']
    ): Promise<void> {
        const entityManager = manager || this.assessmentAnswerOptionRepository.manager;
        
        const maxScore = await entityManager
            .createQueryBuilder(AssessmentAnswerOption, 'option')
            .select('MAX(option.score)', 'max')
            .where('option.id_assessment_question = :id', { id: id_assessment_question })
            .andWhere('option.delete_date IS NULL')
            .getRawOne();
        
        await entityManager.update(AssessmentQuestion, id_assessment_question, { 
            maxScore: maxScore.max || 0 
        });
    }

    /**
     * Actualiza el maxScore de todos los assessments que contienen esta pregunta
     */
    private async updateRelatedAssessmentsMaxScore(
        id_assessment_question: string,
        manager?: QueryRunner['manager']
    ): Promise<void> {
        const entityManager = manager || this.assessmentAnswerOptionRepository.manager;
        
        // Encontrar todos los assessments que contienen esta pregunta
        const pivots = await entityManager
            .createQueryBuilder(AssessmentQuestionPivot, 'pivot')
            .select('pivot.id_assessment')
            .where('pivot.id_assessment_question = :id', { id: id_assessment_question })
            .andWhere('pivot.delete_date IS NULL')
            .getMany();
        
        // Actualizar el maxScore de cada assessment
        for (const pivot of pivots) {
            await this.assessmentService.updateAssessmentMaxScore(pivot.id_assessment, entityManager);
        }
    }

    async create(id_assessment_question: string, dto: CreateAssessmentAnswerOptionDto): Promise<AssessmentAnswerOption> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const assessmentAnswerOption = queryRunner.manager.create(AssessmentAnswerOption, { ...dto, id_assessment_question });
            await queryRunner.manager.save(assessmentAnswerOption);
            
            await this.updateQuestionMaxScore(id_assessment_question, queryRunner.manager);
            await this.updateRelatedAssessmentsMaxScore(id_assessment_question, queryRunner.manager);
            
            await queryRunner.commitTransaction();
            return assessmentAnswerOption;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            handleDBExceptions(error, this.logger);
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<AssessmentAnswerOption[]> {
        return this.assessmentAnswerOptionRepository.find();
    }

    async findAllByAssessmentQuestion(id_assessment_question: string): Promise<AssessmentAnswerOption[]> {
        return this.assessmentAnswerOptionRepository.find({ where: { id_assessment_question } });
    }

    async findOne(id: string): Promise<AssessmentAnswerOption> {
        try {
            const assessmentAnswerOption = await this.assessmentAnswerOptionRepository.findOne({ where: { id } });
            if (!assessmentAnswerOption) {
                throw new NotFoundException('Assessment answer option not found');
            }
            return assessmentAnswerOption;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleDBExceptions(error, this.logger);
        }
    }

    async update(id: string, dto: UpdateAssessmentAnswerOptionDto): Promise<AssessmentAnswerOption> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const assessmentAnswerOption = await this.findOne(id);
            const updatedOption = await queryRunner.manager.save(AssessmentAnswerOption, { 
                ...assessmentAnswerOption, 
                ...dto 
            });
            
            await this.updateQuestionMaxScore(assessmentAnswerOption.id_assessment_question, queryRunner.manager);
            await this.updateRelatedAssessmentsMaxScore(assessmentAnswerOption.id_assessment_question, queryRunner.manager);
            
            await queryRunner.commitTransaction();
            return updatedOption;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            handleDBExceptions(error, this.logger);
        } finally {
            await queryRunner.release();
        }
    }

    async remove(id: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const assessmentAnswerOption = await this.findOne(id);
            const id_assessment_question = assessmentAnswerOption.id_assessment_question;
            
            await queryRunner.manager.softRemove(AssessmentAnswerOption, assessmentAnswerOption);
            
            await this.updateQuestionMaxScore(id_assessment_question, queryRunner.manager);
            await this.updateRelatedAssessmentsMaxScore(id_assessment_question, queryRunner.manager);
            
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            handleDBExceptions(error, this.logger);
        } finally {
            await queryRunner.release();
        }
    }
}
