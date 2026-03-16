import { useState, useEffect } from "react";
import type { DayPlan } from "@/data/mealPlan";

const STORAGE_KEY = "meal-plan-edits";

type EditsMap = Record<string, DayPlan>;

function loadEdits(): EditsMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as EditsMap;
  } catch {
    return {};
  }
}

export function usePlanEdit(basePlan: DayPlan) {
  const key = `${basePlan.week}-${basePlan.day}`;

  // Start with basePlan so server HTML and initial client render match (no hydration mismatch).
  // After mount, overwrite with any stored edit.
  const [plan, setPlan] = useState<DayPlan>(basePlan);

  useEffect(() => {
    const stored = loadEdits()[key];
    if (stored) setPlan(stored);
  }, [key]);

  function save(updated: DayPlan) {
    setPlan(updated);
    const edits = loadEdits();
    edits[key] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
  }

  return { plan, save };
}
