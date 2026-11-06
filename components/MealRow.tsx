"use client";

import { useState } from "react";
import type { DayPlan, Meal, MealType } from "@/data/mealPlan";
import { MEAL_ICONS } from "@/data/mealPlan";
import { parseRecipeLink } from "@/lib/recipeLink";
import MealName from "./MealName";
import RecipeLinkChip from "./RecipeLinkChip";
import MealShuffle, { ShuffleIcon } from "./MealShuffle";

export const MEAL_STYLES: Record<MealType, { bg: string; labelColor: string; label: string }> = {
  breakfast: { bg: "bg-meal-breakfast-bg", labelColor: "text-meal-breakfast", label: "Breakfast" },
  lunch:     { bg: "bg-meal-lunch-bg",     labelColor: "text-meal-lunch",     label: "Lunch" },
  dinner:    { bg: "bg-meal-dinner-bg",    labelColor: "text-meal-dinner",    label: "Dinner" },
};

interface MealRowProps {
  meal: Meal;
  /** Set on today's card: the whole plan, which turns on the Shuffle button. */
  shuffleFrom?: DayPlan[];
}

export default function MealRow({ meal, shuffleFrom }: MealRowProps) {
  const style = MEAL_STYLES[meal.type];
  const recipe = parseRecipeLink(meal.recipeUrl);
  const [shuffling, setShuffling] = useState(false);

  return (
    <div className={`px-4 py-2.5 border-t border-line-soft ${style.bg}`}>
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <div className={`text-[10px] font-bold uppercase tracking-wide ${style.labelColor}`}>
          {MEAL_ICONS[meal.type]} {style.label}
        </div>
        {shuffleFrom && (
          <button
            type="button"
            onClick={() => setShuffling((s) => !s)}
            aria-expanded={shuffling}
            aria-label={`Suggest something else for ${style.label.toLowerCase()}`}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border transition-colors ${
              shuffling
                ? "bg-forest text-white border-forest"
                : "bg-surface/70 text-ink-muted border-line hover:text-ink"
            }`}
          >
            <ShuffleIcon />
            Shuffle
          </button>
        )}
      </div>
      <div className="text-[13px] font-medium leading-snug">
        <MealName name={meal.name} />
      </div>
      {recipe && <RecipeLinkChip link={recipe} />}
      {shuffleFrom && shuffling && (
        <MealShuffle
          meal={meal}
          days={shuffleFrom}
          label={style.label}
          onClose={() => setShuffling(false)}
        />
      )}
    </div>
  );
}
