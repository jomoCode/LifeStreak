import { cleanDatabaseRow } from "./crude_sqlite_helpers";
import {
  convert2Number,
  convertHHMM_2IsoTimeString,
  getTodayMidnightUTC,
  runSql,
} from "./generic_helpers";

// ------------------- Types -------------------
export type Event = {
  event_id: string;
  event_name: string;
  startDate: string; // ISO string (midnight UTC)
  startTime: string; // ISO string (time on the startDate)
  interval: number;
  duration: number;
  No_of_times_checked: number;
  No_of_times_to_be_checked: number;
  expired: boolean;
  last_checked: string; // ISO string (midnight UTC) or empty string
};

export type CreateEvent = {
  event_name: string;
  duration: string;
  interval: string;
  startTime: string; // Time formats: "08:00" or full ISO
  startDate: string; // Date formats:  YYYY-MM-DD or ISO
  no_of_times_to_be_checked: string;
};

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
  no_of_times_to_be_checked,
}: CreateEvent) => {
  try {
    const event_id = `${event_name.replace(/\s+/g, "_")}_${Date.now()}`;

    const startDateISO = getTodayMidnightUTC(startDate);

    let startTimeISO = "";
    if (typeof startTime === "string" && startTime.includes("T")) {
      //  Assumes start time already in ISO if it contains T
      startTimeISO = new Date(startTime).toISOString();
    } else if (typeof startTime === "string") {
      // Time format must be: "08:00" or "8:00" or full ISO STRING
      startTimeISO = convertHHMM_2IsoTimeString(startTime, startDateISO);
    } else {
      // fallback: use startDate midnight
      throw new Error("start Time format is invalid");
    }

    await runSql(
      `INSERT INTO events (
        event_id, event_name, startDate, startTime, interval, duration,
        No_of_times_checked, No_of_times_to_be_checked, expired, last_checked
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        event_name,
        startDateISO,
        startTimeISO,
        Number(interval),
        Number(duration),
        Number(0), // No_of_times_checked
        Number(no_of_times_to_be_checked),
        Number(0), // expired
        getTodayMidnightUTC(),
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
export const updateEventField = async <K extends keyof Event>({
  event_id,
  eventField,
  updatedValue,
}: UpdateEventField<K>) => {
  const mutableFields: (keyof Event)[] = [
    "event_name",
    "startDate",
    "startTime",
    "interval",
    "duration",
    "No_of_times_checked",
    "No_of_times_to_be_checked",
    "expired",
    "last_checked",
  ];
  if (!mutableFields.includes(eventField))
    return { error: "Field cannot be updated" };

  let valueToStore: unknown = updatedValue;

  if (
    [
      "interval",
      "duration",
      "No_of_times_checked",
      "No_of_times_to_be_checked",
    ].includes(eventField as string)
  )
    valueToStore = Number(updatedValue);

  if (eventField === "expired") {
    // Convert booleans to ) and 1's for sqlite compatablity
    const suspectedBooleanValue = updatedValue;
    if (typeof suspectedBooleanValue === "boolean")
      valueToStore = suspectedBooleanValue ? 1 : 0;
    else {
      throw new Error("Error saving data: Expired is suppoed to be a boolean");
    }
  }

  if (eventField === "startDate" || eventField === "last_checked")
    valueToStore = getTodayMidnightUTC(String(updatedValue));

  if (eventField === "startTime") {
    // Accept either an ISO or a time string like "08:00"
    const startTimeString = String(updatedValue);
    if (startTimeString.includes("T")) valueToStore = new Date(startTimeString).toISOString();
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
export const getViableEventsToday = async (): Promise<
  Event[] | { error: string }
> => {
  try {
    const todayISO = getTodayMidnightUTC();
    const rows = await runSql<any>(
      `
      SELECT *, CAST((julianday(?) - julianday(startDate)) AS INTEGER) AS days_since_start
      FROM events
      WHERE expired = 0 AND No_of_times_checked < No_of_times_to_be_checked
    `,
      [todayISO]
    );

    if (!Array.isArray(rows)) return [];

    const normalized = rows
      .map((r) => cleanDatabaseRow(r))
      .filter((event) => {
        const days_since_start = convert2Number(
          (event as any).days_since_start,
          -9999
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

    const event = cleanDatabaseRow(row) as any;
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
