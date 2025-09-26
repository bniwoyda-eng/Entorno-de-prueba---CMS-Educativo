import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';

@Injectable()
export class EntityValidatorService {
    constructor(private readonly dataSource: DataSource) { }

    async findByIdOrThrow<T>(
        entity: EntityTarget<T>,
        id: string,
        entityName = 'Entity',
    ): Promise<T> {
        const repo = this.dataSource.getRepository(entity);
        const record = await repo.findOne({ where: { id } as any });

        if (!record) {
            throw new NotFoundException(`${entityName} with id '${id}' not found`);
        }

        return record;
    }

    async validateEntities(
        entities: { entity: EntityTarget<any>, id: string, name?: string }[],
    ) {
        const results = await Promise.all(
            entities.map(e => this.findByIdOrThrow(e.entity, e.id, e.name)),
        );
        return results;
    }
}
