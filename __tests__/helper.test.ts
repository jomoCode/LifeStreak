import {
  normalizeCreateTaskInput,
  toDateOnlyString,
  validateCreateTaskInput,
  weekdayFromDate,
} from "../lib/helpers";
import { CreateTask } from "../lib/streakEngine";

describe("validateCreateTaskInput", () => {
  const validInput: CreateTask = {
    name: "Morning workout",
    schedule: { type: "daily" } as any,
    startDate: new Date(),
    timeWindow: { start: "06:00", end: "07:00" } as any,
  };

  it("does not throw for valid input", () => {
    expect(() => validateCreateTaskInput(validInput)).not.toThrow();
  });

  it("throws if input is not an object", () => {
    expect(() => validateCreateTaskInput(null as any)).toThrow(
      "Invalid payload"
    );
  });

  it("throws if name is missing", () => {
    expect(() =>
      validateCreateTaskInput({ ...validInput, name: undefined })
    ).toThrow("Invalid name");
  });

  it("throws if name is empty", () => {
    expect(() => validateCreateTaskInput({ ...validInput, name: "" })).toThrow(
      "Invalid name"
    );
  });

  it("throws if schedule is missing", () => {
    expect(() =>
      validateCreateTaskInput({ ...validInput, schedule: undefined })
    ).toThrow("Schedule is required");
  });

  it("throws if timeWindow is missing", () => {
    expect(() =>
      validateCreateTaskInput({ ...validInput, timeWindow: undefined })
    ).toThrow("Time window is required");
  });

  it("throws if startDate is invalid", () => {
    expect(() =>
      validateCreateTaskInput({
        ...validInput,
        startDate: "invalid-date" as any,
      })
    ).toThrow("Invalid start date");
  });

  it("throws if endDate is provided but invalid", () => {
    expect(() =>
      validateCreateTaskInput({ ...validInput, endDate: "bad-date" as any })
    ).toThrow("Invalid end date");
  });

  it("throws if totalDays is zero or negative", () => {
    expect(() =>
      validateCreateTaskInput({ ...validInput, totalDays: 0 })
    ).toThrow("totalDays must be a positive number");

    expect(() =>
      validateCreateTaskInput({ ...validInput, totalDays: -5 })
    ).toThrow("totalDays must be a positive number");
  });

  it("does not throw if totalDays is a positive number", () => {
    expect(() =>
      validateCreateTaskInput({ ...validInput, totalDays: 30 })
    ).not.toThrow();
  });
});

describe("normalizeCreateTaskInput", () => {
  const baseInput: CreateTask = {
    name: "  Morning workout  ",
    schedule: { type: "daily" } as any,
    startDate: new Date("2026-01-01T06:00:00Z"),
    endDate: new Date("2026-01-10T06:00:00Z"),
    totalDays: 10,
    timeWindow: { start: "06:00", end: "07:00" } as any,
  };

  it("trims the name", () => {
    const normalized = normalizeCreateTaskInput(baseInput);
    expect(normalized.name).toBe("Morning workout");
  });

  it("converts startDate to timestamp", () => {
    const normalized = normalizeCreateTaskInput(baseInput);
    expect(typeof normalized.startDate).toBe("number");
    expect(normalized.startDate).toBe(new Date(baseInput.startDate).getTime());
  });

  it("converts endDate to timestamp if provided", () => {
    const normalized = normalizeCreateTaskInput(baseInput);
    expect(typeof normalized.endDate).toBe("number");
    expect(normalized.endDate).toBe(new Date(baseInput.endDate!).getTime());
  });

  it("keeps endDate undefined if not provided", () => {
    const { endDate, ...withoutEndDate } = baseInput;
    const normalized = normalizeCreateTaskInput(withoutEndDate as CreateTask);
    expect(normalized.endDate).toBeUndefined();
  });

  it("passes schedule, totalDays, and timeWindow unchanged", () => {
    const normalized = normalizeCreateTaskInput(baseInput);
    expect(normalized.schedule).toBe(baseInput.schedule);
    expect(normalized.totalDays).toBe(baseInput.totalDays);
    expect(normalized.timeWindow).toBe(baseInput.timeWindow);
  });
});

describe("toDateOnlyString", () => {
  test("returns date in YYYY-MM-DD format", () => {
    const date = new Date("2026-01-10T15:30:00Z");
    const result = toDateOnlyString(date);
    expect(result).toBe("2026-01-10");
  });

  test("ignores time portion of the date", () => {
    const date = new Date("2026-01-10T23:59:59Z");
    const result = toDateOnlyString(date);
    expect(result).toBe("2026-01-10");
  });
});

describe("weekdayFromDate", () => {
  test("returns correct weekday in lowercase", () => {
    const date = new Date("2026-01-12"); // Monday
    const result = weekdayFromDate(date);
    expect(result).toBe("monday");
  });

  test("returns correct weekday for another date", () => {
    const date = new Date("2026-01-17"); // Saturday
    const result = weekdayFromDate(date);
    expect(result).toBe("saturday");
  });
});
