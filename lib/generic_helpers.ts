import * as SQLite from "expo-sqlite";





const __DEV__ = process.env.NODE_ENV !== "production";

/**
 * Cleans a string to make it safe for file naming.
 * - Trims whitespace
 * - Replaces spaces and invalid filesystem characters with underscores
 * - Collapses multiple underscores
 */
export const cleanFileName = (input: string, lowercase = false): string => {
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
export const validateUTCDateString = (dateStr: string, fieldName = "date"): void => {
  const isoUTCMidnightRegex =
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T00:00:00Z$/;

  if (!isoUTCMidnightRegex.test(dateStr)) {
    throw new Error(
      `${fieldName} must be in UTC ISO 8601 format and set to midnight (e.g. 2025-10-11T00:00:00Z). Received: ${dateStr}`
    );
  }
  // Ensure it's an actual valid date
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
export const getTodayMidnightUTC = (date?: string): string => {
  try {
    const now = date ? new Date(date) : new Date();
    now.setUTCHours(0, 0, 0, 0);
    now.getTime(); // will throw error if invalid date
    return now.toISOString();
  } catch (error: unknown) {
    console.error(
      `Invalid date provided to getTodayMidnightUTC: ${date}: error: ${error}`
    );
    return 'error getting date: getTodayMidnightUTC';
  }
};

export {
  cleanFileName,
  /**
   * @getTodayMidnightUTC
   * Returns today's date set to midnight (00:00:00 UTC)
   * in ISO string format.
   */ getTodayMidnightUTC,
  /**
   * @validateUTCDateString
   * Validates that a date string is in strict UTC ISO 8601 format
   * and that the time is set to midnight (00:00:00Z). only suitable for utc dates not utctime
   * Example of valid format: "2025-10-11T00:00:00Z"
   * @param dateStr - The date string to validate
   * @param fieldName - The name of the field being validated
   * @throws Error if the date format is invalid or not set to midnight
   */ validateUTCDateString,
};
    const message = `Invalid date provided to getTodayMidnightUTC: ${date} - ${String(error)}`;
    if (__DEV__) console.error(message);
    return "Invalid date";
  }
};
