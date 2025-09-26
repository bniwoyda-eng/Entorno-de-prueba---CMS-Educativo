import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntityUUID } from 'src/common/entities';
import { InstitutionEmployees } from './institutions-employees.entity';
import { CalendarEvent, Chat, Educator, Student } from 'src/exports/entities';

@Entity({ name: 'institutions' })
export class Institution extends AbstractEntityUUID {
    //comercial data
    @Column({ type: 'varchar', nullable: true })
    comercialName: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ type: 'varchar', nullable: true })
    comercialemail: string;

    @Column({ type: 'varchar', nullable: true })
    comercialAddress: string;

    @Column({ type: 'varchar', nullable: true })
    city: string;

    @Column({ type: 'varchar', nullable: true })
    country: string;

    @Column({ type: 'varchar', nullable: true })
    postalCode: string;

    @Column({ type: 'varchar', nullable: true })
    websiteUrl: string;

    // Fiscal data
    @Column({ type: 'varchar', length: 100, nullable: true })
    fiscalName: string; // Social reason or name

    @Column({ type: 'varchar', length: 255, nullable: true })
    fiscalAddress: string; // Fiscal address

    @Column({ type: 'varchar', length: 20, nullable: true })
    fiscalVAT: string; // VAT number or Company Registration Number

    // Bank details
    @Column({ type: 'varchar', nullable: true })
    iban: string;

    @Column({ type: 'varchar', nullable: true })
    swiftBic: string;

    @Column({ type: 'varchar', nullable: true })
    bankAccountNumber: string;

    @Column({ type: 'varchar', nullable: true })
    aba: string;

    @Column({ nullable: true })
    otherBankDetail: string;

    @Column({ default: false })
    is_deleted: boolean;

    @Column({ type: 'varchar', nullable: true })
    createdBy: string;

    @Column({ type: 'varchar', nullable: true })
    updatedBy: string;

    @OneToMany(
        () => InstitutionEmployees,
        (educationalInstitutionEmployees) => educationalInstitutionEmployees.institution
    )
    employees: InstitutionEmployees[];

    @OneToMany(() => Student, (student) => student.institution)
    students: Student[];

    // RELACIONES
    @OneToMany(() => Educator, (educator) => educator.institution)
    educators: Educator[];

    @OneToMany(() => Chat, (chat) => chat.institution)
    chats: Chat[];

    @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.institution, { nullable: true })
    calendarEvents: CalendarEvent[];
}
