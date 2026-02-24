import type { DayPlan, MealType } from "@/data/mealPlan";
import { MEAL_ICONS } from "@/data/mealPlan";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

/** Formats a DayPlan into shareable plain-text (WhatsApp-friendly). */
export function formatMealText(dayPlan: DayPlan): string {
  const header = `\u{1F957} ${dayPlan.day} \u2014 Week ${dayPlan.week}`;

  const mealBlocks = dayPlan.meals.map((meal) => {
    const icon = MEAL_ICONS[meal.type];
    const label = MEAL_LABELS[meal.type];
    const lines = [`${icon} ${label}: ${meal.name}`];
    if (meal.note) lines.push(meal.note);
    return lines.join("\n");
  });

  return [header, "", ...mealBlocks].join("\n\n");
}
