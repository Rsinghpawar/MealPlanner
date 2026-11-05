"use client";

import { useState, useRef } from "react";
import type { DayPlan, DayName, Meal, ReminderType } from "@/data/mealPlan";
import { MEAL_ICONS, REMINDER_ICONS } from "@/data/mealPlan";
import { normalizeRecipeInput, parseRecipeLink } from "@/lib/recipeLink";
import MealRow, { MEAL_STYLES } from "./MealRow";
import Reminder from "./Reminder";
import ShareModal from "./ShareModal";
import { RecipeIcon } from "./RecipeLinkChip";

/** Anchor for the "Today" button. */
export const TODAY_CARD_ID = "today-card";

const DAY_HEADER_COLORS: Record<DayName, string> = {
  Monday: "bg-orange-100 dark:bg-orange-400/15",
  Tuesday: "bg-green-100 dark:bg-green-400/15",
  Wednesday: "bg-blue-100 dark:bg-blue-400/15",
  Thursday: "bg-pink-100 dark:bg-pink-400/15",
  Friday: "bg-purple-100 dark:bg-purple-400/15",
  Saturday: "bg-cyan-100 dark:bg-cyan-400/15",
};

const REMINDER_EDIT_STYLES: Record<ReminderType, string> = {
  soak:  "bg-soak-bg border-l-[3px] border-soak-border text-soak-text",
  stock: "bg-stock-bg border-l-[3px] border-stock-border text-stock-text",
};

const HEADER_BUTTON_CLASS =
  "p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors";

const INPUT_CLASS =
  "w-full rounded px-2 py-1 border border-line bg-field text-ink focus:border-forest focus:ring-1 focus:ring-forest outline-none";

interface DayCardProps {
  dayPlan: DayPlan;
  isToday: boolean;
  /** Signed in as a plan editor, and this day exists in the database. */
  canEdit: boolean;
  /** Saves to the shared plan; resolves to an error message, or null on success. */
  onSave: (updated: DayPlan) => Promise<string | null>;
}

