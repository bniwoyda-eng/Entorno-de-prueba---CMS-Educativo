import { Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntityUUID } from "src/common/entities";
import { Educator, Institution } from 'src/exports/entities';
import { Message } from "./message.entity";

@Entity({ name: 'chats' })
@Index('idx_chats_educator_one', ['educatorOne'])
@Index('idx_chats_educator_two', ['educatorTwo'])
@Index('idx_chats_institution', ['institution'])
@Index('uniq_chats_educators', ['educatorOne', 'educatorTwo'], { unique: true })
export class Chat extends AbstractEntityUUID {

    @ManyToOne(() => Educator, { eager: true })
    educatorOne: Educator;

    @ManyToOne(() => Educator, { eager: true })
    educatorTwo: Educator;

    @ManyToOne(() => Institution, (institution) => institution.chats, { eager: true })
    institution: Institution;

    @OneToMany(() => Message, (message) => message.chat, { cascade: true })
    messages: Message[];

}
