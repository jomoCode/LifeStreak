import {
  createTask,
  CreateTask,
  generateTaskOccurrences,
  TaskOccurrence,
} from "../lib/streakEngine";
import { Task } from "../types";

/*---------------------------------------------------------------------------------------------------------
---------------------------------MOCK---------------------------------------------------- */
jest.mock("../lib/helpers", () => {
  const actual = jest.requireActual("../lib/helpers");

  return {
    ...actual,
    id: jest.fn(() => "occurrence-id"),
  };
});

/*---------------------------------------------------------------------------------------------------------
---------------------------------GENEREATE OCCOURENCES TASK---------------------------------------------------- */
describe("generateTaskOccurrences", () => {
  const sampleTask: Task = {
    id: "task-1",
    name: "Test Task",
    schedule: { type: "daily" },
    startDate: new Date("2026-01-01"),
    totalDays: 3,
    timeWindow: { start: "06:00", end: "07:00" },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  test("generates daily occurrences up to totalDays", () => {
    const occurrences: TaskOccurrence[] = [];

    generateTaskOccurrences(sampleTask, (_, occurrence) => {
      occurrences.push(occurrence);
    });

    expect(occurrences).toHaveLength(3);
    expect(occurrences.map((o) => o.date)).toEqual([
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
    ]);
  });

  test("generates occurrences only on selected weekdays for custom schedule", () => {
    const task: Task = {
      ...sampleTask,
      schedule: { type: "custom", days: ["monday", "wednesday"] },
      startDate: new Date("2026-01-05"), // Monday
      totalDays: 2,
    };

    const occurrences: TaskOccurrence[] = [];

    generateTaskOccurrences(task, (_, occurrence) => {
      occurrences.push(occurrence);
    });

    expect(occurrences).toHaveLength(2);
    expect(occurrences.map((o) => o.date)).toEqual([
      "2026-01-05", // Monday
      "2026-01-07", // Wednesday
    ]);
  });

  test("emits each occurrence via callback with correct structure", () => {
    const onOccurrence = jest.fn();

    generateTaskOccurrences(sampleTask, onOccurrence);

    expect(onOccurrence).toHaveBeenCalledTimes(3);

    const [, occurrence] = onOccurrence.mock.calls[0];

    expect(occurrence).toMatchObject({
      taskId: "task-1",
      status: "unchecked",
      date: "2026-01-01",
    });
  });
});

/*---------------------------------------------------------------------------------------------------------
---------------------------------CREATE TASK---------------------------------------------------- */

describe("createTask", () => {
  const db = jest.fn();

  const input: CreateTask = {
    name: "  Morning Workout  ",
    schedule: { type: "daily" },
    startDate: new Date("2026-01-01"),
    totalDays: 5,
    timeWindow: { start: "06:00", end: "07:00" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a task and persists it via db callback", () => {
    const task = createTask(input, db);

    // returned task
    expect(task).toMatchObject({
      id: "occurrence-id",
      name: "Morning Workout", // normalized
      schedule: input.schedule,
      totalDays: 5,
      timeWindow: input.timeWindow,
      status: "active",
    });

    // timestamps
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);
    expect(task.startDate).toBeInstanceOf(Date);

    // db persistence
    expect(db).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledWith("occurrence-id", task);
  });

  test("throws if validation fails", () => {
    const badInput = {
      ...input,
      name: "",
    } as CreateTask;

    expect(() => createTask(badInput, db)).toThrow("Invalid name");
    expect(db).not.toHaveBeenCalled();
  });

  test("handles optional endDate correctly", () => {
    const task = createTask(
      {
        ...input,
        endDate: new Date("2026-01-10"),
      },
      db
    );

    expect(task.endDate).toBeInstanceOf(Date);
    expect(task.endDate?.toISOString().startsWith("2026-01-10")).toBe(true);
  });
});
