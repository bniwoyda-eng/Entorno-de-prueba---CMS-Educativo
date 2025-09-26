import { Entity, Column, ManyToOne, Index } from 'typeorm';

import { AbstractEntityUUID, Educator } from 'src/exports/entities';
import { Resource } from './resource.entity';

@Entity('resources_comments')
export class ResourceComment extends AbstractEntityUUID {
 
    @Column('text')
    comment: string;

    @Index('idx_resource_comment_educator_id')
    @ManyToOne(() => Educator, (educator) => educator.comments, {
        onDelete: 'CASCADE',
    })
    educator: Educator;

    @Index('idx_resource_comment_resource_id')
    @ManyToOne(() => Resource, (resource) => resource.comments, {
        onDelete: 'CASCADE',
    })
    resource: Resource;
}
