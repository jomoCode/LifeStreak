const cleanFileName = (input: string) => {
  return input
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[\/\\:*?"<>|]/g, "_")
    .replace(/_+/g, "_");
};

const validateUTCDateString = (dateStr: string, fieldName?: string) => {
  // Strict pattern: YYYY-MM-DDT00:00:00Z
  const isoUTCMidnightRegex = /^\d{4}-\d{2}-\d{2}T00:00:00Z$/;
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

const getTodayMidnightUTC = (date?: string) => {
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
