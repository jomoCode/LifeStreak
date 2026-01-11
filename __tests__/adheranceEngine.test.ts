/**
 * Mock helpers so tests are deterministic and isolated
 */
jest.mock("@/lib/helpers", () => ({
  id: jest.fn(),
  validateCreateTaskInput: jest.fn(),
  normalizeCreateTaskInput: jest.fn((input) => input),
  toDateOnlyString: (date: Date) =>
    date.toISOString().split("T")[0],
  weekdayFromDate: (date: Date) =>
    ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][date.getDay()],
}));



import { id, validateCreateTaskInput } from "@/lib/helpers";
import { createTask, generateTaskOccurrences } from "@/lib/streakEngine";
import { Schedule, Task } from "@/types";






describe("createTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a valid task and calls db callback", () => {
    (id as jest.Mock).mockReturnValue("task-1");

    const input = {
      name: "Read",
      schedule: { type: "daily" } as Schedule,
      startDate: new Date("2026-01-01"),
      totalDays: 5,
      timeWindow: { start: "08:00", end: "09:00" },
    };

    const dbCallback = jest.fn();

    const task = createTask(input, dbCallback);

    // validation must run
    expect(validateCreateTaskInput).toHaveBeenCalledWith(input);

    // task shape
    expect(task).toMatchObject({
      id: "task-1",
      name: "Read",
      status: "active",
      totalDays: 5,
    });

    // db persistence callback
    expect(dbCallback).toHaveBeenCalledWith("task-1", task);
  });

  it("sets endDate when provided", () => {
    (id as jest.Mock).mockReturnValue("task-2");

    const input = {
      name: "Workout",
      schedule: { type: "daily" } as Schedule,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-10"),
      timeWindow: { start: "06:00", end: "07:00" },
    };

    const task = createTask(input, jest.fn());

    expect(task.endDate).toBeInstanceOf(Date);
  });
});

describe("generateTaskOccurrences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (id as jest.Mock).mockImplementation(() => `occ-${Math.random()}`);
  });

  it("generates daily occurrences up to totalDays", () => {
    const task: Task = {
      id: "task-1",
      name: "Meditate",
      schedule: { type: "daily" },
      startDate: new Date("2026-01-01"),
      totalDays: 3,
      timeWindow: { start: "07:00", end: "07:15" },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const occurrences: any[] = [];

    generateTaskOccurrences(task, (_, occurrence) => {
      occurrences.push(occurrence);
    });

    expect(occurrences).toHaveLength(3);
    expect(occurrences[0].date).toBe("2026-01-01");
    expect(occurrences[1].date).toBe("2026-01-02");
    expect(occurrences[2].date).toBe("2026-01-03");
  });

  it("respects custom weekday schedules", () => {
    const task: Task = {
      id: "task-2",
      name: "Gym",
      schedule: {
        type: "custom",
        days: ["monday", "wednesday", "friday"],
      },
      startDate: new Date("2026-01-05"), // Monday
      totalDays: 3,
      timeWindow: { start: "18:00", end: "19:00" },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const occurrences: any[] = [];

    generateTaskOccurrences(task, (_, occurrence) => {
      occurrences.push(occurrence);
    });

    // Mon, Wed, Fri
    expect(occurrences.map((o) => o.date)).toEqual([
      "2026-01-05",
      "2026-01-07",
      "2026-01-09",
    ]);
  });

  it("marks occurrences as unchecked initially", () => {
    const task: Task = {
      id: "task-3",
      name: "Journal",
      schedule: { type: "daily" },
      startDate: new Date("2026-01-01"),
      totalDays: 1,
      timeWindow: { start: "21:00", end: "21:10" },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let occurrence: any;

    generateTaskOccurrences(task, (_, o) => {
      occurrence = o;
    });

    expect(occurrence.status).toBe("unchecked");
    expect(occurrence.checkedAt).toBeUndefined();
  });
});
