"use client";

import { useState, useRef } from "react";
import type { DayPlan, DayName } from "@/data/mealPlan";
import MealRow from "./MealRow";
import Reminder from "./Reminder";
import ShareModal from "./ShareModal";

const DAY_HEADER_COLORS: Record<DayName, string> = {
  Monday: "bg-orange-100",
  Tuesday: "bg-green-100",
  Wednesday: "bg-blue-100",
  Thursday: "bg-pink-100",
  Friday: "bg-purple-100",
  Saturday: "bg-cyan-100",
};

interface DayCardProps {
  dayPlan: DayPlan;
  isToday: boolean;
}

export default function DayCard({ dayPlan, isToday }: DayCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerColor = DAY_HEADER_COLORS[dayPlan.day];

  return (
    <>
      <div
        ref={cardRef}
        className={`bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.07)] flex flex-col
          ${isToday ? "ring-2 ring-forest today-glow" : ""}`}
      >
        <div
          className={`px-4 py-3 font-bold text-sm flex justify-between items-center ${headerColor}`}
        >
          <span className="text-[15px]">
            {isToday && <span className="mr-1">{"\u{1F4CD}"}</span>}
            {dayPlan.day}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] opacity-70 font-normal">
              Week {dayPlan.week}
            </span>
            <button
              onClick={() => setShowShareModal(true)}
              className="p-1 rounded-md hover:bg-black/10 transition-colors"
              aria-label={`Share ${dayPlan.day} meal plan`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
          </div>
        </div>

        {dayPlan.meals.map((meal) => (
          <MealRow key={meal.type} meal={meal} />
        ))}

        {dayPlan.reminders && dayPlan.reminders.length > 0 && (
          <div className="mt-auto flex flex-col gap-1.5 p-2 pb-2.5">
            {dayPlan.reminders.map((reminder, i) => (
              <Reminder key={i} reminder={reminder} />
            ))}
          </div>
        )}
      </div>

      {showShareModal && (
        <ShareModal
          dayPlan={dayPlan}
          cardRef={cardRef}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}
