import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateResourceDto, ResourceFilterDto, UpdateResourceDto, UpdateResourceStatusDto } from './dto';
import { PaginatedResponse } from 'src/common';
import { GroupedResource, ResourceStatus, ResourceType } from './types';
import { Resource } from './entities';

@Injectable()
export class ResourcesService {

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Resource)
    private resourceRepo: Repository<Resource>,

  ) { }

  async create(dto: CreateResourceDto): Promise<Resource> {
    const resource = this.resourceRepo.create(dto);
    return await this.resourceRepo.save(resource);
  }

  async findAll(dto: ResourceFilterDto): Promise<PaginatedResponse<Resource>> {
    const { page, limit, resourceType, textSearch, sort } = dto;

    // Procesar la configuración de sort
    const order = sort?.map((field) => {
      const isDesc = field.startsWith('-');
      const column = isDesc ? field.slice(1) : field;
      return [column, isDesc ? 'DESC' : 'ASC'];
    });

    let where = {};
    if (resourceType) where = { ...where, resourceType: resourceType };
    if (textSearch) where = { ...where, title: ILike(`%${textSearch}%`) };

    const [data, total] = await this.resourceRepo.findAndCount({
      where: { ...where, delete_date: null, status: ResourceStatus.PUBLISHED },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        resourceType: true,
        extract: true,
        creation_date: true,
        minsDuration: true,
        views: true,
      },
      order: order ? Object.fromEntries(order) : { creation_date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findGroupedByType(): Promise<GroupedResource[]> {
    // Subconsulta principal: los 10 recursos más recientes por tipo
    const mainQuery = this.resourceRepo.createQueryBuilder('resource')
      .select([
        'resource.id AS resource_id',
        'resource.resource_type AS resource_type',
        'resource.thumbnail_url AS thumbnail_url',
        'resource.title AS resource_title',
        'resource.extract AS resource_extract',
        'resource.creation_date AS resource_creation_date',
        'ROW_NUMBER() OVER (PARTITION BY resource.resource_type ORDER BY resource.creation_date DESC) AS row_number'
      ])
      .orderBy('resource.creation_date', 'DESC')
      .where('resource.delete_date IS NULL')
      .andWhere('resource.status = :status', { status: 'published' })

    // Subconsulta de conteo por tipo
    const countQuery = this.resourceRepo.createQueryBuilder('resource')
      .select('resource.resource_type', 'resource_type')
      .addSelect('COUNT(*)', 'total')
      .groupBy('resource.resource_type')
      .where('resource.delete_date IS NULL')
      .andWhere('resource.status = :status', { status: 'published' });

    // Ejecutar ambas consultas por separado
    const [rawResults, countResults] = await Promise.all([
      this.dataSource
        .createQueryBuilder()
        .select('*')
        .from(`(${mainQuery.getQuery()})`, 'sub')
        .setParameters(mainQuery.getParameters())
        .where('row_number <= 10')
        .getRawMany(),

      countQuery.getRawMany()
    ]);

    // Crear mapa de totales por tipo
    const totalsMap = Object.fromEntries(
      countResults.map(item => [item.resource_type, Number(item.total)])
    );

    // Transformar resultados
    const results = rawResults.map((item) => ({
      id: item.resource_id,
      resourceType: item.resource_type,
      thumbnailUrl: item.thumbnail_url,
      title: item.resource_title,
      extract: item.resource_extract,
      creationDate: item.resource_creation_date,
    }));

    // Agrupar y añadir el total
    const grouped = results.reduce<Record<string, GroupedResource["resources"]>>((acc, item) => {
      if (!acc[item.resourceType]) acc[item.resourceType] = [];
      acc[item.resourceType].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([type, items]) => ({
      resourceType: type,
      total: totalsMap[type] || 0,
      resources: items,
    }));
  }


  async findOne(id: string): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({ where: { id, status: ResourceStatus.PUBLISHED } });
    if (!resource) throw new NotFoundException(`Resource with ID ${id} not found`);
    return resource;
  }

  async findOneWithAttachments(id: string, resourceType: ResourceType): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({
      where: { id, resourceType, status: ResourceStatus.PUBLISHED },
      relations: { attachments: true },
    });
    if (!resource) throw new NotFoundException(`Resource with ID ${id} not found`);
    return resource;
  }

  async findOneComplete(id: string): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
      relations: { attachments: true, comments: true, },
      order: { comments: { creation_date: 'ASC' }, },
    });
    if (!resource) throw new NotFoundException(`Resource with ID ${id} not found`);
    return resource;
  }

  async update(id: string, dto: UpdateResourceDto): Promise<Resource> {
    const resource = await this.findOne(id);
    Object.assign(resource, dto);
    return await this.resourceRepo.save(resource);
  }

  async updateStatus(id: string, { status }: UpdateResourceStatusDto): Promise<Resource> {
    const resource = await this.findOne(id);
    resource.status = status;
    return await this.resourceRepo.save(resource);
  }

  async remove(id: string): Promise<string> {
    const resource = await this.findOne(id);
    resource.delete_date = new Date();
    await this.resourceRepo.save(resource);
    return `Resource with ID ${id} deleted successfully`;
  }
}
