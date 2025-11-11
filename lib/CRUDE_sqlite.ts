// CRUD_sqlite.ts
import * as SQLite from "expo-sqlite";
import { getTodayMidnightUTC, runSql } from "./generic_helpers";

// ------------------- Types -------------------
export type Event = {
  event_id: string;
  event_name: string;
  startDate: string; // ISO string
  startTime: string; // ISO string
  interval: number;
  duration: number;
  No_of_times_checked: number;
  No_of_times_to_be_checked: number;
  expired: boolean;
  last_checked: string; // ISO string
};



let db: SQLite.SQLiteDatabase | null = null;

/**
 * Opens the SQLite database asynchronously (singleton pattern).
 */
export const openDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("events.db");
  }
  return db;
};

/**
 * Initializes the events table if it doesn't already exist.
 */
export const initDatabase = async (): Promise<void> => {
  try {
    const database = await openDB();
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS events (
        event_id TEXT PRIMARY KEY,
        event_name TEXT,
        startDate TEXT,
        startTime TEXT,
        interval INTEGER,
        duration INTEGER,
        No_of_times_checked INTEGER,
        No_of_times_to_be_checked INTEGER,
        expired INTEGER,
        last_checked TEXT
      );
    `);
    console.log("✅ Events table initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
  }
};



// Read all events
export const readEvents = async (): Promise<Event[] | { error: string }> => {
  try {
    const events = await runSql<Event>("SELECT * FROM events");
    return events;
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
}: {
  event_name: string;
  duration: string;
  interval: string;
  startTime: string;
  startDate: string;
  no_of_times_to_be_checked: string;
}) => {
  try {
    const event_id = `${event_name.replace(/\s+/g, "_")}_${Date.now()}`;
    await runSql(
      `INSERT INTO events (
        event_id, event_name, startDate, startTime, interval, duration,
        No_of_times_checked, No_of_times_to_be_checked, expired, last_checked
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        event_name,
        getTodayMidnightUTC(startDate),
        new Date(startTime).toISOString(),
        Number(interval),
        Number(duration),
        0,
        Number(no_of_times_to_be_checked),
        0,
        getTodayMidnightUTC(),
      ]
    );
    return { success: "Event created", event_id };
  } catch (error) {
    return { error: `Error creating event: ${error}` };
  }
};

// Update specific field of event
export const updateEventField = async <K extends keyof Event>(
  event_id: string,
  eventField: K,
  updatedValue: Event[K] | string | number | boolean
) => {
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

  let valueToStore: string | number = updatedValue as string | number;
  if (["interval", "duration", "No_of_times_checked", "No_of_times_to_be_checked"].includes(eventField as string))
    valueToStore = Number(updatedValue);
  if (eventField === "expired") valueToStore = updatedValue ? 1 : 0;
  if (eventField === "startDate" || eventField === "last_checked") valueToStore = getTodayMidnightUTC(String(updatedValue));
  if (eventField === "startTime") valueToStore = new Date(String(updatedValue)).toISOString();

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
export const getViableEventsToday = async (): Promise<Event[] | { error: string }> => {
  try {
    const todayISO = getTodayMidnightUTC();
    const events = await runSql<Event>(
      `
      SELECT *, CAST((julianday(?) - julianday(startDate)) AS INTEGER) AS days_since_start
      FROM events
      WHERE expired = 0 AND No_of_times_checked < No_of_times_to_be_checked
    `,
      [todayISO]
    );

    const viableEvents = events.filter(event => {
      const days_since_start = (event as any).days_since_start;
      return days_since_start >= 0 && days_since_start <= event.duration && days_since_start % event.interval === 0;
    });

    return viableEvents;
  } catch (error) {
    return { error: `Error fetching viable events: ${error}` };
  }
};

// Tick event
export const tickEvent = async (event_id: string) => {
  try {
    const todayISO = getTodayMidnightUTC();
    const eventArr = await runSql<Event>(
      `
      SELECT *, CAST((julianday(?) - julianday(startDate)) AS INTEGER) AS days_since_start
      FROM events
      WHERE event_id = ?
    `,
      [todayISO, event_id]
    );

    if (!eventArr[0]) return { failure: "Event not found" };

    const event = eventArr[0] as any;
    const { days_since_start, interval, duration, No_of_times_checked, No_of_times_to_be_checked } = event;

    if (No_of_times_checked >= No_of_times_to_be_checked) return { failure: "Event completed" };
    if (days_since_start < 0 || days_since_start > duration || days_since_start % interval !== 0)
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


