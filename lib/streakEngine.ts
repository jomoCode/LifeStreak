import { Schedule, Task, TimeWindow } from "../types";
import {
  id,
  normalizeCreateTaskInput,
  toDateOnlyString,
  validateCreateTaskInput,
  weekdayFromDate,
} from "./helpers";

/**
 * Task Scheduling Summary:
 *
 * Each task has a defined schedule that determines how it repeats over time:
 * - "daily": the task occurs every day starting from the startDate.
 * - "custom": the task occurs only on the specified weekdays in the `days` array.
 *
 * Each task also has a total duration (`totalDays`) which limits how many days
 * the task should be active or repeated (maximum 30 days).
 *
 * The combination of schedule and totalDays allows for flexible recurring
 * tasks, whether daily streaks or selected-day events, while respecting a
 * defined duration and time window for each occurrence.
 */

/* ------------------ CREATE TASK ------------------ */
export type CreateTask = {
  name: string;
  schedule: Schedule; // daily or custom weekdays
  startDate: Date | number;
  endDate?: Date | number;
  totalDays?: number; // maximum 30
  timeWindow: TimeWindow;
};

/**
 * Creates a new task from input data.
 * It validates and normalizes the data,
 * then returns a fully-formed Task object and persists/returns it via the provided db callback.
 *
 * @param input - Task details provided by the user (CreateTaskInput)
 * @param db - Callback to save the task, called with (id, task)
 * @returns The newly created Task object
 */

export const createTask = (
  input: CreateTask,
  db: (id: string, task: Task) => void
): Task => {
  validateCreateTaskInput(input);
  const data = normalizeCreateTaskInput(input);

  const now = Date.now();

  const task: Task = {
    id: id(),
    name: data.name,
    schedule: data.schedule,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    totalDays: data.totalDays,
    timeWindow: data.timeWindow,
    status: "active",
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };

  db(task.id, task);
  return task;
};

// --------------------------------------------------------------------------------
export type TaskOccurrenceStatus = "unchecked" | "checked" | "missed";

export type TaskOccurrence = {
  id: string;
  taskId: string;
  date: string; // "YYYY-MM-DD"
  status: TaskOccurrenceStatus;
  checkedAt?: number;
};

// HELPERS

/**
 * Generates task occurrences based on a task's schedule and duration.
 * Each generated occurrence is emitted via the provided callback.
 *
 * @param task - The parent task
 * @param onOccurrence - Callback called for each generated occurrence
 */
export const generateTaskOccurrences = (
  task: Task,
  onOccurrence: (id: string, occurrence: TaskOccurrence) => void
): void => {
  // Input: Task; Returns: callback -> ;
  const start = new Date(task.startDate);
  //if there's no task.total days, it means task is malformed. it should throw an error.
  // it should have a validator layer to validates its inputs
  const totalDays = task.totalDays ?? 0;

  let generatedCount = 0;
  let cursor = new Date(start);

  while (generatedCount < totalDays) {
    console.log("what is my cursor", cursor);
    const weekday = weekdayFromDate(cursor);

    const shouldOccur =
      task.schedule.type === "daily" ||
      (task.schedule.type === "custom" && task.schedule.days.includes(weekday));

    if (shouldOccur) {
      const occurrence: TaskOccurrence = {
        id: id(),
        taskId: task.id,
        date: toDateOnlyString(cursor),
        status: "unchecked",
      };

      onOccurrence(occurrence.id, occurrence);
      generatedCount++;
    }

    // move to next calendar day
    cursor.setDate(cursor.getDate() + 1);
  }
};
