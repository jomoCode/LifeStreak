import { cleanDatabaseRow } from "./crude_sqlite_helpers";
import {
  convert2Number,
  convertHHMM_2IsoTimeString,
  getTodayMidnightUTC,
  runSql,
} from "./generic_helpers";

// ------------------- Types -------------------

export type CreateEvent = {
  event_name: string;
  duration: number;
  interval: number;
  startTime: string; // Time formats: "08:00" or full ISO
  startDate: string; // Date formats:  YYYY-MM-DD or ISO
  timesPerDay: number; // number of events per day
  timeInterval: number;
  No_of_times_checked: number;
};

export type Event = CreateEvent & { event_id: string };

// Read all events
export const readEvents = async () => {
  try {
    const rows: Event[] = await runSql("SELECT * FROM events");

    if (!Array.isArray(rows)) return [];

    const normalizedEventsArray = rows.map((r) => cleanDatabaseRow(r));

    return normalizedEventsArray;
  } catch (error: unknown) {
    return { error: `Error reading events: ${error}` };
  }
};

// Create new event
export const createEvent = async ({
  event_name,
  duration,
  interval,
  startTime,
  startDate,
  timesPerDay,
  timeInterval,
}: CreateEvent) => {
  try {
    const event_id = `${event_name.replace(/\s+/g, "_")}_${Date.now()}`;

    // Normalize startDate to UTC midnight
    const startDateISO = getTodayMidnightUTC(startDate);

    // Normalize startTime
    let startTimeISO = "";
    if (typeof startTime === "string" && startTime.includes("T")) {
      // Already an ISO timestamp
      startTimeISO = new Date(startTime).toISOString();
    } else if (typeof startTime === "string") {
      // Convert "HH:mm" to ISO string on the startDate
      startTimeISO = convertHHMM_2IsoTimeString(startTime, startDateISO);
    } else {
      throw new Error("startTime format is invalid");
    }

    // Insert into DB
    await runSql(
      `INSERT INTO events (
    event_id,
    event_name,
    startDate,
    startTime,
    interval,
    duration,
    timesPerDay,
    timeInterval,
     No_of_times_checked
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        event_name,
        startDateISO,
        startTimeISO,
        Number(interval),
        Number(duration),
        Number(timesPerDay),
        Number(timeInterval),
        Number(0),
      ]
    );

    return { success: "Event created", event_id };
  } catch (error) {
    return { error: `Error creating event: ${error}` };
  }
};

type UpdateEventField<K extends keyof Event> = {
  event_id: string;
  eventField: K;
  updatedValue: Event[K];
};

// Update specific field of event
export type EventType = keyof Event;

export const updateEventField = async <K extends keyof Event>({
  event_id,
  eventField,
  updatedValue,
}: UpdateEventField<K>) => {
  const mutableFields: EventType[] = [
    "event_name",
    "startDate",
    "startTime",
    "interval",
    "duration",
    "No_of_times_checked",
  ];
  if (!mutableFields.includes(eventField))
    return { error: "Field cannot be updated" };

  let valueToStore: unknown = updatedValue;

  if (
    ["interval", "duration", "timesPerDay", "timeInterval"].includes(
      eventField as string
    )
  )
    valueToStore = Number(updatedValue);

  if (eventField === "startDate")
    valueToStore = getTodayMidnightUTC(String(updatedValue));

  if (eventField === "startTime") {
    if (eventField === "startTime") {
      // Accept either an ISO or a time string like "08:00"
      const startTimeString = String(updatedValue);
      if (startTimeString.includes("T"))
        valueToStore = new Date(startTimeString).toISOString();
      else {
        const jsDate = new Date();
        const [h = "0", m = "0"] = startTimeString.split(":");
        jsDate.setUTCHours(Number(h), Number(m), 0, 0);
        valueToStore = jsDate.toISOString();
      }
    }

    try {
      await runSql(`UPDATE events SET ${eventField} = ? WHERE event_id = ?`, [
        valueToStore,
        event_id,
      ]);
      return { success: "Field updated" };
    } catch (error) {
      return { error: `Error updating event: ${error}` };
    }
  }
};

// Delete event
export const deleteEvent = async (event_id: string) => {
  try {
    await runSql(`DELETE FROM events WHERE event_id = ?`, [event_id]);
    return { success: "Event deleted" };
  } catch (error) {
    return { error: `Error deleting event: ${error}` };
  }
};

// ------------------- Tick / Viable -------------------

// Get events viable today
export const getViableEventsToday = async () => {
  try {
    const todayISO = getTodayMidnightUTC();
    const rows: Event[] = await runSql(
      `
      SELECT *, CAST((julianday(?) - julianday(startDate)) AS INTEGER) AS days_since_start
      FROM events
      WHERE expired = 0 AND No_of_times_checked < No_of_times_to_be_checked
    `,
      [todayISO]
    );

    if (!Array.isArray(rows)) return [];

    const normalized = rows
      .map((row) => cleanDatabaseRow(row))
      .filter((event) => {
        const days_since_start = convert2Number(
          event.days_since_start,
          "getViableEventsToday"
        );
        return (
          days_since_start >= 0 &&
          days_since_start <= event.duration &&
          days_since_start % event.interval === 0
        );
      });

    return normalized;
  } catch (error) {
    return { error: `Error fetching viable events: ${error}` };
  }
};

// Tick event
export const tickEvent = async (event_id: string) => {
  try {
    const todayISO = getTodayMidnightUTC();
    const rows = await runSql<any>(
      `
      SELECT *, CAST((julianday(?) - julianday(startDate)) AS INTEGER) AS days_since_start
      FROM events
      WHERE event_id = ?
    `,
      [todayISO, event_id]
    );

    const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
    if (!row) return { failure: "Event not found" };

    const event = cleanDatabaseRow(row);
    const {
      days_since_start,
      interval,
      duration,
      No_of_times_checked,
      No_of_times_to_be_checked,
    } = event;

    if (No_of_times_checked >= No_of_times_to_be_checked)
      return { failure: "Event completed" };
    if (
      days_since_start < 0 ||
      days_since_start > duration ||
      days_since_start % interval !== 0
    )
      return { failure: "Event not viable today" };

    await runSql(
      `UPDATE events
       SET No_of_times_checked = No_of_times_checked + 1,
           last_checked = ?
       WHERE event_id = ?`,
      [todayISO, event_id]
    );

    return { success: "Event ticked" };
  } catch (error) {
    return { error: `Error ticking event: ${error}` };
  }
};
