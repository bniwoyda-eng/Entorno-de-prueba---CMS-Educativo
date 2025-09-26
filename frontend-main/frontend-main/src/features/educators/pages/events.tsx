import { useEffect, useState } from "react";
import { Button, ImageWithFallback, Modal } from "../../../components";
import { CalendarEventForm } from "../components";
import { useCalendarEvents } from "../api/educators.queries";

import {
  Calendar,
  dateFnsLocalizer,
  Event as RBCEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ICalendarEvent } from "../types/calendar-events.types";
import {
  CircleUser,
  EarthIcon,
  Landmark,
  Paperclip,
  User,
  Calendar as CalendarIcon,
  CalendarCheck,
} from "lucide-react";
import { useAuthStore } from "../../auth/auth.store";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const parseDates = (events: ICalendarEvent[]): ExtendedEvent[] => {
  return events.map((event) => ({
    ...event,
    start: parseISO(event.startDate),
    end: parseISO(event.endDate),
  }));
};

export type ExtendedEvent = Omit<ICalendarEvent, "startDate" | "endDate"> & {
  start: Date;
  end: Date;
  title: string;
} & RBCEvent;

export type EventFilter = "all" | "global" | "institution" | "personal";

export const Events = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) return;

  const [filter, setFilter] = useState<EventFilter>("all");
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleCreateEvent = () => {
    setCreateModalOpen(true);
  };

  const { data: calendarEvents } = useCalendarEvents({ filter });

  useEffect(() => {
    if (calendarEvents?.data) {
      const parsedEvents = parseDates(calendarEvents.data);
      setEvents(parsedEvents);
    }
  }, [calendarEvents]);

  const eventStyleGetter = (event: ExtendedEvent) => ({
    style: {
      backgroundColor: event.type === "global" ? "#F3F4F6" : "#7582CB",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      marginBottom: "3px",
      padding: "3px",
      fontSize: ".75em",
      color: event.type === "global" ? "#000000" : "#FFFFFF",
    },
  });

  const handleDoubleClickEvent = (event: ExtendedEvent) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  const handleClose = () => {
    setCreateModalOpen(false);
    setEditingId(null);
    setDetailModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="page-base">
      <div className="flex flex-col gap-3 md:flex-row justify-between items-center mb-3">
        <h1 className="text-xl font-medium">What’s Happening</h1>
        <select
          className="border border-gray-300 rounded-md p-2 form-control w-72"
          value={filter}
          onChange={(e) => setFilter(e.target.value as EventFilter)}
        >
          <option value="all">All Events</option>
          <option value="global">Global Events</option>
          <option value="institution">Institution Events</option>
          <option value="personal">Personal Events</option>
        </select>
        <Button text="Create Event" onClick={handleCreateEvent} />
      </div>

      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 160px)" }}
        eventPropGetter={eventStyleGetter}
        components={{
          event: ({ event }) => (
            <div className="flex items-center gap-2">
              {event.type === "global" && (
                <span title="Global Event">
                  <EarthIcon className="inline w-4 h-4 text-sky-500 shrink-0" />
                </span>
              )}
              {event.user.id === user.id && (
                <span title="Your Event">
                  <CircleUser
                    fill="white"
                    className="inline w-4 h-4 text-main-400 shrink-0"
                  />
                </span>
              )}
              <span>{event.title}</span>
            </div>
          ),
        }}
        popup
        className="bg-white rounded-lg shadow-md p-6"
        onDoubleClickEvent={handleDoubleClickEvent}
      />

      <Modal isOpen={detailModalOpen} onClose={handleClose}>
        <Modal.Header>
          <div className="flex items-center gap-2">
            <span>Event detail</span>
            {selectedEvent?.type === "global" ? (
              <div className="mb-1">
                <span className="items-center gap-1 bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-xs font-semibold inline-block">
                  <EarthIcon className="inline w-4 h-4 mr-1" />
                  Global Event
                </span>
              </div>
            ) : (
              <div className="mb-1">
                <span className="items-center gap-1 bg-zinc-100 text-zinc-800 px-2 py-1 rounded-full text-xs font-semibold inline-block">
                  <Landmark className="inline w-4 h-4 mr-1" />
                  Institution Event
                </span>
              </div>
            )}
          </div>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div className="space-y-2">
              {selectedEvent.bannerUrl && (
                <ImageWithFallback
                  src={selectedEvent.bannerUrl}
                  alt={selectedEvent.title}
                  title={selectedEvent.title}
                  imageClassName="rounded-xl"
                  className="w-full object-cover h-48 my-2"
                />
              )}
              <p className="flex items-center gap-2 font-medium text-xl">
                {selectedEvent.title}
              </p>
              <p className="text-gray-600">{selectedEvent.description}</p>
              <p className="flex items-center gap-2">
                <User className="inline w-4 h-4" />
                <span className="text-sm italic">
                  {selectedEvent.user.fullName} ({selectedEvent.user.email})
                </span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="inline w-4 h-4" />
                  <span className="font-medium">Start:</span>
                  <span className="text-sm">
                    {format(selectedEvent.start, "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="inline w-4 h-4" />
                  <span className="font-medium">End:</span>
                  <span className="text-sm">
                    {format(selectedEvent.end, "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
              </div>
              {selectedEvent.eventUrl && (
                <p className="line-clamp-1">
                  <Paperclip className="inline mr-2 w-4 h-4" />
                  <a
                    href={selectedEvent.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {selectedEvent.eventUrl}
                  </a>
                </p>
              )}
              {selectedEvent.calendarEventTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEvent.calendarEventTags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="bg-main-100 text-main-500 text-xs font-medium px-2 py-1 rounded-full hover:bg-main-200 transition duration-300 hover:cursor-pointer"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button text="Close" onClick={() => setDetailModalOpen(false)} />
          {selectedEvent && selectedEvent.user.id === user.id && (
            <Button
              icon="edit"
              transparent
              text="Edit"
              onClick={() => {
                setEditingId(selectedEvent.id);
                setCreateModalOpen(true);
              }}
            />
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal for creating/editing events */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <Modal.Header>{editingId ? "Edit Event" : "Create Event"}</Modal.Header>
        <Modal.Body>
          <CalendarEventForm
            calendarEventId={editingId}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
