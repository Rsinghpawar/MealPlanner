"use client";

import { useState } from "react";
import Header from "@/components/Header";
import WeekToggle from "@/components/WeekToggle";
import Legend from "@/components/Legend";
import DayCard from "@/components/DayCard";
import MentionsSection from "@/components/MentionsSection";
import { mealPlan, mentions } from "@/data/mealPlan";
import { getCurrentMealWeek, getTodayDayName } from "@/lib/dateUtils";

export default function Home() {
  const [activeWeek, setActiveWeek] = useState(() => getCurrentMealWeek());

  const todayName = getTodayDayName();
  const currentMealWeek = getCurrentMealWeek();

  const filteredDays = mealPlan.filter((d) => d.week === activeWeek);

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
