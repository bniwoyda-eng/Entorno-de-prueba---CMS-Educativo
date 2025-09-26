import { Repository, DataSource, Like } from 'typeorm';
import { HttpException, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Assessment, AssessmentQuestion, AssessmentQuestionPivot, AssessmentAnswerOption, AssessmentRiskSegment } from './entities';
import { UpdateAssessmentDto, CreateAssessmentDto, AssessmentFilterDto, AssessmentEvaluationDto, AssessmentEvaluationResultDto } from './dto/index';
import { handleDBExceptions } from 'src/helpers';
import { S3Service } from 'src/s3/s3.service';
import { User } from 'src/exports/entities';
import { ValidRoles } from 'src/auth/interfaces';

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(AssessmentAnswerOption)
    private readonly assessmentAnswerOptionRepository: Repository<AssessmentAnswerOption>,
    @InjectRepository(AssessmentRiskSegment)
    private readonly assessmentRiskSegmentRepository: Repository<AssessmentRiskSegment>,
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly s3Service: S3Service,
  ) { }

  /**
   * Actualiza automáticamente el maxScore de un assessment
   * basado en la suma de los maxScore de sus preguntas asociadas
   */
  async updateAssessmentMaxScore(
    id_assessment: string,
    manager?: any
  ): Promise<void> {
    const entityManager = manager || this.assessmentRepository.manager;

    const result = await entityManager
      .createQueryBuilder(AssessmentQuestionPivot, 'pivot')
      .innerJoin('pivot.question', 'question')
      .select('COALESCE(SUM(question.max_score), 0)', 'totalMaxScore')
      .where('pivot.id_assessment = :id', { id: id_assessment })
      .andWhere('pivot.delete_date IS NULL')
      .andWhere('question.delete_date IS NULL')
      .getRawOne();

    await entityManager.update(Assessment, id_assessment, {
      maxScore: parseInt(result.totalMaxScore) || 0
    });
  }

  async create(dto: CreateAssessmentDto): Promise<Assessment> {
    try {
      const assessment = this.assessmentRepository.create(dto);
      await this.assessmentRepository.save(assessment);
      return assessment;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async findAll(query: AssessmentFilterDto = {}, user: User): Promise<Assessment[]> {
    const { search, isActive, categoryId, sortBy, sortOrder } = query;
    const queryBuilder = this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.assessmentCategory', 'category');

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(assessment.title) LIKE LOWER(:search) OR LOWER(assessment.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('assessment.isActive = :isActive', { isActive });
    }

    if (categoryId) {
      queryBuilder.andWhere('assessment.assessmentCategory.id = :categoryId', { categoryId });
    }

    // Role-based visibility: students can only see active assessments
    if (user.roles.includes(ValidRoles.student)) {
      queryBuilder.andWhere('assessment.isActive = :isActiveForStudent', { isActiveForStudent: true });
    }

    // Apply sorting
    const field = sortBy || 'created_at';
    const order = sortOrder || 'DESC';
    
    if (field === 'title') {
      queryBuilder.orderBy('assessment.title', order);
    } else if (field === 'attempts') {
      queryBuilder.orderBy('assessment.attempts', order);
    } else {
      queryBuilder.orderBy('assessment.creation_date', order);
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Assessment> {
    try {
      const assessment = await this.assessmentRepository.findOne({ where: { id } });
      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }
      return assessment;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleDBExceptions(error, this.logger);
    }
  }

  async findOneWithQuestions(id: string, user: User): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne(
      {
        where: { id },
        relations: {
          questionPivots: {
            question: {
              answerOptions: true
            }
          }
        },
        order: {
          questionPivots: {
            order: 'ASC'
          }
        }
      });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    // Role-based visibility: students can only access active assessments
    if (user.roles.includes(ValidRoles.student) && !assessment.isActive) {
      throw new NotFoundException('Assessment not found');
    }

    // Convertir las keys de las imágenes a presigned URLs
    if (assessment?.questionPivots) {
      for (const pivot of assessment.questionPivots) {
        if (pivot.question?.questionImage) {
          try {
            pivot.question.questionImage = await this.s3Service.getPresignedUrl(pivot.question.questionImage);
          } catch (error) {
            console.warn('Failed to presign question image URL:', pivot.question.questionImage, error);
            pivot.question.questionImage = null;
          }
        }
      }
    }

    return assessment;
  }

  async update(id: string, dto: UpdateAssessmentDto): Promise<Assessment> {
    try {
      const assessment = await this.findOne(id);
      return this.assessmentRepository.save({ ...assessment, ...dto, assessmentCategory: { id: dto.id_assessment_category } });
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const assessment = await this.findOne(id);
      await this.assessmentRepository.softRemove(assessment);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  /**
   * Evalúa un assessment basado en las respuestas del usuario
   */
  async evaluateAssessment(dto: AssessmentEvaluationDto): Promise<AssessmentEvaluationResultDto> {
    try {
      // Verificar que el assessment existe
      const assessment = await this.findOne(dto.assessmentId);
      
      // Validar que todas las respuestas sean válidas
      const answerIds = dto.answers.map(answer => answer.answerId);
      const validAnswers = await this.assessmentAnswerOptionRepository
        .createQueryBuilder('option')
        .innerJoin('option.question', 'question')
        .innerJoin('question.assessmentPivots', 'pivot')
        .where('option.id IN (:...answerIds)', { answerIds })
        .andWhere('pivot.id_assessment = :assessmentId', { assessmentId: dto.assessmentId })
        .getMany();

      if (validAnswers.length !== dto.answers.length) {
        throw new BadRequestException('Some answer options are not valid for this assessment');
      }

      // Calcular el score total
      let totalScore = 0;
      const validatedAnswers = [];

      for (const userAnswer of dto.answers) {
        const answerOption = validAnswers.find(option => option.id === userAnswer.answerId);
        if (!answerOption) {
          throw new BadRequestException(`Answer option ${userAnswer.answerId} not found`);
        }

        // Verificar que el score proporcionado coincide con el de la base de datos
        if (userAnswer.score !== answerOption.score) {
          this.logger.warn(`Score mismatch for answer ${userAnswer.answerId}. Expected: ${answerOption.score}, Provided: ${userAnswer.score}`);
        }

        totalScore += answerOption.score;
        validatedAnswers.push({
          questionId: userAnswer.questionId,
          answerId: userAnswer.answerId,
          score: answerOption.score // Usar el score de la base de datos
        });
      }

      // Buscar el risk segment correspondiente
      const riskSegments = await this.assessmentRiskSegmentRepository.find({
        where: { assessment: { id: dto.assessmentId } },
        order: { minScore: 'ASC' }
      });

      // Encontrar el segmento donde el score cae (minScore <= score <= maxScore)
      // Si está justo en el límite, toma el inferior (<=)
      const matchingSegment = riskSegments
        .reverse() // Invertir para empezar desde el score más alto
        .find(segment => totalScore >= segment.minScore && totalScore <= segment.maxScore);

      const percentage = assessment.maxScore > 0 ? Math.round((totalScore / assessment.maxScore) * 100) : 0;

      const result: AssessmentEvaluationResultDto = {
        assessmentId: dto.assessmentId,
        totalScore,
        maxPossibleScore: assessment.maxScore,
        percentage,
        answers: validatedAnswers,
        riskSegment: matchingSegment ? {
          id: matchingSegment.id,
          minScore: matchingSegment.minScore,
          maxScore: matchingSegment.maxScore,
          recommendations: matchingSegment.recommendations
        } : undefined
      };

      // Add 1 to the attempts
      await this.assessmentRepository.update(dto.assessmentId, { attempts: () => 'attempts + 1' });

      return result;

    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleDBExceptions(error, this.logger);
    }
  }

  /**
   * Obtiene los assessments ordenados por cantidad de attempts
   * @param order ASC para menos intentos, DESC para más intentos
   * @param limit Número máximo de assessments a retornar (default: 10)
   */
  async findTopByAttempts(order: 'ASC' | 'DESC' = 'DESC', limit: number = 10): Promise<Assessment[]> {
    return this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.assessmentCategory', 'category')
      .orderBy('assessment.attempts', order)
      .addOrderBy('assessment.title', 'ASC') // Secondary sort by title for consistency
      .limit(limit)
      .getMany();
  }
}
