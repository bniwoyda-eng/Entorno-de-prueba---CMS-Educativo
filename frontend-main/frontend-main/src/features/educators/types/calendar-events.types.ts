export interface ICalendarEvent {
    id: string;
    creation_date: string;
    update_date: string;
    delete_date: string | null;
    type: "global" | "institution";
    title: string;
    description: string;
    bannerUrl?: string;
    eventUrl?: string;
    startDate: string;
    endDate: string;
    calendarEventTags: {
        tag: {
            id: string;
            name: string;
        };
    }[];
    user: {
        id: string;
        email: string;
        fullName: string;
        roles: string[];
    }
}