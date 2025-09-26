import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';

export class TenantAwareRepository<T> extends Repository<T> {
    /**
     * Encuentra todas las entidades pertenecientes a un tenant con condiciones adicionales.
     * @param tenantId - ID del tenant.
     * @param conditions - Condiciones adicionales para la consulta.
     * @returns Lista de entidades que coinciden.
     */
    async findByTenant(tenantId: string, conditions: FindOptionsWhere<T> = {}): Promise<T[]> {
        return this.find({ where: { ...conditions, tenantId } });
    }

    /**
     * Encuentra una entidad perteneciente a un tenant con condiciones específicas.
     * @param tenantId - ID del tenant.
     * @param conditions - Condiciones adicionales para la consulta.
     * @returns Entidad que coincide, o null si no se encuentra.
     */
    async findOneByTenant(tenantId: string, conditions: FindOptionsWhere<T>): Promise<T | null> {
        return this.findOne({ where: { ...conditions, tenantId } });
    }

    /**
     * Crea y guarda una nueva entidad asociada a un tenant.
     * @param tenantId - ID del tenant.
     * @param data - Datos para crear la entidad.
     * @returns Entidad creada y guardada.
     */
    async createForTenant(tenantId: string, data: DeepPartial<T>): Promise<T> {
        // Agregamos el tenantId al objeto
        const entity = this.create({ ...data, tenantId } as DeepPartial<T>);
        // Guardamos y retornamos la entidad creada
        return await this.save(entity);
    }

    /**
     * Actualiza una entidad existente asociada a un tenant.
     * @param tenantId - ID del tenant.
     * @param id - ID de la entidad a actualizar.
     * @param data - Datos para actualizar la entidad.
     * @returns Entidad actualizada.
     */
    async updateForTenant(tenantId: string, id: string, data: DeepPartial<T>): Promise<T> {
        const entity = await this.findOneByTenant(tenantId, { id } as any);
        if (!entity) {
            throw new Error(`Entity with ID ${id} not found for tenant ${tenantId}`);
        }

        const updatedEntity = this.merge(entity, data);
        return this.save(updatedEntity);
    }

    /**
     * Elimina una entidad asociada a un tenant de forma lógica (soft delete).
     * @param tenantId - ID del tenant.
     * @param id - ID de la entidad a eliminar.
     * @returns La entidad marcada como eliminada.
     */
    async softDeleteForTenant(tenantId: string, id: string): Promise<T> {
        const entity = await this.findOneByTenant(tenantId, { id } as any);
        if (!entity) {
            throw new Error(`Entity with ID ${id} not found for tenant ${tenantId}`);
        }

        return this.softRemove(entity);
    }

    // /**
    //  * Restaura una entidad asociada a un tenant previamente eliminada lógicamente.
    //  * @param tenantId - ID del tenant.
    //  * @param id - ID de la entidad a restaurar.
    //  * @returns La entidad restaurada.
    //  */
    // async restoreForTenant(tenantId: string, id: string): Promise<T> {
    //     const entity = await this.findOne({
    //         where: { id, tenantId },
    //         withDeleted: true, // Incluye entidades eliminadas.
    //     });

    //     if (!entity) {
    //         throw new Error(`Entity with ID ${id} not found for tenant ${tenantId}`);
    //     }

    //     return this.recover(entity);
    // }
}
