import { randomUUID } from "expo-crypto";
import { Schedule, Task, TimeWindow, Weekday } from "../types";
import {
  CreateTask,
  TaskOccurrence,
  TaskOccurrenceStatus,
} from "./streakEngine";

type ValidateCreateTaskInput = Partial<CreateTask>;

export const validateCreateTaskInput = (input: ValidateCreateTaskInput) => {
  if (typeof input !== "object" || input === null) {
    throw new Error("Invalid payload");
  }

  const data = input;
  if (typeof data.name !== "string" || data.name.length === 0) {
    throw new Error("Invalid name");
  }

  if (!data.schedule) {
    throw new Error("Schedule is required");
  }

  if (!data.timeWindow) {
    throw new Error("Time window is required");
  }

  if (!isValidDate(data.startDate)) {
    throw new Error("Invalid start date");
  }

  if (data.endDate !== undefined && !isValidDate(data.endDate)) {
    throw new Error("Invalid end date");
  }

  if (
    data.totalDays !== undefined &&
    (typeof data.totalDays !== "number" || data.totalDays <= 0)
  ) {
    throw new Error("totalDays must be a positive number");
  }
};

export const toTimestamp = (value: Date | number): number => {
  const date = value instanceof Date ? value : new Date(value);
  return date.getTime();
};

export const isValidDate = (value: unknown): value is Date | number => {
  const date = value instanceof Date ? value : new Date(value as number);
  return !isNaN(date.getTime());
};

export type NormalizedCreateTaskInput = {
  name: string;
  schedule: Schedule;
  startDate: number; // timestamp
  endDate?: number; // timestamp
  totalDays?: number;
  timeWindow: TimeWindow;
};

export const normalizeCreateTaskInput = (
  input: CreateTask
): NormalizedCreateTaskInput => {
  return {
    name: input.name.trim(),
    schedule: input.schedule,
    timeWindow: input.timeWindow,
    startDate: toTimestamp(input.startDate),
    endDate: input.endDate ? toTimestamp(input.endDate) : undefined,
    totalDays: input.totalDays,
  };
};

export const id = () => {
  return randomUUID();
};

export const toDateOnlyString = (date: Date): string => {
  // Input: Date; Returns: "YYYY-MM-DD"
  return date.toISOString().split("T")[0];
};

export const weekdayFromDate = (date: Date): Weekday => {
  // Input: Date; Returns: Weekday ("monday" → "sunday")
  return date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as Weekday;
};

// occurrenceAdapter.ts

export type OccurrenceCard = {
  id: string;
  taskId: string;
  scheduledAt: Date;
  status: TaskOccurrenceStatus;
};

/**
 * Converts TaskOccurrence records into UI-friendly cards.
 * Applies the task's time window to build a full Date object.
 */

export const buildOccurrenceCards = (
  task: Task,
  occurrences: TaskOccurrence[]
): OccurrenceCard[] => {
  return occurrences.map((occ) => ({
    id: occ.id,
    taskId: occ.taskId,
    scheduledAt: new Date(`${occ.date}T${task.timeWindow.start}`),
    status: occ.status,
  }));
};

type EventStatus = "missed" | "checked" | "not ready";

export const mapOccurrenceStatus = (
  scheduledAt: Date,
  status: TaskOccurrenceStatus
): EventStatus => {
  const now = new Date();

  if (scheduledAt > now) return "not ready";
  if (status === "checked") return "checked";
  return "missed";
};
