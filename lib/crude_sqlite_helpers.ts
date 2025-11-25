import * as SQLite from "expo-sqlite";
import { Event } from "./CRUDE_sqlite";
import { convert2Number, convert2String } from "./generic_helpers";


let db: SQLite.SQLiteDatabase | null = null;


/**
 * Normalize a raw DB row into the `Event` shape expected by the frontend.
 * This ensures booleans, numbers and dates are in predictable formats and
 * prevents runtime crashes caused by unexpected types coming from the DB.
 */
const cleanDatabaseRow = (row: Event) => {
  const cleanedDbRow: Event & Record<string, any> = {
    event_id: convert2String(row.event_id),
    event_name: convert2String(row.event_name),

    // Date format: ISO midnight UTC) or empty string;
    // Time format: full ISO string
    startDate: row.startDate ? String(row.startDate) : "",
    startTime: row.startTime ? String(row.startTime) : "",

    interval: convert2Number(row.interval, -1),
    duration: convert2Number(row.duration, -1),
    No_of_times_checked: convert2Number(row.No_of_times_checked, 0),
    No_of_times_to_be_checked: convert2Number(row.No_of_times_to_be_checked, 0),

    // convert 0/1 or strings into boolean
    expired: Boolean(row.expired && Number(row.expired) !== 0),
    last_checked: row.last_checked ? String(row.last_checked) : "",
  };

  // Add uncleaned rows to cleanedRows
  for (const values in row) {
    if (!(values in cleanedDbRow)) cleanedDbRow[values] = cleanedDbRow[values];
  }

  return cleanedDbRow;
};


/**
 * Opens the SQLite database asynchronously (singleton pattern).
 */
type openDBType = Promise<SQLite.SQLiteDatabase>;

 const openDB = async (): openDBType => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("events.db");
  }
  return db;
};

/**
 * Initializes the events table if it doesn't already exist.
 */
const initDatabase = async () => {
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
export { cleanDatabaseRow, initDatabase, openDBType };
