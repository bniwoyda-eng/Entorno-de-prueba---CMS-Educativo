import { IsUrl } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Level } from '../dtos';
import { ValidRoles } from 'src/auth';
import { AbstractEntityUUID } from 'src/common/entities';
import { Lesson, EducatorEnrollment, StudentEnrollment } from 'src/exports/entities';

@Entity('courses')
export class Course extends AbstractEntityUUID {

    @Column({
        type: 'enum',
        enum: ValidRoles,
        array: true,
        nullable: false,
        default: []
    })
    roles: ValidRoles[];

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'enum', enum: Level, default: Level.BASIC })
    level: Level = Level.BASIC;

    @Column('varchar', { nullable: false })
    @IsUrl({}, { each: true, message: 'Each image URL must be a valid URL.' })
    imageUrl: string;

    @Column({ type: 'varchar', nullable: false })
    @IsUrl({}, { each: true, message: 'Each video URL must be a valid URL.' })
    videoUrl: string;

    @Column({ type: 'float', default: 0 })
    totalDuration: number;

    @Column({ type: 'int', default: 0 })
    lessonCount: number;

    @Column({ type: 'int', nullable: false })
    sequence: number;

    @OneToMany(() => Lesson, (lessons) => lessons.course, {
        eager: true,
    })
    lessons: Lesson[];

    @OneToMany(() => StudentEnrollment, (studentEnrollments) => studentEnrollments.course)
    studentEnrollments: StudentEnrollment[];

    @OneToMany(() => EducatorEnrollment, (educatorEnrollment) => educatorEnrollment.course)
    educatorEnrollments: EducatorEnrollment[];
}
