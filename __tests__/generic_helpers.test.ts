import { filterByCreationDate, filterByAlphabeticOrder } from "@/lib/generic_helpers";
import { Task } from "@/types";

const baseTask = {
  id: "id",
  schedule: { type: "daily" as const },
  startDate: new Date(),
  timeWindow: { start: "08:00", end: "09:00" },
  status: "active" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("filterByCreationDate", () => {
  it("sorts tasks by createdAt descending (newest first)", () => {
    const olderTask: Task = {
      ...baseTask,
      id: "1",
      name: "Older",
      createdAt: new Date("2023-01-01"),
    };

    const newerTask: Task = {
      ...baseTask,
      id: "2",
      name: "Newer",
      createdAt: new Date("2024-01-01"),
    };

    const result = filterByCreationDate([olderTask, newerTask]);

    expect(result[0].name).toBe("Newer");
    expect(result[1].name).toBe("Older");
  });

  it("does not mutate the original array", () => {
    const taskA: Task = {
      ...baseTask,
      id: "1",
      name: "A",
      createdAt: new Date("2023-01-01"),
    };

    const taskB: Task = {
      ...baseTask,
      id: "2",
      name: "B",
      createdAt: new Date("2024-01-01"),
    };

    const original = [taskA, taskB];
    const copy = [...original];

    filterByCreationDate(original);

    expect(original).toEqual(copy);
  });
});

describe("filterByAlphabeticOrder", () => {
  it("sorts tasks alphabetically by name (case-insensitive)", () => {
    const taskA: Task = { ...baseTask, id: "1", name: "banana" };
    const taskB: Task = { ...baseTask, id: "2", name: "Apple" };
    const taskC: Task = { ...baseTask, id: "3", name: "cherry" };

    const result = filterByAlphabeticOrder([taskA, taskB, taskC]);

    expect(result.map(t => t.name)).toEqual([
      "Apple",
      "banana",
      "cherry",
    ]);
  });

  it("does not mutate the original array", () => {
    const taskA: Task = { ...baseTask, id: "1", name: "B" };
    const taskB: Task = { ...baseTask, id: "2", name: "A" };

    const original = [taskA, taskB];
    const copy = [...original];

    filterByAlphabeticOrder(original);

    expect(original).toEqual(copy);
  });
});
