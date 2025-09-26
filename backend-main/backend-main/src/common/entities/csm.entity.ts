import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntityUUID } from '.';
import { CSMEmployees } from './csm-employees.entity';

@Entity('csms')
export class CSM extends AbstractEntityUUID {
    @Column({ type: 'varchar', length: 255 })
    comercialName: string;

    @Column({ type: 'varchar', length: 20 })
    phone: string;

    @Column({ type: 'varchar', length: 255 })
    comercialemail: string;

    @Column({ type: 'varchar', length: 255 })
    comercialAddress: string;

    @Column({ type: 'varchar', length: 100 })
    city: string;

    @Column({ type: 'varchar', length: 100 })
    country: string;

    @Column({ type: 'varchar', length: 10 })
    postalCode: string;

    @Column({ type: 'varchar', length: 255 })
    websiteUrl: string;

    @Column({ type: 'varchar', length: 255 })
    fiscalName: string;

    @Column({ type: 'varchar', length: 255 })
    fiscalAddress: string;

    @Column({ type: 'varchar', length: 50 })
    fiscalVAT: string;

    @Column({ type: 'varchar', length: 50 })
    iban: string;

    @Column({ type: 'varchar', length: 50 })
    swiftBic: string;

    @Column({ type: 'varchar', length: 50 })
    bankAccountNumber: string;

    @Column({ type: 'varchar', length: 50 })
    aba: string;

    @Column({ type: 'varchar', length: 255 })
    otherBankDetail: string;

    @Column({ type: 'boolean', default: false })
    is_deleted: boolean;

    @OneToMany(() => CSMEmployees, (csmEmployee) => csmEmployee.csm)
    csmEmployees: CSMEmployees[];
}
