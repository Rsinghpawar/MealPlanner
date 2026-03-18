"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import WeekToggle from "@/components/WeekToggle";
import Legend from "@/components/Legend";
import DayCard from "@/components/DayCard";
import MentionsSection from "@/components/MentionsSection";
import { mealPlan, mentions, type DayPlan, type DayName } from "@/data/mealPlan";
import { getCurrentMealWeek, getTodayDayName } from "@/lib/dateUtils";
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
  day: string;
  week: number;
  meals: DayPlan["meals"];
  reminders: DayPlan["reminders"] | null;
}

export default function Home() {
  const { user, loading: authLoading, supabase } = useAuth();
  const [activeWeek, setActiveWeek] = useState(() => getCurrentMealWeek());

  // Base plan from Supabase (falls back to hardcoded)
  const [days, setDays] = useState<DayPlan[]>(mealPlan);
  const [basePlanIds, setBasePlanIds] = useState<Record<string, string>>({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("base_meal_plans")
      .select("id, day, week, meals, reminders")
      .order("week")
      .order("day")
      .then(({ data, error }) => {
        if (data && !error) {
          const plans: DayPlan[] = (data as BasePlanRow[]).map((row) => ({
            day: row.day as DayPlan["day"],
            week: row.week,
            meals: row.meals,
            reminders: row.reminders ?? undefined,
          }));
          const idMap: Record<string, string> = {};
          (data as BasePlanRow[]).forEach((row) => {
            idMap[`${row.week}-${row.day}`] = row.id;
          });
          plans.sort(
            (a, b) =>
              a.week - b.week || DAY_ORDER[a.day] - DAY_ORDER[b.day]
          );
          setDays(plans);
          setBasePlanIds(idMap);
        }
        setDataLoading(false);
      });
  }, [user, supabase]);

  const todayName = getTodayDayName();
  const currentMealWeek = getCurrentMealWeek();
  const filteredDays = days.filter((d) => d.week === activeWeek);

  if (authLoading || (user && dataLoading)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading meal plan...</p>
      </main>
    );
  }

  return (
    <main>
      <Header />
      <WeekToggle activeWeek={activeWeek} onWeekChange={setActiveWeek} />
      <Legend />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-5 md:px-8">
        {filteredDays.map((dayPlan) => (
          <DayCard
            key={`${dayPlan.week}-${dayPlan.day}`}
            dayPlan={dayPlan}
            basePlanId={basePlanIds[`${dayPlan.week}-${dayPlan.day}`] ?? ""}
            isToday={
              dayPlan.day === todayName && dayPlan.week === currentMealWeek
            }
          />
        ))}
      </div>

      <MentionsSection mentions={mentions} />
    </main>
  );
}
