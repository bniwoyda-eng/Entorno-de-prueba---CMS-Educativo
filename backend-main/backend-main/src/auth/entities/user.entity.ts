import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ValidRoles, ValidUserStatus } from '../interfaces';
import { Educator, Student } from 'src/exports/entities';
import { CalendarEvent } from 'src/calendar-event/entities/calendar-event.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    email: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('text', {
        array: true,
        default: [ValidRoles.institution],
    })
    roles: ValidRoles[];

    @Column('text', { default: ValidUserStatus.active })
    status: ValidUserStatus;

    @Column('bool', { default: false })
    is_deleted: boolean;

    @Column('uuid')
    tenantId: string;

    @Column('text', { nullable: true })
    recoveryToken: string | null;

    @Column('timestamp with time zone', { nullable: true })
    recoveryTokenExpires: Date | null;

    @OneToOne(() => Student, (student) => student.user, { nullable: true })
    student: Student | null;

    // RELACIONES
    @OneToOne(() => Educator, (educator) => educator.user, { nullable: true })
    educator: Educator | null;

    @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.institution, { nullable: true })
    calendarEvents: CalendarEvent[];

    @BeforeInsert()
    emailToLowerCaseBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    emailToLowerCaseBeforeUpdate() {
        this.email = this.email.toLowerCase().trim();
    }
}
