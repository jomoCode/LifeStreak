
import { SQLiteDatabase as SQLiteDB } from "expo-sqlite";
import { TaskOccurrence } from "../streakEngine";
import { Task } from "@/types";

export type InsertTask = (db: SQLiteDB, task: Task) => Promise<void>;

export const insertTaskAsync: InsertTask = async (db, task) => {
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

type InsertOccurrence = (
  db: SQLiteDB,
  occurrence: TaskOccurrence
) => Promise<void>;

export const insertOccurrenceAsync: InsertOccurrence = async (
  db,
  occurrence
) => {
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

type CheckOccurrence = (
  db: SQLiteDB,
  taskId: string,
  date: string
) => Promise<void>;

export const checkOccurrence: CheckOccurrence = async (db, taskId, date) => {
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
  db: SQLiteDB,
  taskId: string,
  date: string
): Promise<void> => {
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
