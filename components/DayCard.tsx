"use client";

import { useState, useRef } from "react";
import type { DayPlan, DayName, MealType, ReminderType } from "@/data/mealPlan";
import { MEAL_ICONS, REMINDER_ICONS } from "@/data/mealPlan";
import MealRow from "./MealRow";
import Reminder from "./Reminder";
import ShareModal from "./ShareModal";
import { usePlanEdit } from "@/lib/usePlanEdit";

const DAY_HEADER_COLORS: Record<DayName, string> = {
  Monday: "bg-orange-100",
  Tuesday: "bg-green-100",
  Wednesday: "bg-blue-100",
  Thursday: "bg-pink-100",
  Friday: "bg-purple-100",
  Saturday: "bg-cyan-100",
};

const MEAL_EDIT_STYLES: Record<MealType, { bg: string; labelColor: string; label: string }> = {
  breakfast: { bg: "bg-[#fffaf6]", labelColor: "text-meal-breakfast", label: "Breakfast" },
  lunch:     { bg: "bg-[#f6fcf9]", labelColor: "text-meal-lunch",     label: "Lunch" },
  dinner:    { bg: "bg-[#f7f7fc]", labelColor: "text-meal-dinner",    label: "Dinner" },
};

const REMINDER_EDIT_STYLES: Record<ReminderType, string> = {
  soak:  "bg-soak-bg border-l-[3px] border-soak-border text-soak-text",
  stock: "bg-stock-bg border-l-[3px] border-stock-border text-stock-text",
};

interface DayCardProps {
  dayPlan: DayPlan;
  isToday: boolean;
}

export default function DayCard({ dayPlan, isToday }: DayCardProps) {
  const { plan, save } = usePlanEdit(dayPlan);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<DayPlan | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const headerColor = DAY_HEADER_COLORS[dayPlan.day];

  /* ── Edit mode helpers ─────────────────────────────── */
  function enterEdit() {
    setDraft(structuredClone(plan));
    setIsEditing(true);
  }

  function handleSave() {
    if (!draft) return;
    save(draft);
    setIsEditing(false);
    setDraft(null);
  }

  function handleCancel() {
    setIsEditing(false);
    setDraft(null);
  }

  function updateMealName(idx: number, value: string) {
    if (!draft) return;
    setDraft({ ...draft, meals: draft.meals.map((m, i) => i === idx ? { ...m, name: value } : m) });
  }

  function updateMealNote(idx: number, value: string) {
    if (!draft) return;
    setDraft({ ...draft, meals: draft.meals.map((m, i) => i === idx ? { ...m, note: value.trimStart() || undefined } : m) });
  }

  function updateReminderText(idx: number, value: string) {
    if (!draft?.reminders) return;
    setDraft({ ...draft, reminders: draft.reminders.map((r, i) => i === idx ? { ...r, text: value } : r) });
  }

  /* ── Ring styling ──────────────────────────────────── */
  const ringClass = isEditing
    ? "ring-2 ring-amber-400"
    : isToday
    ? "ring-2 ring-forest today-glow"
    : "";

  const displayPlan = isEditing && draft ? draft : plan;

  return (
    <>
      <div
        ref={cardRef}
        className={`bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.07)] flex flex-col ${ringClass}`}
      >
        {/* ── Header ──────────────────────────────────── */}
        <div className={`px-4 py-3 font-bold text-sm flex justify-between items-center ${headerColor}`}>
          <span className="text-[15px]">
            {isToday && !isEditing && <span className="mr-1">{"\u{1F4CD}"}</span>}
            {isEditing && <span className="mr-1 text-amber-500">{"\u270F\uFE0F"}</span>}
            {dayPlan.day}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] opacity-70 font-normal">Week {dayPlan.week}</span>
            {!isEditing && (
              <>
                {/* Edit button */}
                <button
                  onClick={enterEdit}
                  className="p-1 rounded-md hover:bg-black/10 transition-colors"
                  aria-label={`Edit ${dayPlan.day} meal plan`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                {/* Share button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-1 rounded-md hover:bg-black/10 transition-colors"
                  aria-label={`Share ${dayPlan.day} meal plan`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Meals ───────────────────────────────────── */}
        {!isEditing
          ? displayPlan.meals.map((meal) => <MealRow key={meal.type} meal={meal} />)
          : draft!.meals.map((meal, idx) => {
              const style = MEAL_EDIT_STYLES[meal.type];
              return (
                <div key={meal.type} className={`px-4 py-2.5 border-t border-gray-100 ${style.bg}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 ${style.labelColor}`}>
                    {MEAL_ICONS[meal.type]} {style.label}
                  </div>
                  <input
                    value={meal.name}
                    onChange={(e) => updateMealName(idx, e.target.value)}
                    className="w-full text-[13px] font-medium rounded px-2 py-1 border border-gray-200 focus:border-forest focus:ring-1 focus:ring-forest outline-none bg-white leading-snug"
                    placeholder="Meal name"
                  />
                  <input
                    value={meal.note ?? ""}
                    onChange={(e) => updateMealNote(idx, e.target.value)}
                    className="w-full text-[11px] mt-1 rounded px-2 py-0.5 border border-gray-200 focus:border-forest focus:ring-1 focus:ring-forest outline-none text-gray-500 bg-white"
                    placeholder="Add note (optional)"
                  />
                </div>
              );
            })}

        {/* ── Reminders ───────────────────────────────── */}
        {!isEditing
          ? displayPlan.reminders && displayPlan.reminders.length > 0 && (
              <div className="mt-auto flex flex-col gap-1.5 p-2 pb-2.5">
                {displayPlan.reminders.map((reminder, i) => (
                  <Reminder key={i} reminder={reminder} />
                ))}
              </div>
            )
          : draft!.reminders && draft!.reminders.length > 0 && (
              <div className="mt-auto flex flex-col gap-1.5 p-2 pb-2.5">
                {draft!.reminders.map((reminder, idx) => (
                  <div
                    key={idx}
                    className={`rounded-md px-2.5 py-1.5 flex items-start gap-1.5 text-[11px] font-medium leading-relaxed ${REMINDER_EDIT_STYLES[reminder.type]}`}
                  >
                    <span className="text-[13px] shrink-0 mt-1">{REMINDER_ICONS[reminder.type]}</span>
                    <textarea
                      value={reminder.text}
                      onChange={(e) => updateReminderText(idx, e.target.value)}
                      rows={2}
                      className="flex-1 text-[11px] font-medium leading-relaxed rounded px-1.5 py-0.5 border border-gray-200 focus:border-forest outline-none resize-none bg-white/80"
                    />
                  </div>
                ))}
              </div>
            )}

        {/* ── Save / Cancel ───────────────────────────── */}
        {isEditing && (
          <div className="flex gap-2 px-3 py-2.5 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleSave}
              className="flex-1 py-1.5 rounded-lg bg-forest text-white font-semibold text-[13px] hover:bg-forest/90 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 font-semibold text-[13px] hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {showShareModal && (
        <ShareModal
          dayPlan={plan}
          cardRef={cardRef}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}
