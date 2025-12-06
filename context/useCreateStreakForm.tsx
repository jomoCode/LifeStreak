import { isYYDDMMFormat } from "@/lib/generic_helpers";
import React, { createContext, useContext, useState } from "react";

export type StreakFormValues = {
  goalTitle: string;
  startDate: string; // YYYY-MM-DD
  duration: number; // days, recommended 7 or 30 (max 30)
  interval: number; // 1–7 (1 = every day, 7 = weekly)
  timesPerDay: number; // 1–24
};

type Setters =   Record<keyof StreakFormValues, (v: string) => void>;

export type StreakFormErrors = Partial<Record<keyof StreakFormValues, string>>;

export type StreakFormContextType = {
  form: StreakFormValues;
  errors: StreakFormErrors;
  setters: Setters;
  setGoalTitle: (v: string) => void;
  setStartDate: (v: string | Date) => void;
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
    duration: (v: string) => updateForm({ duration: Number(v) }),
    interval: (v: string) => updateForm({ interval: Number(v) }),
    timesPerDay: (v: string) => updateForm({ timesPerDay: Number(v) }),
  };

  // Helpers: validators

  // Field validation returns error string or undefined
  const rules = {
    goalTitle: (v: string) => {
      if (!v || !v.trim()) return "Please enter your goal before continuing.";
      if (v.trim().length > 100)
        return "Goal is too long (max 100 characters).";
      return undefined;
    },
    startDate: (v: string) => {
      if (!v || !v.trim()) return "Start date is required.";
      if (!isYYDDMMFormat(v.trim())) return "Start date must be YYYY-MM-DD.";
      // optionally: ensure not in the past — if you want that, uncomment:
      const asDate = new Date(v);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (asDate.getTime() < today.getTime()) {
        return "Start date cannot be in the past.";
      }
      return undefined;
    },
    duration: (v: number) => {
      if (typeof v !== "number" || Number.isNaN(v))
        return "Duration is required.";
      if (v < 1) return "Duration must be at least 1 day.";
      if (v > 30) return "Maximum duration is 30 days.";
      return undefined;
    },
    interval: (v: number) => {
      if (typeof v !== "number" || Number.isNaN(v))
        return "Interval is required.";
      if (v < 1 || v > 7)
        return "Interval must be between 1 (daily) and 7 (weekly).";
      return undefined;
    },
    timesPerDay: (v: number) => {
      if (typeof v !== "number" || Number.isNaN(v))
        return "Times per day is required.";
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

  const validateField = (field: keyof StreakFormValues): boolean => {
    const value = form[field];
    // Cast to any so we can pass to the correct rule
    const ruleFn = (rules as any)[field];
    if (!ruleFn) return true;
    const message = ruleFn(value as any);
    setFieldError(field, message);
    return !message;
  };

  const validateAll = (): boolean => {
    const nextErrors: StreakFormErrors = {};
    (Object.keys(form) as (keyof StreakFormValues)[]).forEach((key) => {
      const ruleFn = (rules as any)[key];
      if (!ruleFn) return;
      const maybeMsg = ruleFn(form[key] as any);
      if (maybeMsg) nextErrors[key] = maybeMsg;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // update functions automatically run validation for that field
  const updateForm = (fields: Partial<StreakFormValues>) => {
     Object.keys(fields).forEach((k) => {
      const key = k as keyof StreakFormValues;
      const ruleFn = (rules as any)[key];
      if (ruleFn) {
        const message = ruleFn((fields as any)[key]);
        setFieldError(key, message);
      }
    });

    setForm((prev) => {
      const next = { ...prev, ...fields };
      return next;
    });

    };

  const setGoalTitle = (v: string) => updateForm({ goalTitle: v });
  const setStartDate = (v: string | Date) => {
    const s = v instanceof Date ? v.toISOString().slice(0, 10) : v;
    updateForm({ startDate: s });
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
    const ok = validateAll();
    if (ok) onValid(form);
  };

  return (
    <StreakFormContext.Provider
      value={{
        form,
        errors,
        setters,
        setGoalTitle,
        setStartDate,
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
