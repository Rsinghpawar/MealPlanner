"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import WeekToggle from "@/components/WeekToggle";
import Legend from "@/components/Legend";
import DayCard, { TODAY_CARD_ID } from "@/components/DayCard";
import MentionsSection from "@/components/MentionsSection";
import { mentions } from "@/data/mealPlan";
import { getCurrentMealWeek, getTodayDayName } from "@/lib/dateUtils";
import { useAuth } from "@/lib/AuthProvider";
import { dayKey, useMealPlan } from "@/lib/useMealPlan";

export default function Home() {
  const { loading: authLoading, isEditor } = useAuth();
  const { days, loading: dataLoading, fromDatabase, saveDay, canSaveDay } = useMealPlan();
  const [activeWeek, setActiveWeek] = useState(() => getCurrentMealWeek());
  // Set by the Today button; the scroll waits until the right week is showing.
  const [scrollToToday, setScrollToToday] = useState(false);

  const todayName = getTodayDayName();
  const currentMealWeek = getCurrentMealWeek();
  const filteredDays = days.filter((d) => d.week === activeWeek);

  useEffect(() => {
    if (!scrollToToday) return;
    setScrollToToday(false);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById(TODAY_CARD_ID)
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [scrollToToday, activeWeek]);

  function goToToday() {
    setActiveWeek(currentMealWeek);
    setScrollToToday(true);
  }

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
      <WeekToggle
        activeWeek={activeWeek}
        onWeekChange={setActiveWeek}
        onToday={todayName ? goToToday : undefined}
      />
      <Legend />

      {isEditor === true && !fromDatabase && (
        <p
          role="status"
          className="mx-4 md:mx-8 mt-3 rounded-lg bg-stock-bg text-stock-text border-l-[3px] border-stock-border px-3 py-2 text-[12px] font-medium leading-snug"
        >
          Editing is off: the meal plan didn&apos;t load from the database, so this is
          the built-in copy. Check your connection (or whether Supabase is paused) and
          reload.
        </p>
      )}

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
