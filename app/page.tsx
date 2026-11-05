"use client";

import { useState } from "react";
import Header from "@/components/Header";
import WeekToggle from "@/components/WeekToggle";
import Legend from "@/components/Legend";
import DayCard from "@/components/DayCard";
import MentionsSection from "@/components/MentionsSection";
import { mentions } from "@/data/mealPlan";
import { getCurrentMealWeek, getTodayDayName } from "@/lib/dateUtils";
import { useAuth } from "@/lib/AuthProvider";
import { dayKey, useMealPlan } from "@/lib/useMealPlan";

export default function Home() {
  const { loading: authLoading, isEditor } = useAuth();
  const { days, loading: dataLoading, saveDay, canSaveDay } = useMealPlan();
  const [activeWeek, setActiveWeek] = useState(() => getCurrentMealWeek());

  const todayName = getTodayDayName();
  const currentMealWeek = getCurrentMealWeek();
  const filteredDays = days.filter((d) => d.week === activeWeek);

  if (authLoading || dataLoading) {
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
            key={dayKey(dayPlan)}
            dayPlan={dayPlan}
            canEdit={isEditor === true && canSaveDay(dayPlan)}
            onSave={saveDay}
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
