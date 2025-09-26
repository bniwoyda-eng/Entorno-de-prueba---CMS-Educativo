import { Not, Repository, Like } from 'typeorm';
import { Logger, NotFoundException, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssessmentQuestionDto, UpdateAssessmentQuestionDto, AssessmentQuestionFilterDto } from '../dto/index';
import { AssessmentQuestion } from '../entities';
import { handleDBExceptions } from 'src/helpers';
import { PaginationDto } from 'src/common';
import { paginateWithRepository } from 'src/utils/paginate';
import { PaginatedResponse } from 'src/common';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class AssessmentQuestionService {
    private readonly logger = new Logger(AssessmentQuestionService.name);

    constructor(
        @InjectRepository(AssessmentQuestion)
        private assessmentQuestionRepository: Repository<AssessmentQuestion>,
        private readonly s3Service: S3Service,
    ) { }

    async create(dto: CreateAssessmentQuestionDto): Promise<AssessmentQuestion> {
        try {
            const assessmentQuestion = this.assessmentQuestionRepository.create(dto);
            await this.assessmentQuestionRepository.save(assessmentQuestion);
            return assessmentQuestion;
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }

    async findAll(query: AssessmentQuestionFilterDto): Promise<PaginatedResponse<AssessmentQuestion>> {
        const { search, ...paginationQuery } = query;
        const options: any = {};
        
        if (search) {
            options.where = [
                { questionText: Like(`%${search}%`) }
            ];
        }
        
        const result = await paginateWithRepository(this.assessmentQuestionRepository, paginationQuery, options);
        
        // Convertir las keys de las imágenes a presigned URLs
        for (const question of result.data) {
            if (question.questionImage) {
                try {
                    question.questionImage = await this.s3Service.getPresignedUrl(question.questionImage);
                } catch (error) {
                    console.warn('Failed to presign question image URL:', question.questionImage, error);
                    question.questionImage = null;
                }
            }
        }
        
        return result;
    }

    async findOne(id: string): Promise<AssessmentQuestion> {
        try {
            const assessmentQuestion = await this.assessmentQuestionRepository.findOne({ where: { id } });
            if (!assessmentQuestion) {
                throw new NotFoundException('Assessment question not found');
            }
            
            // Convertir la key de la imagen a presigned URL
            if (assessmentQuestion.questionImage) {
                try {
                    assessmentQuestion.questionImage = await this.s3Service.getPresignedUrl(assessmentQuestion.questionImage);
                } catch (error) {
                    console.warn('Failed to presign question image URL:', assessmentQuestion.questionImage, error);
                    assessmentQuestion.questionImage = null;
                }
            }
            
            return assessmentQuestion;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleDBExceptions(error, this.logger);
        }
    }

    async update(id: string, dto: UpdateAssessmentQuestionDto): Promise<AssessmentQuestion> {
        try {
            const assessmentQuestion = await this.findOne(id);
            return this.assessmentQuestionRepository.save({ ...assessmentQuestion, ...dto });
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const assessmentQuestion = await this.findOne(id);
            if (!assessmentQuestion) {
                throw new NotFoundException('Assessment question not found');
            }
            await this.assessmentQuestionRepository.softRemove(assessmentQuestion);
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }

    async findAvailableQuestions(assessmentId: string, search?: string): Promise<AssessmentQuestion[]> {
        const queryBuilder = this.assessmentQuestionRepository
            .createQueryBuilder('question')
            .where('question.id NOT IN (SELECT pivot.id_assessment_question FROM assessment_question_pivot pivot WHERE pivot.id_assessment = :assessmentId)', { assessmentId })
            .orderBy('question.questionText', 'ASC');
        
        if (search) {
            queryBuilder.andWhere('LOWER(question.questionText) LIKE LOWER(:search)', { search: `%${search}%` });
        }
        
        const questions = await queryBuilder.getMany();
        
        // Convertir las keys de las imágenes a presigned URLs
        for (const question of questions) {
            if (question.questionImage) {
                try {
                    question.questionImage = await this.s3Service.getPresignedUrl(question.questionImage);
                } catch (error) {
                    console.warn('Failed to presign question image URL:', question.questionImage, error);
                    question.questionImage = null;
                }
            }
        }
        
        return questions;
    }

    async getQuestionImage(id: string): Promise<string> {
        // Obtener la pregunta directamente de la base de datos sin conversión de URL
        const question = await this.assessmentQuestionRepository.findOne({ where: { id } });
        if (!question) {
            throw new NotFoundException('Assessment question not found');
        }
        if (!question.questionImage) {
            throw new NotFoundException('Question image not found');
        }
        return this.s3Service.getPresignedUrl(question.questionImage);
    }

    async uploadQuestionImage(id: string, file: Express.Multer.File): Promise<string> {
        // Obtener la pregunta directamente de la base de datos sin conversión de URL
        const question = await this.assessmentQuestionRepository.findOne({ where: { id } });
        if (!question) {
            throw new NotFoundException('Assessment question not found');
        }
        
        const uploadResult = await this.s3Service.uploadImage(file, 'assessment-questions');
        if (!uploadResult || !uploadResult.key) {
            throw new HttpException('Failed to upload image', 500);
        }
        question.questionImage = uploadResult.key;
        await this.assessmentQuestionRepository.save(question);

        const presignedUrl = this.s3Service.getPresignedUrl(uploadResult.key);
        return presignedUrl;
    }

    async removeQuestionImage(id: string): Promise<void> {
        // Obtener la pregunta directamente de la base de datos sin conversión de URL
        const question = await this.assessmentQuestionRepository.findOne({ where: { id } });
        if (!question) {
            throw new NotFoundException('Assessment question not found');
        }
        question.questionImage = null;
        await this.assessmentQuestionRepository.save(question);
    }
}
