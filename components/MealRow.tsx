import type { Meal, MealType } from "@/data/mealPlan";
import { MEAL_ICONS } from "@/data/mealPlan";

const MEAL_STYLES: Record<MealType, { bg: string; labelColor: string; label: string }> = {
  breakfast: { bg: "bg-[#fffaf6]", labelColor: "text-meal-breakfast", label: "Breakfast" },
  lunch:     { bg: "bg-[#f6fcf9]", labelColor: "text-meal-lunch",     label: "Lunch" },
  dinner:    { bg: "bg-[#f7f7fc]", labelColor: "text-meal-dinner",    label: "Dinner" },
};

interface MealRowProps {
  meal: Meal;
}

export default function MealRow({ meal }: MealRowProps) {
  const style = MEAL_STYLES[meal.type];

  return (
    <div className={`px-4 py-2.5 border-t border-gray-100 ${style.bg}`}>
      <div className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${style.labelColor}`}>
        {MEAL_ICONS[meal.type]} {style.label}
      </div>
      <div className="text-[13px] font-medium leading-snug">{meal.name}</div>
      {meal.note && (
        <div className="text-[11px] text-gray-400 mt-0.5">{meal.note}</div>
      )}
    </div>
  );
}
