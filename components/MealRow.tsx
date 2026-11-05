import { Fragment } from "react";
import type { Meal, MealType } from "@/data/mealPlan";
import { MEAL_ICONS } from "@/data/mealPlan";
import { splitDishes } from "@/lib/foodEmoji";
import { parseRecipeLink } from "@/lib/recipeLink";
import RecipeLinkChip from "./RecipeLinkChip";

export const MEAL_STYLES: Record<MealType, { bg: string; labelColor: string; label: string }> = {
  breakfast: { bg: "bg-meal-breakfast-bg", labelColor: "text-meal-breakfast", label: "Breakfast" },
  lunch:     { bg: "bg-meal-lunch-bg",     labelColor: "text-meal-lunch",     label: "Lunch" },
  dinner:    { bg: "bg-meal-dinner-bg",    labelColor: "text-meal-dinner",    label: "Dinner" },
};

interface MealRowProps {
  meal: Meal;
}

export default function MealRow({ meal }: MealRowProps) {
  const style = MEAL_STYLES[meal.type];
  const recipe = parseRecipeLink(meal.recipeUrl);

  return (
    <div className={`px-4 py-2.5 border-t border-line-soft ${style.bg}`}>
      <div className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${style.labelColor}`}>
        {MEAL_ICONS[meal.type]} {style.label}
      </div>
      <div className="text-[13px] font-medium leading-snug">
        <MealName name={meal.name} />
      </div>
      {recipe && <RecipeLinkChip link={recipe} />}
    </div>
  );
}

/** Dish names with their food emoji (hidden by CSS when emojis are off). */
function MealName({ name }: { name: string }) {
  return (
    <>
      {splitDishes(name).map((dish, i) => (
        <Fragment key={i}>
          {i > 0 && " + "}
          {dish.emoji && (
            <span className="food-emoji" aria-hidden="true">
              {dish.emoji}{" "}
            </span>
          )}
          {dish.name}
        </Fragment>
      ))}
    </>
  );
}
