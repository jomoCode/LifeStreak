// CRUD_sqlite.ts
import * as SQLite from "expo-sqlite";
import { getTodayMidnightUTC, runSql } from "./generic_helpers";

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

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Opens the SQLite database asynchronously (singleton pattern).
 */
type openDBType = Promise<SQLite.SQLiteDatabase>;

export const openDB = async (): openDBType => {
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

// ------------------- Helpers -------------------
const safeNumber = (v: any, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const safeString = (v: any) => (v == null ? "" : String(v));

/**
 * Normalize a raw DB row into the `Event` shape expected by the frontend.
 * This ensures booleans, numbers and dates are in predictable formats and
 * prevents runtime crashes caused by unexpected types coming from the DB.
 */
const normalizeRow = (row: any): Event & Record<string, any> => {
  // keep any extra fields that queries might add (e.g. days_since_start)
  const normalized: Event & Record<string, any> = {
    event_id: safeString(row.event_id),
    event_name: safeString(row.event_name),

    // store startDate as provided (prefer ISO midnight UTC) or empty string
    startDate: row.startDate ? String(row.startDate) : "",

    // startTime should be a full ISO string. If DB only stored a time fragment
    // or an invalid value, keep it as string so UI can guard against invalid dates.
    startTime: row.startTime ? String(row.startTime) : "",

    interval: safeNumber(row.interval, 1),
    duration: safeNumber(row.duration, 1),
    No_of_times_checked: safeNumber(row.No_of_times_checked, 0),
    No_of_times_to_be_checked: safeNumber(row.No_of_times_to_be_checked, 0),

    // convert 0/1 or strings into boolean
    expired: Boolean(row.expired && Number(row.expired) !== 0),

    last_checked: row.last_checked ? String(row.last_checked) : "",
  };

  // preserve computed fields from queries (e.g. days_since_start)
  for (const k in row) {
    if (!(k in normalized)) normalized[k] = row[k];
  }

  return normalized;
};

// ------------------- CRUD -------------------
// Read all events
export const readEvents = async ()  => {
  try {
    const rows = await runSql("SELECT * FROM events");]

    if (!Array.isArray(rows)) return [];

    const normalizedEventsArray = rows.map((r) => normalizeRow(r));

    return normalized;
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
  startTime: string; // either a time like "08:00" or a full ISO
  startDate: string; // date in YYYY-MM-DD or ISO
  no_of_times_to_be_checked: string;
}) => {
  try {
    const event_id = `${event_name.replace(/\s+/g, "_")}_${Date.now()}`;

    // normalize startDate into midnight UTC ISO using helper (defensive)
    const startDateISO = getTodayMidnightUTC(startDate);

    // Normalize startTime: if the provided startTime already looks like an ISO
    // keep it; otherwise combine with startDateISO and produce a UTC ISO string.
    let startTimeISO = "";
    if (typeof startTime === "string" && startTime.includes("T")) {
      // assume it's already an ISO
      startTimeISO = new Date(startTime).toISOString();
    } else if (typeof startTime === "string") {
      // expected format like "08:00" or "8:00"
      const [hourStr = "0", minuteStr = "0"] = startTime.split(":");
      const dt = new Date(startDateISO);
      const hour = safeNumber(hourStr, 0);
      const minute = safeNumber(minuteStr, 0);
      dt.setUTCHours(hour, minute, 0, 0);
      startTimeISO = dt.toISOString();
    } else {
      // fallback: use startDate midnight
      startTimeISO = startDateISO;
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
    // Support boolean, numeric strings, and numbers
    const val = updatedValue as any;
    const bool = typeof val === "boolean" ? val : Number(val) !== 0;
    valueToStore = bool ? 1 : 0;
  }

  if (eventField === "startDate" || eventField === "last_checked")
    valueToStore = getTodayMidnightUTC(String(updatedValue));

  if (eventField === "startTime") {
    // Accept either an ISO or a time string like "08:00"
    const s = String(updatedValue);
    if (s.includes("T")) valueToStore = new Date(s).toISOString();
    else {
      // combine with current stored startDate for this event isn't available here,
      // so assume updatedValue is an ISO or time string where we just convert to ISO
      const dt = new Date();
      const [h = "0", m = "0"] = s.split(":");
      dt.setUTCHours(Number(h), Number(m), 0, 0);
      valueToStore = dt.toISOString();
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
export const getViableEventsToday = async (): Promise<Event[] | { error: string }> => {
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
      .map((r) => normalizeRow(r))
      .filter((event) => {
        const days_since_start = safeNumber((event as any).days_since_start, -9999);
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

    const event = normalizeRow(row) as any;
    const {
      days_since_start,
      interval,
      duration,
      No_of_times_checked,
      No_of_times_to_be_checked,
    } = event;

    if (No_of_times_checked >= No_of_times_to_be_checked) return { failure: "Event completed" };
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
