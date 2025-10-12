import { Directory, File, Paths } from "expo-file-system";
import { isEventViableToday } from "./crude_file_system_helpers";
import { cleanFileName, getTodayMidnightUTC } from "./generic_helpers";

const fileDir = new Directory(Paths.document, "streak");
const file = new File(fileDir, "events.json");

export type Event = {
  startDate: string; // ISO string
  interval: number;
  duration: number;
  startTime: string; // ISO string
  No_of_times_checked: number;
  No_of_times_to_be_checked: number;
  expired: boolean;
  event_id: string;
  last_checked: string; // ISO string
};

export type ReadEventsResult =
  | Record<string, Event>
  | { error: string }
  | { fail: string }
  | { pass: string };

export const readEvents = (): ReadEventsResult => {
  let eventData = null;
  try {
    if (!file.exists) return { fail: "storage file not found" };

    eventData = file.textSync();
    return eventData ? JSON.parse(eventData) : { pass: "no data" };
  } catch (error: unknown) {
    console.error(`
      stack trace:
      file_exists: ${file.exists}
      event data: ${eventData}
      error: ${error}`);
    return { error: `error reading events: ${error}` };
  }
};

// Write safely — now enforces Record<string, Event>
const writeEvents = (events: Record<string, Event>) => {
  try {
    file.write(JSON.stringify(events));
  } catch (error: unknown) {
    console.error(`
      stack trace: 
      payload: ${JSON.stringify(events)},
      error: ${error}
    `);
    return { error: `error writing to storage: ${error}` };
  }
};

// Create event safely
export const createEvent = ({
  event_name,
  duration,
  interval,
  startTime,
  startDate,
  no_of_times_to_be_checked,
}: {
  event_name: string;
  duration: string;
  interval: string;
  startTime: string;
  startDate: string;
  no_of_times_to_be_checked: string;
}) => {
  try {
    const events = readEvents();

    if ("error" in events || "fail" in events || "pass" in events) {
      return events;
    }

    const fileName = cleanFileName(event_name);
    const event_id = `${fileName}_${Date.now()}`;

    events[event_id] = {
      startDate: getTodayMidnightUTC(startDate),
      interval: Number(interval),
      duration: Number(duration),
      startTime: new Date(startTime).toISOString(),
      No_of_times_to_be_checked: Number(no_of_times_to_be_checked),
      No_of_times_checked: 0,
      expired: false,
      event_id,
      last_checked: getTodayMidnightUTC(),
    };

    const writeResponse = writeEvents(events);
    if (writeResponse?.error) return writeResponse;

    return { success: "Event created", event_id };
  } catch (error) {
    return { error: `Error creating event: ${error}` };
  }
};

export const updateEventField = <K extends keyof Event>(
  event_id: string,
  eventField: K,
  updatedValue: Event[K] | string | number | boolean
) => {
  try {
    const events = readEvents();
    if ("error" in events || "fail" in events || "pass" in events)
      return events;

    const event = events[event_id];
    if (!event) return { failure: "Event not found" };

    let parsedValue: Event[K];

    switch (eventField) {
      case "interval":
      case "duration":
      case "No_of_times_checked":
      case "No_of_times_to_be_checked":
        parsedValue = Number(updatedValue) as Event[K];
        break;

      case "expired":
        parsedValue = Boolean(updatedValue) as Event[K];
        break;

      case "startDate":
      case "last_checked":
        parsedValue = getTodayMidnightUTC(String(updatedValue)) as Event[K];
        break;

      case "startTime":
        parsedValue = new Date(String(updatedValue)).toISOString() as Event[K];
        break;

      case "event_id":
        throw new Error("Event ID cannot be modified");

      default:
        parsedValue = updatedValue as Event[K];
    }

    event[eventField] = parsedValue;
    writeEvents(events);

    return { success: "Field updated" };
  } catch (error) {
    return { error: `Error updating event: ${error}` };
  }
};

export const deleteEvent = (event_id: string) => {
  try {
    const events = readEvents();
    if ("error" in events || "fail" in events || "pass" in events)
      return events;

    if (!events[event_id]) return { failure: "Event not found" };

    delete events[event_id];
    writeEvents(events);
    return { success: "Event deleted" };
  } catch (error) {
    return { error: `Error deleting event: ${error}` };
  }
};

export const tickEvent = ({ event_id }: { event_id: string }) => {
  try {
    const events = readEvents();
    if ("error" in events || "fail" in events || "pass" in events)
      return events;

    const event = events[event_id];
    if (!event) return { failure: "Event not found" };

    const eventViable = isEventViableToday(event);

    if (eventViable) {
      event.No_of_times_checked += 1;
      event.last_checked = getTodayMidnightUTC();

      events[event_id] = event;
      writeEvents(events);
      return { success: "Event ticked" };
    }

    return { failure: "Event not viable to be checked today" };
  } catch (error) {
    return { error: `Error ticking event: ${error}` };
  }
};
