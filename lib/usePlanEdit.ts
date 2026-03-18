import { useState, useEffect } from "react";
import type { DayPlan } from "@/data/mealPlan";
import { useAuth } from "@/lib/AuthProvider";

const STORAGE_KEY = "meal-plan-edits";

type EditsMap = Record<string, DayPlan>;

function loadLocalEdits(): EditsMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as EditsMap;
  } catch {
    return {};
  }
}

function saveLocalEdit(key: string, updated: DayPlan) {
  const edits = loadLocalEdits();
  edits[key] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

export function usePlanEdit(basePlan: DayPlan, basePlanId: string) {
  const { user, supabase } = useAuth();
  const key = `${basePlan.week}-${basePlan.day}`;

  // Start with basePlan to avoid hydration mismatch.
  const [plan, setPlan] = useState<DayPlan>(basePlan);

  // After mount, load from Supabase (fall back to localStorage)
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    supabase
      .from("user_meal_plan_edits")
      .select("meals, reminders")
      .eq("user_id", user.id)
      .eq("day", basePlan.day)
      .eq("week", basePlan.week)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (data && !error) {
          setPlan({
            ...basePlan,
            meals: data.meals,
            reminders: data.reminders ?? undefined,
          });
        } else if (error) {
          // Offline fallback: try localStorage
          const stored = loadLocalEdits()[key];
          if (stored) setPlan(stored);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, key, basePlan, supabase]);

  function save(updated: DayPlan) {
    // Optimistic local state
    setPlan(updated);

    // Write-through to localStorage (offline fallback)
    saveLocalEdit(key, updated);

    // Async upsert to Supabase
    if (user) {
      supabase
        .from("user_meal_plan_edits")
        .upsert(
          {
            user_id: user.id,
            base_plan_id: basePlanId,
            day: basePlan.day,
            week: basePlan.week,
            meals: updated.meals,
            reminders: updated.reminders ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,day,week" }
        )
        .then(({ error }) => {
          if (error) console.error("Failed to sync edit:", error.message);
        });
    }
  }

  return { plan, save };
}
