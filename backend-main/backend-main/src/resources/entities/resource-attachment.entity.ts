import { Entity, Column, ManyToOne, Index } from 'typeorm';

import { AbstractEntityUUID } from 'src/common/entities';
import { Resource } from './resource.entity';

@Entity('resources_attachments')
export class ResourceAttachment extends AbstractEntityUUID {

    @Column('text')
    mimetype: string;

    @Column('text')
    name: string;

    @Column('text')
    url: string;

    @Column('int', { default: 0 })
    downloads: number;

    @Index('idx_resource_attachment_resource_id')
    @ManyToOne(() => Resource, (resource) => resource.attachments, {
        onDelete: 'CASCADE',
    })
    resource: Resource;
}
