import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CSM } from './csm.entity';
import { AbstractEntityUUID } from '.';

@Entity('csm_employees')
export class CSMEmployees extends AbstractEntityUUID {
    @ManyToOne(() => CSM, (csm) => csm.csmEmployees)
    @JoinColumn({ name: 'csm_id' })
    csm: CSM;

    @Column({ type: 'varchar', length: 100 })
    position: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    salary: number;

    @Column({ type: 'timestamp' })
    hired_date: Date;
}
