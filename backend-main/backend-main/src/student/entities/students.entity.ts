import { Entity, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User, AbstractEntityUUID, Institution, StudentProgress, StudentEnrollment } from 'src/exports/entities';

@Entity()
export class Student extends AbstractEntityUUID {

    @Column({ type: 'varchar', length: 255, nullable: true })
    profilePicture: string;

    @Column({ type: 'varchar' })
    fullName: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    whatsappPhone: string;

    @ManyToOne(() => Institution, (institution) => institution.students)
    institution: Institution;

    @OneToOne(() => User, (user) => user.student)
    @JoinColumn()
    user: User;

    @OneToMany(() => StudentProgress, (studentProgress) => studentProgress.student)
    studentProgress: StudentProgress[];

    @OneToMany(() => StudentEnrollment, (studentEnrollments) => studentEnrollments.student)
    studentEnrollments: StudentEnrollment[];

}
