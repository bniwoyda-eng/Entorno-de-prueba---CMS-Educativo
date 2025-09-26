import { Event } from "react-big-calendar";
import { parseISO } from "date-fns";

export const parseDates = (events: any[]): Event[] => {
    return events.map(event => {

        event.start = parseISO(event.startDate);
        event.end = parseISO(event.endDate);

        return event;
    })
}