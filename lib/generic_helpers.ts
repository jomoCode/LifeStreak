import * as SQLite from "expo-sqlite";
import { initDatabase } from "./CRUDE_sqlite";

const __DEV__ = process.env.NODE_ENV !== "production";

/**
 * Cleans a string to make it safe for file naming.
 * - Trims whitespace
 * - Replaces spaces and invalid filesystem characters with underscores
 * - Collapses multiple underscores
 */
const cleanFileName = (input: string, lowercase = false): string => {
  if (typeof input !== "string") return "";
  let cleaned = input
    .trim()
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[\/\\:*?"<>|]/g, "_") // Replace forbidden characters
    .replace(/_+/g, "_"); // Collapse multiple underscores
  return lowercase ? cleaned.toLowerCase() : cleaned;
};

/**
 * Validates that a date string is in strict UTC ISO 8601 format
 * and represents midnight (00:00:00Z).
 * Throws an error if invalid.
 *
 * @example
 * validateUTCDateString("2025-10-11T00:00:00Z", "startDate");
 */
const validateUTCDateString = (dateStr: string, fieldName = "date"): void => {
  const isoUTCMidnightRegex =
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T00:00:00Z$/;

  if (!isoUTCMidnightRegex.test(dateStr)) {
    throw new Error(
      `${fieldName} must be in UTC ISO 8601 format and set to midnight (e.g. 2025-10-11T00:00:00Z). Received: ${dateStr}`
    );
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`${fieldName} is not a valid date: ${dateStr}`);
  }
};

/**
 * Returns a date string set to midnight UTC (00:00:00Z) in ISO 8601 format.
 * Optionally accepts a date string to normalize to UTC midnight.
 *
 * @example
 * getTodayMidnightUTC(); // => "2025-11-11T00:00:00.000Z"
 */
const getTodayMidnightUTC = (date?: string): string => {
  try {
    const now = date ? new Date(date) : new Date();
    if (isNaN(now.getTime())) throw new Error("Invalid date");
    now.setUTCHours(0, 0, 0, 0);
    return now.toISOString();
  } catch (error: unknown) {
    const message = `Invalid date provided to getTodayMidnightUTC: ${date} - ${String(
      error
    )}`;
    if (__DEV__) console.error(message);
    return "Invalid date";
  }
};

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Opens the SQLite database asynchronously (singleton pattern).
 */
const openDB = async () => {
  initDatabase();

  if (!db) {
    db = await SQLite.openDatabaseAsync("events.db");
  }
  return db;
};

/**
 * Runs a SQL query and returns the results as an array of type T.
 * Uses the modern async expo-sqlite API for cleaner, promise-based handling.
 *
 * @example
 * const rows = await runSql<{ id: number; name: string }>("SELECT * FROM users");
 */
const runSql = async <T>(sql: string, params: any[] = []) => {
  if (!sql?.trim()) {
    throw new Error("Empty SQL statement");
  }

  try {
    const database = await openDB();

    // Detect query type
    const isSelect = /^\s*SELECT/i.test(sql);

    if (isSelect) {
      // SELECT queries return rows
      const results = await database.getAllAsync<T>(sql, params);
      return results;
    } else {
      // For INSERT, UPDATE, DELETE
      await database.runAsync(sql, params);
      return [];
    }
  } catch (error) {
    if (__DEV__) console.error("SQLite Query Error:", error);
    throw error;
  }
};

/**
 * convert all values to string
 */
const convert2String = (value: unknown) => (value == null ? "" : String(value));

/**
 * convert all values to number
 */
const convert2Number = (value: unknown, fallbackValue = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallbackValue;
};


/**
 * Convert time string: HH:MM to ISO time string 
 */
const convertHHMM_2IsoTimeString = (timeString: string, isoDate: string) => {
  // Time string format: "HH:MM"
  const [hourStr = "0", minuteStr = "0"] = timeString.split(":");
  if (hourStr === "0" || minuteStr === "0")
    throw new Error("Invalid time timeString: convertHHMM_2IsoTimeString");
  if (!isoDate.includes("T"))
    throw new Error("Invalid date supplied: convertHHMM_2IsoTimeString");
  const date = new Date(isoDate);
  const hour = convert2Number(hourStr, 0);
  const minute = convert2Number(minuteStr, 0);
  date.setUTCHours(hour, minute, 0, 0);
  return date.toISOString();
};

export {
  cleanFileName,
  convert2Number,
  convert2String,
  convertHHMM_2IsoTimeString,
  getTodayMidnightUTC,
  runSql,
  validateUTCDateString,
};
