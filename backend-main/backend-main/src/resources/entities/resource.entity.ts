import { Entity, Column, OneToMany, } from 'typeorm';

import { ResourceAttachment } from './resource-attachment.entity';
import { ResourceComment } from './resource-comment.entity';
import { AbstractEntityUUID } from 'src/common/entities';
import { ResourceStatus, ResourceType } from '../types';

@Entity('resources')
export class Resource extends AbstractEntityUUID {

    @Column({ type: 'enum', enum: ResourceType, default: ResourceType.OTHER })
    resourceType: ResourceType;

    @Column({ type: 'enum', enum: ResourceStatus, default: ResourceStatus.DRAFT })
    status: ResourceStatus;

    @Column('text', { nullable: true })
    thumbnailUrl: string;

    @Column('text')
    title: string;

    @Column('text')
    extract: string;

    @Column('text', { nullable: true })
    contentUrl: string;

    @Column('text', { nullable: true, array: true })
    paragraphs: string[];

    @Column('int', { default: 0 })
    minsDuration: number;

    @Column('int', { default: 0 })
    views: number;

    @Column('int', { default: 0 })
    sequence: number;

    @OneToMany(() => ResourceAttachment, (attachment) => attachment.resource, {
        cascade: true,
    })
    attachments: ResourceAttachment[];

    @OneToMany(() => ResourceComment, (comment) => comment.resource, {
        cascade: true,
    })
    comments: ResourceComment[];
}
