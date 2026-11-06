import type { MealType } from "@/data/mealPlan";

/** Where an online meal idea came from. */
export type IdeaSource = "TheMealDB" | "spoonacular";

/** Breakfast ideas, or main-course ideas for lunch and dinner. */
export type IdeaKind = "breakfast" | "main";

export function ideaKind(type: MealType): IdeaKind {
  return type === "breakfast" ? "breakfast" : "main";
}

/** An easy Indian dish found online, as served by /api/meal-ideas. */
export interface MealIdea {
  id: string;
  source: IdeaSource;
  name: string;
  /** "Vegetarian", "Chicken", "Non-veg", ... */
  category: string;
  /** Which meals of the day it suits. */
  mealTypes: MealType[];
  /** Ready-to-use thumbnail URL. */
  thumbnail: string | null;
  youtube: string | null;
  /** Written recipe. */
  recipeUrl: string;
  ingredients: string[];
  /** Total time, when the source says. */
  readyInMinutes: number | null;
}

export interface SourceStatus {
  ok: boolean;
  /** Ideas this source contributed (after filtering). */
  count: number;
  /** Why it didn't contribute, e.g. "not configured", "daily quota used up". */
  error?: string;
}

export interface MealIdeasResponse {
  ideas: MealIdea[];
  sources: Partial<Record<IdeaSource, SourceStatus>>;
}

/** Credit links shown under the suggestions (spoonacular's free plan requires one). */
export const SOURCE_LINKS: Record<IdeaSource, { label: string; href: string }> = {
  TheMealDB: { label: "TheMealDB", href: "https://www.themealdb.com" },
  spoonacular: { label: "spoonacular", href: "https://spoonacular.com/food-api" },
};
