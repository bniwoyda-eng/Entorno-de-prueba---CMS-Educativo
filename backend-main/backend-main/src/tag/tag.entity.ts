import { CalendarEventTag } from "src/calendar-event/entities/calendar-event-tag.entity";
import { AbstractEntityUUID } from "src/common/entities";
import { PostTag } from "src/post/entities/post-tag.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('tags')
export class Tag extends AbstractEntityUUID {
    @Column({ type: 'varchar', nullable: false, unique: true, length: 50 })
    name: string;

    @OneToMany(() => PostTag, (postTag) => postTag.tag, { nullable: false })
    postTags: PostTag[];

    @OneToMany(() => CalendarEventTag, (calendarEventTag) => calendarEventTag.tag, { nullable: false })
    calendarEventTags: CalendarEventTag[];
}
