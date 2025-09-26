import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResponse, PaginationDto } from 'src/common';
import { CreateTagDto, UpdateTagDto } from './dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  async create(dto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(dto);
    await this.tagRepository.save(tag);
    return tag;
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag with id ${id} not found`);
    return tag;
  }

  async update(id: string, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    Object.assign(tag, dto);
    await this.tagRepository.save(tag);
    return tag;
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findOne(id);
    tag.delete_date = new Date();
    await this.tagRepository.save(tag);
  }
}
