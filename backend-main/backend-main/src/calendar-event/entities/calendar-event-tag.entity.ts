import { Entity, ManyToOne } from 'typeorm';
import { AbstractEntityUUID, Tag } from 'src/exports/entities';
import { CalendarEvent } from './calendar-event.entity';

@Entity('calendar_events_tags')
export class CalendarEventTag extends AbstractEntityUUID {

    @ManyToOne(() => CalendarEvent, (calendarEvent) => calendarEvent.calendarEventTags, { nullable: false })
    calendarEvent: CalendarEvent;

    @ManyToOne(() => Tag, (tag) => tag.calendarEventTags, { nullable: false, eager: true })
    tag: Tag;

}
