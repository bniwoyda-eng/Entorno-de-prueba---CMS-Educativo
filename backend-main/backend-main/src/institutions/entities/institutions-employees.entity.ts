import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Institution } from './institutions.entity';
import { AbstractEntityUUID } from 'src/common/entities';
import { User } from 'src/auth/entities';

@Entity()
export class InstitutionEmployees extends AbstractEntityUUID {
    @Column({ type: 'varchar' })
    fullName: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    whatsappPhone: string;

    @Column({ type: 'varchar' })
    position: string;

    @Column({ type: 'varchar', nullable: true })
    createdBy: string;

    @Column({ type: 'varchar', nullable: true })
    updatedBy: string;

    @Column({ default: false })
    is_deleted: boolean;

    @Column('uuid', { nullable: true })
    tenantId: string;

    @ManyToOne(() => Institution, (educationalInstitutions) => educationalInstitutions.employees, {
        eager: true,
    })
    institution: Institution;
}
