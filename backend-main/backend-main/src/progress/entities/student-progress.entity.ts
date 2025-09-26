import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntityUUID, Material, Student } from 'src/exports/entities';

@Entity('student_progress')
export class StudentProgress extends AbstractEntityUUID {

    @ManyToOne(() => Student, (student) => student.studentProgress, { nullable: false })
    student: Student;

    @ManyToOne(() => Material, (material) => material.studentProgress, { nullable: false })
    material: Material;

    @Column({ type: 'float', nullable: false, default: 0 })
    lastPosition: number;

    @Column({ type: 'float', nullable: false, default: 0 })
    progressPercentage: number;

    @Column({ type: 'float', nullable: true })
    score: number; // Solo para materiales tipo quiz
} 
