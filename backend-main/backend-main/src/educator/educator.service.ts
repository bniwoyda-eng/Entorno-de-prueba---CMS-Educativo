import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { EntityValidatorService, PaginatedResponse, PaginationDto } from 'src/common';
import { Institution, User } from 'src/exports/entities';

import { CreateEducatorDto, UpdateEducatorDto } from './dto';
import { Educator } from './entities/educator.entity';


@Injectable()
export class EducatorService {

  constructor(
    @InjectRepository(Educator)
    private readonly educatorRepository: Repository<Educator>,

    private readonly entityValidator: EntityValidatorService,
  ) { }

  async create(dto: CreateEducatorDto): Promise<Educator> {
    try {
      const institution = await this.entityValidator.findByIdOrThrow(Institution, dto.institutionId, 'Institution');
      const educator = this.educatorRepository.create({ ...dto, institution });
      return await this.educatorRepository.save(educator);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating educator');
    }
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResponse<Educator>> {
    const { page, limit } = dto;
    const [educators, total] = await this.educatorRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: educators,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string): Promise<Educator> {
    const educator = await this.educatorRepository.findOne({ where: { id } });
    if (!educator) throw new NotFoundException('Educator not found');
    return educator;
  }

  async suggestedEducators(user: User, count: number): Promise<Educator[]> {
    const educator = await this.educatorRepository.findOne({ where: { user: { id: user.id } } });
    if (!educator) throw new NotFoundException('Educator not found');
    const { institution } = educator;

    // Paso 1: Obtener más educadores de los necesarios 
    const potentialEducators = await this.educatorRepository.find({
      where: {
        institution,
        user: { id: Not(user.id) },
      },
    });

    // Paso 2: Orden aleatorio
    const randomized = shuffleArray(potentialEducators);

    // Paso 3: Devolver los primeros N
    return randomized.slice(0, count);
  }

  async update(id: string, dto: UpdateEducatorDto): Promise<Educator> {
    try {
      const institution = await this.entityValidator.findByIdOrThrow(Institution, dto.institutionId, 'Institution');
      const educator = await this.educatorRepository.preload({ id, ...dto, institution });
      if (!educator) throw new NotFoundException('Educator not found');
      return await this.educatorRepository.save(educator);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error updating educator');
    }

  }

  async remove(id: string): Promise<Educator> {
    const educator = await this.findOne(id);
    if (!educator) throw new NotFoundException('Educator not found');
    try {
      await this.educatorRepository.update(id, { delete_date: new Date() });
      return educator;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error deleting educator');
    }
  }

  async findByUserId(userId: string): Promise<Educator | null> {
    return this.educatorRepository.findOne({ where: { user: { id: userId } }, relations: { institution: true } });
  }

  async existsOnInstitution(educatorId: string, institutionId: string): Promise<boolean> {
    const educator = await this.educatorRepository.findOne({
      where: { id: educatorId, institution: { id: institutionId } },
    });
    return !!educator;
  }

  async getColleagues(user: User): Promise<Educator[]> {
    const educator = await this.findByUserId(user.id);
    if (!educator) throw new NotFoundException('Educator not found');
    const { institution } = educator;

    const colleagues = await this.educatorRepository.find({
      where: {
        institution: { id: institution.id },
        id: Not(educator.id),
      },
    });

    return colleagues;
  }

  async findOneFromInstitution(educatorId: string, institutionId: string): Promise<Educator> {
    const educator = await this.educatorRepository.findOne({
      where: { id: educatorId, institution: { id: institutionId } },
    });
    if (!educator) throw new NotFoundException('Educator not found');
    return educator;
  }

  async incrementTotalPosts(educatorId: string): Promise<void> {
    const educator = await this.educatorRepository.findOne({ where: { id: educatorId } });
    if (!educator) throw new NotFoundException('Educator not found');
    educator.totalPosts += 1;
    await this.educatorRepository.save(educator);
  }

  async decrementTotalPosts(educatorId: string): Promise<void> {
    const educator = await this.educatorRepository.findOne({ where: { id: educatorId } });
    if (!educator) throw new NotFoundException('Educator not found');
    educator.totalPosts = Math.max(0, educator.totalPosts - 1);
    await this.educatorRepository.save(educator);
  }


}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}