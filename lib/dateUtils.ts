import type { DayName } from "@/data/mealPlan";

const JS_DAY_TO_NAME: Record<number, DayName> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/** ISO 8601 week number (Monday-based weeks, Thursday determines the year). */
export function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7; // convert Sunday from 0 → 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // nearest Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/** Returns today's DayName, or null on Sunday (not in the plan). */
export function getTodayDayName(): DayName | null {
  return JS_DAY_TO_NAME[new Date().getDay()] ?? null;
}

/** Odd ISO weeks → Week 1, even → Week 2. */
export function getCurrentMealWeek(): number {
  const weekNum = getISOWeekNumber(new Date());
  return weekNum % 2 === 1 ? 1 : 2;
}
