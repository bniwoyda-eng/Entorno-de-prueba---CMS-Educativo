import { Column, Entity, Index, ManyToOne } from "typeorm";
import { AbstractEntityUUID } from "src/common/entities";
import { Educator } from 'src/exports/entities';
import { Chat } from "./chat.entity";

@Entity({ name: 'chats_messages' })
@Index('idx_chats_messages_chat', ['chat'])
@Index('idx_chats_messages_sender', ['sender'])
@Index('idx_chats_messages_receiver', ['receiver'])
@Index('idx_chats_messages_sender_receiver', ['sender', 'receiver'])
export class Message extends AbstractEntityUUID {

    @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
    chat: Chat;

    @ManyToOne(() => Educator, { eager: true, })
    sender: Educator;

    @ManyToOne(() => Educator, { eager: true })
    receiver: Educator;

    @Column('varchar', { length: 500 })
    content: string;

    @Column({ default: false })
    read: boolean;

}
