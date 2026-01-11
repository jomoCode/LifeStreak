import { Task } from "@/types";
import { TaskOccurrence } from "../streakEngine";
import { getDBAsync } from "./initializeDb";

export type InsertTask = (task: Task) => Promise<void>;

export const insertTaskAsync: InsertTask = async (task) => {
  const db = await getDBAsync();
  const stmt = `
    INSERT INTO tasks (
      id,
      name,
      schedule_type,
      schedule_days,
      start_date,
      end_date,
      total_days,
      time_start,
      time_end,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await db.runAsync(stmt, [
    task.id,
    task.name,
    task.schedule.type,
    task.schedule.type === "custom" ? JSON.stringify(task.schedule.days) : null,
    task.startDate.toISOString().split("T")[0],
    task.endDate?.toISOString().split("T")[0] ?? null,
    task.totalDays ?? 0,
    task.timeWindow.start,
    task.timeWindow.end,
    task.status,
    task.createdAt.getTime(),
    task.updatedAt.getTime(),
  ]);
};

/**---------------------------------------------------------------------------------------------------------------------
 * --------------------------------INSERT OCCOURRENCE--------------------------------------------------------------------------
 */

type InsertOccurrence = (occurrence: TaskOccurrence) => Promise<void>;

export const insertOccurrenceAsync: InsertOccurrence = async (occurrence) => {
  const db = await getDBAsync();

  const stmt = `
    INSERT INTO task_occurrences (
      id,
      task_id,
      date,
      status,
      checked_at,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  await db.runAsync(stmt, [
    occurrence.id,
    occurrence.taskId,
    occurrence.date,
    occurrence.status,
    occurrence.checkedAt ?? null,
    Date.now(),
  ]);
};

/**---------------------------------------------------------------------------------------------------------------------
 * --------------------------------CHECK OCCOURRENCE--------------------------------------------------------------------------
 */

type CheckOccurrence = (taskId: string, date: string) => Promise<void>;

export const checkOccurrence: CheckOccurrence = async (taskId, date) => {
  const db = await getDBAsync();
  const stmt = `
    UPDATE task_occurrences
    SET status = 'checked',
        checked_at = ?
    WHERE task_id = ?
      AND date = ?
  `;

  await db.runAsync(stmt, [Date.now(), taskId, date]);
};
/**---------------------------------------------------------------------------------------------------------------------
 * --------------------------------CHECK OCCOURRENCE--------------------------------------------------------------------------
 */

export const uncheckOccurrence = async (
  taskId: string,
  date: string
): Promise<void> => {
  const db = await getDBAsync();
  const stmt = `
    UPDATE task_occurrences
    SET status = 'unchecked',
        checked_at = NULL
    WHERE task_id = ?
      AND date = ?
  `;

  await db.runAsync(stmt, [taskId, date]);
};

/**
 * 
 * const task = createTask(input, (id, task) => {
  insertTask(db, task);
});

generateTaskOccurrences(task, (_, occurrence) => {
  insertOccurrence(db, occurrence);
});

 * 
 * 
 */
/* ----------------------------------------------------------------------------------------
-------------------------------READ TASKS----------------------------------------*/

export const readTasksAsync = async (): Promise<Task[]> => {
  const db = await getDBAsync();
  const stmt = `
    SELECT
      id,
      name,
      schedule_type,
      schedule_days,
      start_date,
      end_date,
      total_days,
      time_start,
      time_end,
      status,
      created_at,
      updated_at
    FROM tasks
    ORDER BY created_at DESC
  `;

  const result = await db.getAllAsync<any>(stmt);

  if (result.length <= 0) {
    console.log("No tasks found in database");
    return [];
  }
  return result.map((row) => ({
    id: row.id,
    name: row.name,
    schedule:
      row.schedule_type === "custom"
        ? {
            type: "custom",
            days: JSON.parse(row.schedule_days),
          }
        : { type: "daily" },

    startDate: new Date(row.start_date),
    endDate: row.end_date ? new Date(row.end_date) : undefined,
    totalDays: row.total_days || undefined,

    timeWindow: {
      start: row.time_start,
      end: row.time_end,
    },

    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
};

/* ----------------------------------------------------------------------------------------
--------------------------------READ OCCURRENCES-------------------------------------------
*/

/**
 * Reads all occurrences for a specific task.
 *
 * This function is intentionally simple:
 * - It does not infer "missed" or "checked"
 * - It does not modify status
 * - It only returns what exists in the database
 *
 * Any higher-level logic (UI status, streaks, summaries)
 * should be derived outside this layer.
 */
export const readOccurrencesByTaskAsync = async (
  taskId: string
): Promise<TaskOccurrence[]> => {
  const db = await getDBAsync();
  const stmt = `
    SELECT
      id,
      task_id,
      date,
      status,
      checked_at
    FROM task_occurrences
    WHERE task_id = ?
    ORDER BY date ASC
  `;

  // Fetch raw rows from SQLite
  const result = await db.getAllAsync<any>(stmt, [taskId]);

  // Normalize rows into TaskOccurrence objects
  return result.map((row) => ({
    id: row.id,
    taskId: row.task_id,
    date: row.date, // YYYY-MM-DD, stored as-is
    status: row.status,
    checkedAt: row.checked_at ?? undefined,
  }));
};
