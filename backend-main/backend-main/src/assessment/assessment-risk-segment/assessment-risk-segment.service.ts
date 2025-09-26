import { Repository } from 'typeorm';
import { Logger, NotFoundException, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssessmentRiskSegmentDto, UpdateAssessmentRiskSegmentDto, UpsertManyAssessmentRiskSegmentsDto } from '../dto/index';
import { AssessmentRiskSegment } from '../entities';
import { handleDBExceptions } from 'src/helpers';

@Injectable()
export class AssessmentRiskSegmentService {
    private readonly logger = new Logger(AssessmentRiskSegmentService.name);

    constructor(
        @InjectRepository(AssessmentRiskSegment)
        private assessmentRiskSegmentRepository: Repository<AssessmentRiskSegment>,
    ) { }

    async create(id_assessment: string, dto: CreateAssessmentRiskSegmentDto): Promise<AssessmentRiskSegment> {
        try {
            const assessmentRiskSegment = this.assessmentRiskSegmentRepository.create({ ...dto, assessment: { id: id_assessment } });
            await this.assessmentRiskSegmentRepository.save(assessmentRiskSegment);
            return assessmentRiskSegment;
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }

    async upsertMany(
        id_assessment: string,
        dto: UpsertManyAssessmentRiskSegmentsDto,
    ): Promise<AssessmentRiskSegment[]> {
        try {
            const results: AssessmentRiskSegment[] = [];

            // 1. Traer todos los segmentos actuales del assessment
            const existingSegments = await this.assessmentRiskSegmentRepository.find({
                where: { assessment: { id: id_assessment } },
            });

            const receivedIds = dto.riskSegments
                .filter((segment) => !!segment.id)
                .map((segment) => segment.id);

            // 2. Eliminar los que no estén en el array recibido
            const toDelete = existingSegments.filter(
                (segment) => segment.id && !receivedIds.includes(segment.id),
            );

            if (toDelete.length) {
                await this.assessmentRiskSegmentRepository.remove(toDelete);
            }

            // 3. Insertar o actualizar
            for (const segment of dto.riskSegments) {
                if (segment.id) {
                    const existing = existingSegments.find((s) => s.id === segment.id);

                    if (existing) {
                        const updated = this.assessmentRiskSegmentRepository.merge(existing, segment);
                        const saved = await this.assessmentRiskSegmentRepository.save(updated);
                        results.push(saved);
                    } else {
                        this.logger.warn(`Segment with id ${segment.id} not found. Skipping.`);
                    }
                } else {
                    const created = this.assessmentRiskSegmentRepository.create({
                        ...segment,
                        assessment: { id: id_assessment },
                    });
                    const saved = await this.assessmentRiskSegmentRepository.save(created);
                    results.push(saved);
                }
            }

            return results;
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }

    async findAll(): Promise<AssessmentRiskSegment[]> {
        return this.assessmentRiskSegmentRepository.find();
    }

    async findAllByAssessment(id_assessment: string): Promise<AssessmentRiskSegment[]> {
        return this.assessmentRiskSegmentRepository.find({ where: { assessment: { id: id_assessment } }, order: { minScore: 'ASC' } });
    }

    async findOne(id: string): Promise<AssessmentRiskSegment> {
        try {
            const assessmentRiskSegment = await this.assessmentRiskSegmentRepository.findOne({ where: { id } });
            if (!assessmentRiskSegment) {
                throw new NotFoundException('Assessment risk segment not found');
            }
            return assessmentRiskSegment;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleDBExceptions(error, this.logger);
        }
    }

    async update(id: string, dto: UpdateAssessmentRiskSegmentDto): Promise<AssessmentRiskSegment> {
        try {
            const assessmentRiskSegment = await this.findOne(id);
            return this.assessmentRiskSegmentRepository.save({ ...assessmentRiskSegment, ...dto });
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const assessmentRiskSegment = await this.findOne(id);
            if (!assessmentRiskSegment) {
                throw new NotFoundException('Assessment risk segment not found');
            }
            await this.assessmentRiskSegmentRepository.softRemove(assessmentRiskSegment);
        } catch (error) {
            handleDBExceptions(error, this.logger);
        }
    }
}
