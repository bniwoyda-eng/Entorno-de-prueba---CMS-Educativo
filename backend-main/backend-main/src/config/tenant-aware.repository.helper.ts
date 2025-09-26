import { DataSource, Repository } from 'typeorm';
import { TenantAwareRepository } from './tenant-aware.repository';

export function getTenantAwareRepository<Entity>(
    entity: { new (): Entity },
    dataSource: DataSource
): TenantAwareRepository<Entity> {
    const baseRepository = dataSource.getRepository<Entity>(entity);
    return baseRepository.extend(TenantAwareRepository) as unknown as TenantAwareRepository<Entity>;
}
