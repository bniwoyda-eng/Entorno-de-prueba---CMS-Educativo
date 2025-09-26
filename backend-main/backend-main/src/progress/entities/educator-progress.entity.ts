import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntityUUID, Material, Educator } from 'src/exports/entities';

@Entity('educator_progress')
export class EducatorProgress extends AbstractEntityUUID {

    @ManyToOne(() => Educator, (educator) => educator.educatorProgress, { nullable: false })
    educator: Educator;

    @ManyToOne(() => Material, (material) => material.educatorProgress, { nullable: false })
    material: Material;

    @Column({ type: 'float', nullable: false, default: 0 })
    lastPosition: number;

    @Column({ type: 'float', nullable: false, default: 0 })
    progressPercentage: number;

    @Column({ type: 'float', nullable: true })
    score: number; // Solo para materiales tipo quiz
} 
