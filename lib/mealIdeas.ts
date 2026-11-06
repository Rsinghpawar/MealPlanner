import type { MealType } from "@/data/mealPlan";

/** An easy Indian dish from TheMealDB, as served by /api/meal-ideas. */
export interface MealIdea {
  id: string;
  name: string;
  /** TheMealDB category, e.g. "Vegetarian", "Chicken", "Breakfast". */
  category: string;
  /** Which meals of the day it suits. */
  mealTypes: MealType[];
  thumbnail: string | null;
  youtube: string | null;
  /** Written recipe (falls back to the TheMealDB page). */
  recipeUrl: string;
  ingredients: string[];
}

export interface MealIdeasResponse {
  source: "TheMealDB";
  ideas: MealIdea[];
}
