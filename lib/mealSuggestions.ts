import type { DayName, DayPlan, Meal } from "@/data/mealPlan";
import type { MealIdea } from "@/lib/mealIdeas";

/**
 * Picks alternatives for one of today's meals: something else from the
 * household's own plan, and an easy Indian dish from TheMealDB.
 */

export interface PlanSuggestion {
  kind: "plan";
  meal: Meal;
  day: DayName;
  week: number;
}

export interface OnlineSuggestion {
  kind: "online";
  idea: MealIdea;
}

export type Suggestion = PlanSuggestion | OnlineSuggestion;

/**
 * The "main" ingredient of a meal. If today's dinner is chicken, the
 * suggestions skip chicken dishes. Staples (rice, roti, dal, salad, curd,
 * fruit) don't count, or nearly everything would be skipped.
 */
const MAIN_INGREDIENTS: [string, RegExp][] = [
  ["chicken", /chicken/i],
  ["mutton", /mutton|lamb|goat/i],
  ["fish", /fish|prawn|shrimp|haddock|seafood/i],
  ["egg", /\beggs?\b|omelet/i],
  ["paneer", /paneer/i],
  ["mushroom", /mushroom/i],
  ["rajma", /rajma|kidney bean/i],
  ["chole", /chole|chana|chickpea/i],
  ["soya", /soya|soy chunk/i],
];

export function mainIngredients(text: string): Set<string> {
  return new Set(
    MAIN_INGREDIENTS.filter(([, pattern]) => pattern.test(text)).map(([name]) => name)
  );
}

function sharesAny(a: Set<string>, b: Set<string>): boolean {
  for (const item of a) if (b.has(item)) return true;
  return false;
}

/** "Matar Paneer + Roti" -> "matarpaneerroti", for loose name comparisons. */
function squash(text: string): string {
  return text.toLowerCase().replace(/[^a-z]/g, "");
}

/** Sides that go with everything, ignored when telling meals apart. */
const STAPLE = /^(rice|roti|rice\/roti|chapati|phulka|(cut )?salad|curd|pickle|cut fruits?)$/i;

/**
 * "Matar Paneer + Rice/Roti" and "Matar Paneer + Roti" are the same meal for
 * a suggestion, so compare the non-staple dishes only.
 */
function mainDishKey(mealName: string): string {
  const dishes = mealName.split(/\s+\+\s+/).map((d) => d.trim());
  const main = dishes.filter((d) => !STAPLE.test(d));
  return squash((main.length > 0 ? main : dishes).join(" "));
}

function ideaText(idea: MealIdea): string {
  return [idea.name, idea.category, ...idea.ingredients].join(" ");
}

/** Other meals of the same type in the plan, skipping today's main ingredient when possible. */
export function planOptions(days: DayPlan[], current: Meal): PlanSuggestion[] {
  const avoid = mainIngredients(current.name);
  const seen = new Set([mainDishKey(current.name)]);
  const all: PlanSuggestion[] = [];

  for (const day of days) {
    for (const meal of day.meals) {
      if (meal.type !== current.type) continue;
      const key = mainDishKey(meal.name);
      if (seen.has(key)) continue;
      seen.add(key);
      all.push({ kind: "plan", meal, day: day.day, week: day.week });
    }
  }

  const different = all.filter((s) => !sharesAny(mainIngredients(s.meal.name), avoid));
  return different.length > 0 ? different : all;
}

/**
 * Online ideas that suit this meal, skip today's main ingredient, and
 * (where possible) aren't already in the plan, so they're actually new.
 */
export function onlineOptions(
  ideas: MealIdea[],
  current: Meal,
  days: DayPlan[]
): OnlineSuggestion[] {
  const avoid = mainIngredients(current.name);
  const planNames = days.flatMap((d) => d.meals.map((m) => squash(m.name)));

  const suitable = ideas.filter(
    (idea) =>
      idea.mealTypes.includes(current.type) &&
      !sharesAny(mainIngredients(ideaText(idea)), avoid) &&
      !squash(current.name).includes(squash(idea.name))
  );
  const fresh = suitable.filter(
    (idea) => !planNames.some((name) => name.includes(squash(idea.name)))
  );

  return (fresh.length > 0 ? fresh : suitable).map((idea) => ({ kind: "online", idea }));
}

/** Fisher-Yates shuffle (copy). */
export function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * The two suggestions shown for a given round of "Shuffle again": one from
 * the plan and one online idea, or two from the plan when there's no
 * suitable online idea. Inputs should already be shuffled.
 */
export function suggestionPair(
  plan: PlanSuggestion[],
  online: OnlineSuggestion[],
  round: number
): Suggestion[] {
  const pair: Suggestion[] = [];
  if (online.length > 0) {
    if (plan.length > 0) pair.push(plan[round % plan.length]);
    pair.push(online[round % online.length]);
    return pair;
  }
  if (plan.length > 0) pair.push(plan[(2 * round) % plan.length]);
  if (plan.length > 1) pair.push(plan[(2 * round + 1) % plan.length]);
  return pair;
}
