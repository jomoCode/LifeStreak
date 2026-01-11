import { Task } from "@/types";

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

/*
 YYYY-MM-DD basic check (does not check for invalid dates like 2025-02-30)
*/
const isYYDDMMFormat = (v: string) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
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

/**
 * convert all values to string
 */
const convert2String = (value: unknown) => (value == null ? "" : String(value));

/**
 * convert all values to number
 */
const convert2Number = (value: unknown, errorLocation: string) => {
  const number2Convert = Number(value);
  if (Number.isFinite(number2Convert)) return number2Convert;
  else {
    throw new Error(
      `failure converting value to number: error Location: ${errorLocation}`
    );
  }
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
  const hour = convert2Number(hourStr, "hour convertHHMM_2IsoTimeString");
  const minute = convert2Number(minuteStr, "minute convertHHMM_2IsoTimeString");
  date.setUTCHours(hour, minute, 0, 0);
  return date.toISOString();
};

/*
--DATA FILTERS
--DATA FILTERS
--DATA FILTERS
*/

// Default filter



const filterByCreationDate = (data: Task[]) => {
  return [...data].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};


const filterByAlphabeticOrder = (data: Task[]) => {
  return [...data].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      sensitivity: "base",
    })
  );
};

const formatTimeTo12Hour = (time24: string) => {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = Number(hourStr);
  const minute = Number(minuteStr);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

export {
  cleanFileName,
  convert2Number,
  convert2String,
  convertHHMM_2IsoTimeString,
  filterByAlphabeticOrder,
  filterByCreationDate,
  formatTimeTo12Hour,
  getTodayMidnightUTC,
  isYYDDMMFormat,
  validateUTCDateString,
};
