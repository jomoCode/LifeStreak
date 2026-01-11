import {
  insertOccurrenceAsync,
  insertTaskAsync,
} from "../lib/database/databaseHandlers";
import {
  getDBAsync,
  initializeDatabaseAsync,
} from "../lib/database/initializeDb";
import { TaskOccurrence } from "../lib/streakEngine";
import { Task } from "../types";

jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(async () => {
    return {
      execAsync: jest.fn(async (sql: string) => {
        console.log("mock execAsync called:", sql);
      }),
      withTransactionAsync: jest.fn(async (task: () => Promise<void>) => {
        await task();
      }),
      runAsync: jest.fn(async (stmt: string, params?: any[]) => {
        console.log("mock runAsync called:", stmt, params);
      }),
    };
  }),
}));

describe("Database handlers", () => {
  let db: any;

  beforeEach(async () => {
    db = await getDBAsync(); // now db is our mock object
    await initializeDatabaseAsync(db); // works with mocked methods
  });

  test("insertTask calls runAsync with correct SQL and params", async () => {
    const task: Task = {
      id: "test-task-1",
      name: "Test Task",
      schedule: { type: "daily" },
      startDate: new Date(),
      endDate: undefined,
      totalDays: 5,
      timeWindow: { start: "08:00", end: "09:00" },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await insertTaskAsync(db, task);

    expect(db.runAsync).toHaveBeenCalled();
    const calledWithParams = (db.runAsync as jest.Mock).mock.calls[0][1];
    expect(calledWithParams[0]).toBe(task.id);
  });

  test("insertOccurrenceAsync calls runAsync with correct SQL and params", async () => {
    const occurrence: TaskOccurrence = {
      id: "occ-1",
      taskId: "test-task-1",
      date: "2026-01-01",
      status: "unchecked",
    };

    await insertOccurrenceAsync(db, occurrence);

    expect(db.runAsync).toHaveBeenCalled();
    const calledWithParams = (db.runAsync as jest.Mock).mock.calls[0][1];
    expect(calledWithParams[0]).toBe(occurrence.id);
  });
});
