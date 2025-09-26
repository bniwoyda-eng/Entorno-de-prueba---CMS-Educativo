export const ECalendarEvent = {
    GLOBAL: 'global',
    INSTITUTION: 'institution',
} as const;

export type TCalendarEvent = (typeof ECalendarEvent)[keyof typeof ECalendarEvent];
