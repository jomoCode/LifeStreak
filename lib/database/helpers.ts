import { initDBAsync } from "@/lib/database/initializeDb";
import { checkOccurrence, uncheckOccurrence } from "@/lib/database/databaseHandlers";

/**
 * Marks a specific occurrence as checked.
 *
 * This helper:
 * - Opens the database
 * - Updates the occurrence status
 * - Does not return data
 *
 * UI refresh should be handled by the caller
 */
export const markOccurrenceChecked = async (
  taskId: string,
  date: string
): Promise<void> => {
  const db = await initDBAsync();

  await checkOccurrence(db, taskId, date);
};



export const markOccurrenceUnchecked = async (
  taskId: string,
  date: string
): Promise<void> => {
  const db = await initDBAsync();

  await uncheckOccurrence(db, taskId, date);
};
