import { isYYDDMMFormat } from "@/lib/generic_helpers";
import React, { createContext, useContext, useState } from "react";

export type StreakFormValues = {
  goalTitle: string;
  startDate: string;       // YYYY-MM-DD
  startTime: string;       // HH:MM (24-hr)
  duration: number;        // days
  interval: number;        // 1–7
  timesPerDay: number;     // 1–24
};

type Setters = Record<keyof StreakFormValues, (v: string) => void>;

export type StreakFormErrors = Partial<Record<keyof StreakFormValues, string>>;

export type StreakFormContextType = {
  form: StreakFormValues;
  errors: StreakFormErrors;
  setters: Setters;
  setGoalTitle: (v: string) => void;
  setStartDate: (v: string | Date) => void;
  setStartTime: (v: string | Date) => void;
  setDuration: (v: number) => void;
  setInterval: (v: number) => void;
  setTimesPerDay: (v: number) => void;
  updateForm: (fields: Partial<StreakFormValues>) => void;
  resetForm: () => void;
  validateField: (field: keyof StreakFormValues) => boolean;
  validateAll: () => boolean;
  clearErrors: () => void;
  submit: (onValid: (values: StreakFormValues) => void) => void;
};

type StreakFormProviderProps = {
  children: React.ReactNode;
};

const StreakFormContext = createContext<StreakFormContextType | null>(null);

const DEFAULT_FORM: StreakFormValues = {
  goalTitle: "",
  startDate: "",
  startTime: "",       // ⏰ NEW
  duration: 7,
  interval: 1,
  timesPerDay: 1,
};

export const StreakFormProvider = ({ children }: StreakFormProviderProps) => {
  const [form, setForm] = useState<StreakFormValues>({ ...DEFAULT_FORM });
  const [errors, setErrors] = useState<StreakFormErrors>({});

  const setters = {
    goalTitle: (v: string) => updateForm({ goalTitle: v }),
    startDate: (v: string) => updateForm({ startDate: v }),
    startTime: (v: string) => updateForm({ startTime: v }),
    duration: (v: string) => updateForm({ duration: Number(v) }),
    interval: (v: string) => updateForm({ interval: Number(v) }),
    timesPerDay: (v: string) => updateForm({ timesPerDay: Number(v) }),
  };

  // -------------------------
  // VALIDATION RULES
  // -------------------------
  const rules = {
    goalTitle: (v: string) => {
      if (!v.trim()) return "Please enter your goal before continuing.";
      if (v.trim().length > 100)
        return "Goal is too long (max 100 characters).";
      return undefined;
    },
    startDate: (v: string) => {
      if (!v.trim()) return "Start date is required.";
      if (!isYYDDMMFormat(v.trim())) return "Start date must be YYYY-MM-DD.";

      const asDate = new Date(v);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (asDate.getTime() < today.getTime()) {
        return "Start date cannot be in the past.";
      }
      return undefined;
    },

    // ⏰ NEW — validate HH:MM
    startTime: (v: string) => {
      if (!v.trim()) return "Start time is required.";
      if (!/^\d{2}:\d{2}$/.test(v)) return "Start time must be HH:MM.";

      const [hh, mm] = v.split(":").map(Number);
      if (hh < 0 || hh > 23 || mm < 0 || mm > 59)
        return "Invalid time format.";

      return undefined;
    },

    duration: (v: number) => {
      if (!v) return "Duration is required.";
      if (v < 1) return "Duration must be at least 1 day.";
      if (v > 30) return "Maximum duration is 30 days.";
      return undefined;
    },
    interval: (v: number) => {
      if (!v) return "Interval is required.";
      if (v < 1 || v > 7)
        return "Interval must be between 1 (daily) and 7 (weekly).";
      return undefined;
    },
    timesPerDay: (v: number) => {
      if (!v) return "Times per day is required.";
      if (v < 1) return "Times per day must be at least 1.";
      if (v > 24) return "Times per day cannot exceed 24.";
      return undefined;
    },
  };

  const setFieldError = (field: keyof StreakFormValues, message?: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });

  const validateField = (field: keyof StreakFormValues) => {
    const rule = (rules as any)[field];
    if (!rule) return true;

    const msg = rule(form[field] as any);
    setFieldError(field, msg);
    return !msg;
  };

  const validateAll = (): boolean => {
    const next: StreakFormErrors = {};
    for (const key of Object.keys(form) as (keyof StreakFormValues)[]) {
      const rule = (rules as any)[key];
      if (rule) {
        const msg = rule(form[key] as any);
        if (msg) next[key] = msg;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // -------------------------
  // UPDATE FORM + VALIDATE
  // -------------------------
  const updateForm = (fields: Partial<StreakFormValues>) => {
    Object.keys(fields).forEach((k) => {
      const key = k as keyof StreakFormValues;
      const rule = (rules as any)[key];
      if (rule) {
        const msg = rule((fields as any)[key]);
        setFieldError(key, msg);
      }
    });

    setForm((prev) => ({ ...prev, ...fields }));
  };

  const setGoalTitle = (v: string) => updateForm({ goalTitle: v });

  const setStartDate = (v: string | Date) => {
    const s = v instanceof Date ? v.toISOString().slice(0, 10) : v;
    updateForm({ startDate: s });
  };

  const setStartTime = (v: string | Date) => {
    let time: string;
    if (v instanceof Date) {
      const hh = String(v.getHours()).padStart(2, "0");
      const mm = String(v.getMinutes()).padStart(2, "0");
      time = `${hh}:${mm}`;
    } else {
      time = v;
    }
    updateForm({ startTime: time });
  };

  const setDuration = (v: number) => updateForm({ duration: v });
  const setInterval = (v: number) => updateForm({ interval: v });
  const setTimesPerDay = (v: number) => updateForm({ timesPerDay: v });

  const clearErrors = () => setErrors({});
  const resetForm = () => {
    setForm({ ...DEFAULT_FORM });
    clearErrors();
  };

  const submit = (onValid: (values: StreakFormValues) => void) => {
    if (validateAll()) onValid(form);
  };

  return (
    <StreakFormContext.Provider
      value={{
        form,
        errors,
        setters,
        setGoalTitle,
        setStartDate,
        setStartTime,
        setDuration,
        setInterval,
        setTimesPerDay,
        updateForm,
        resetForm,
        validateField,
        validateAll,
        clearErrors,
        submit,
      }}
    >
      {children}
    </StreakFormContext.Provider>
  );
};

export const useStreakForm = () => {
  const ctx = useContext(StreakFormContext);
  if (!ctx)
    throw new Error("useStreakForm must be used inside StreakFormProvider");
  return ctx;
};
