import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntityUUID {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'creation_date',
    })
    creation_date: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'update_date',
    })
    update_date: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'delete_date',
    })
    delete_date: Date;
}
