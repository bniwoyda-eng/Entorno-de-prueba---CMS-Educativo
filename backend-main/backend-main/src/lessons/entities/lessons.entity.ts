import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntityUUID } from 'src/common/entities';
import { Course } from 'src/courses/entities';
import { Material } from 'src/materials/entities';

@Entity('lessons')
export class Lesson extends AbstractEntityUUID {
    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'float', nullable: true })
    totalDuration: number;

    @Column({ type: 'int', default: 0 })
    materialCount: number;

    @Column({ type: 'int', nullable: false })
    sequence: number;

    @ManyToOne(() => Course, (course) => course.lessons, { nullable: false })
    @JoinColumn({ name: 'courseId' })
    course: Course;

    @OneToMany(() => Material, (materials) => materials.lesson, { eager: true })
    materials: Material[];
}