export default function DayCard({ dayPlan, isToday, canEdit, onSave }: DayCardProps) {
  const plan = dayPlan;
  const [showShareModal, setShowShareModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<DayPlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Signing out mid-edit drops back to view mode.
  const isEditing = editMode && canEdit && draft !== null;

  const headerColor = DAY_HEADER_COLORS[dayPlan.day];

  /* ── Edit mode helpers ─────────────────────────────── */
  function enterEdit() {
    setDraft(structuredClone(plan));
    setSaveError(null);
    setEditMode(true);
  }

  async function handleSave() {
    if (!draft || saving) return;

    // Recipe links are typed freely while editing; clean them up (or stop
    // with a message) before anything is saved.
    const meals: Meal[] = [];
    for (const meal of draft.meals) {
      const recipeUrl = normalizeRecipeInput(meal.recipeUrl ?? "");
      if (recipeUrl === null) {
        setSaveError(
          `The ${MEAL_STYLES[meal.type].label.toLowerCase()} recipe link isn't a web link. Paste the full link, like https://youtube.com/shorts/…`
        );
        return;
      }
      const cleaned: Meal = { type: meal.type, name: meal.name };
      if (recipeUrl) cleaned.recipeUrl = recipeUrl;
      meals.push(cleaned);
    }

    setSaving(true);
    setSaveError(null);
    const error = await onSave({ ...draft, meals });
    setSaving(false);
    if (error) {
      // Keep the draft so nothing typed is lost; they can retry or cancel.
      setSaveError(error);
      return;
    }
    setEditMode(false);
    setDraft(null);
  }

  function handleCancel() {
    setEditMode(false);
    setDraft(null);
    setSaveError(null);
  }

  function updateMeal(idx: number, changes: Partial<Meal>) {
    if (!draft) return;
    setDraft({ ...draft, meals: draft.meals.map((m, i) => i === idx ? { ...m, ...changes } : m) });
  }

  function updateReminderText(idx: number, value: string) {
    if (!draft?.reminders) return;
    setDraft({ ...draft, reminders: draft.reminders.map((r, i) => i === idx ? { ...r, text: value } : r) });
  }

  /* ── Ring styling ──────────────────────────────────── */
  const ringClass = isEditing
    ? "ring-2 ring-amber-400"
    : isToday
    ? "ring-2 ring-forest dark:ring-accent today-glow"
    : "";

  const displayPlan = isEditing && draft ? draft : plan;

  return (
    <>
      <div
        ref={cardRef}
        id={isToday ? TODAY_CARD_ID : undefined}
        className={`bg-surface rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.07)] flex flex-col scroll-mt-20 md:scroll-mt-4 ${ringClass}`}
      >
        {/* ── Header ──────────────────────────────────── */}
        <div className={`px-4 py-3 font-bold text-sm flex justify-between items-center ${headerColor}`}>
          <span className="text-[15px]">
            {isToday && !isEditing && <span className="mr-1">{"\u{1F4CD}"}</span>}
            {isEditing && <span className="mr-1 text-amber-500">{"✏️"}</span>}
            {dayPlan.day}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] opacity-70 font-normal">Week {dayPlan.week}</span>
            {!isEditing && (
              <>
                {/* Edit button (signed-in users only) */}
                {canEdit && (
                  <button
                    onClick={enterEdit}
                    className={HEADER_BUTTON_CLASS}
                    aria-label={`Edit ${dayPlan.day} meal plan`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
                {/* Share button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className={HEADER_BUTTON_CLASS}
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
              const style = MEAL_STYLES[meal.type];
              const rawLink = meal.recipeUrl ?? "";
              const normalized = normalizeRecipeInput(rawLink);
              const link = normalized ? parseRecipeLink(normalized) : null;
              return (
                <div key={meal.type} className={`px-4 py-2.5 border-t border-line-soft ${style.bg}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 ${style.labelColor}`}>
                    {MEAL_ICONS[meal.type]} {style.label}
                  </div>
                  <input
                    value={meal.name}
                    onChange={(e) => updateMeal(idx, { name: e.target.value })}
                    className={`${INPUT_CLASS} text-[13px] font-medium leading-snug`}
                    placeholder="Meal name"
                    aria-label={`${style.label} meal name`}
                  />
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="shrink-0 text-ink-muted">
                      <RecipeIcon platform={link?.platform ?? "youtube"} />
                    </span>
                    <input
                      type="url"
                      inputMode="url"
                      autoComplete="off"
                      value={rawLink}
                      onChange={(e) => updateMeal(idx, { recipeUrl: e.target.value })}
                      className={`${INPUT_CLASS} text-[12px]`}
                      placeholder="Recipe video link (YouTube / Instagram)"
                      aria-label={`${style.label} recipe video link`}
                    />
                  </div>
                  {rawLink.trim() !== "" &&
                    (link ? (
                      <p className="text-[10px] font-semibold text-green-700 dark:text-green-400 mt-1 ml-5">
                        {"✓"} {link.label}
                      </p>
                    ) : (
                      <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 mt-1 ml-5">
                        Paste the full link, like https://youtube.com/shorts/{"…"}
                      </p>
                    ))}
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
                      className="flex-1 text-[11px] font-medium leading-relaxed rounded px-1.5 py-0.5 border border-line focus:border-forest outline-none resize-none bg-field/80 text-ink"
                    />
                  </div>
                ))}
              </div>
            )}

        {/* ── Save / Cancel ───────────────────────────── */}
        {isEditing && (
          <div className="px-3 py-2.5 border-t border-line-soft bg-surface-2">
            {saveError && (
              <p role="alert" className="text-[12px] text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/15 rounded-lg px-2.5 py-1.5 mb-2">
                {saveError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-1.5 rounded-lg bg-forest text-white font-semibold text-[13px] hover:bg-forest/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 py-1.5 rounded-lg bg-surface border border-line text-ink-muted font-semibold text-[13px] hover:bg-surface-2 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
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
