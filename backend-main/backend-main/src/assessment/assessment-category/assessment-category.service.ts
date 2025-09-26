import { Repository } from 'typeorm';
import { Logger, NotFoundException, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssessmentCategoryDto, UpdateAssessmentCategoryDto } from '../dto/index';
import { AssessmentCategory } from '../entities';
import { handleDBExceptions } from 'src/helpers';

@Injectable()
export class AssessmentCategoryService {
    private readonly logger = new Logger(AssessmentCategoryService.name);

    constructor(
        @InjectRepository(AssessmentCategory)
        private assessmentCategoryRepository: Repository<AssessmentCategory>,
    ) { }

    async create(dto: CreateAssessmentCategoryDto): Promise<AssessmentCategory> {
        try {
            const assessmentCategory = this.assessmentCategoryRepository.create(dto);
            await this.assessmentCategoryRepository.save(assessmentCategory);
            return assessmentCategory;
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }

    async findAll(): Promise<AssessmentCategory[]> {
        return this.assessmentCategoryRepository.find({ order: { name: 'ASC' } });
    }

    async findOne(id: string): Promise<AssessmentCategory> {
        try {
            const assessmentCategory = await this.assessmentCategoryRepository.findOne({ where: { id } });
            if (!assessmentCategory) {
                throw new NotFoundException('Assessment category not found');
            }
            return assessmentCategory;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleDBExceptions(error, this.logger);
        }
    }


    async update(id: string, dto: UpdateAssessmentCategoryDto): Promise<AssessmentCategory> {
        try {
            const assessmentCategory = await this.findOne(id);
            return this.assessmentCategoryRepository.save({ ...assessmentCategory, ...dto });
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const assessmentCategory = await this.findOne(id);
            if (!assessmentCategory) {
                throw new NotFoundException('Assessment category not found');
            }
            await this.assessmentCategoryRepository.softRemove(assessmentCategory);
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }
}
