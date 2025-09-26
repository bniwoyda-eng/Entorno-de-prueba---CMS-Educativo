import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntityUUID, Institution, User } from 'src/exports/entities';
import { TCalendarEvent, ECalendarEvent } from '../calendar-event.types';
import { CalendarEventTag } from './calendar-event-tag.entity';

@Entity('calendar_events')
export class CalendarEvent extends AbstractEntityUUID {

    @Column({ type: 'enum', enum: Object.values(ECalendarEvent), nullable: false })
    type: TCalendarEvent;

    @Column({ type: 'varchar', length: 75, nullable: true })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    bannerUrl: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventUrl: string;

    @Column({ type: 'timestamp', nullable: false })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: false })
    endDate: Date;

    @ManyToOne(() => User, (user) => user.calendarEvents, { nullable: false, eager: true })
    user: User;

    @ManyToOne(() => Institution, (institution) => institution.calendarEvents, { nullable: true })
    institution: Institution;

    @OneToMany(() => CalendarEventTag, (calendarEventTag) => calendarEventTag.calendarEvent, { nullable: true, eager: true })
    calendarEventTags: CalendarEventTag[];
}
