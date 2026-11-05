import { useCallback, useEffect, useState } from "react";
import { mealPlan, type DayName, type DayPlan } from "@/data/mealPlan";
import { useAuth } from "@/lib/AuthProvider";

const DAY_ORDER: Record<DayName, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
};

interface BasePlanRow {
  id: string;
  day: DayName;
  week: number;
  meals: DayPlan["meals"];
  reminders: DayPlan["reminders"] | null;
}

export function dayKey(plan: Pick<DayPlan, "day" | "week">): string {
  return `${plan.week}-${plan.day}`;
}

/**
 * The household's shared meal plan (base_meal_plans). Everyone reads the same
 * rows; editors (see supabase/shared-household-plan.sql) can change them.
 * Falls back to the bundled plan if the database can't be reached.
 */
export function useMealPlan() {
  const { supabase } = useAuth();
  const [days, setDays] = useState<DayPlan[]>(mealPlan);
  const [rowIds, setRowIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("base_meal_plans")
      .select("id, day, week, meals, reminders")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (data && data.length > 0 && !error) {
          const rows = (data as BasePlanRow[]).sort(
            (a, b) => a.week - b.week || DAY_ORDER[a.day] - DAY_ORDER[b.day]
          );
          setDays(
            rows.map((row) => ({
              day: row.day,
              week: row.week,
              meals: row.meals,
              reminders: row.reminders ?? undefined,
            }))
          );
          setRowIds(Object.fromEntries(rows.map((row) => [dayKey(row), row.id])));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [supabase, reloadKey]);

  // Pick up changes someone else made while this tab was in the background.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") setReloadKey((k) => k + 1);
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  /** Saves one day to the shared plan. Returns an error message, or null on success. */
  const saveDay = useCallback(
    async (updated: DayPlan): Promise<string | null> => {
      const id = rowIds[dayKey(updated)];
      if (!id) return "Can't reach the meal plan database right now.";

      const { data, error } = await supabase
        .from("base_meal_plans")
        .update({ meals: updated.meals, reminders: updated.reminders ?? null })
        .eq("id", id)
        .select("id");

      if (error) return `Couldn't save: ${error.message}`;
      // Row-level security turns a forbidden update into "0 rows changed".
      if (!data || data.length === 0) return "Your account isn't allowed to edit the plan.";

      setDays((current) =>
        current.map((d) => (dayKey(d) === dayKey(updated) ? updated : d))
      );
      return null;
    },
    [rowIds, supabase]
  );

  const canSaveDay = useCallback(
    (plan: Pick<DayPlan, "day" | "week">) => Boolean(rowIds[dayKey(plan)]),
    [rowIds]
  );

  return { days, loading, saveDay, canSaveDay };
}
