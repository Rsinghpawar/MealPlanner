import { NextResponse } from "next/server";
import type { MealType } from "@/data/mealPlan";
import type { MealIdea, MealIdeasResponse } from "@/lib/mealIdeas";

/**
 * Easy Indian dishes from TheMealDB (free, no API key), for the Shuffle
 * suggestions on today's card.
 *
 * TheMealDB's Indian list is small (about 15 dishes, plus a few Bangladeshi
 * ones), so this fetches all of them with details, keeps the simple ones and
 * lets the browser pick. Results are cached for a day by Vercel's CDN and by
 * Next's fetch cache, so TheMealDB sees a couple of dozen requests a day at most.
 */

const API = "https://www.themealdb.com/api/json/v1/1";

/**
 * Its area list says "Indian" but filtering only works with "India" right
 * now, so ask for both (and the Bengali dishes filed under Bangladesh).
 */
const AREAS = ["Indian", "India", "Bangladeshi", "Bangladesh"];

/** Not part of this household's plan, or not a meal. */
const SKIPPED_CATEGORIES = new Set(["Beef", "Pork", "Lamb", "Goat", "Dessert"]);

/** Tagged dishes that aren't Indian home cooking (e.g. "Fusion": smoked haddock kedgeree). */
const SKIPPED_TAGS = new Set(["fusion", "alcoholic"]);

/** "Not very technical": short ingredient lists only. */
const MAX_INGREDIENTS = 16;

const DAY = 60 * 60 * 24;

interface RawMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strMealThumb: string | null;
  strYoutube: string | null;
  strSource: string | null;
  strTags: string | null;
  [key: string]: string | null;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: DAY },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`TheMealDB ${res.status} for ${url}`);
  return (await res.json()) as T;
}

function webLink(url: string | null): string | null {
  const trimmed = url?.trim();
  return trimmed && /^https?:\/\//i.test(trimmed) ? trimmed : null;
}

function hasSkippedTag(meal: RawMeal): boolean {
  return (meal.strTags ?? "")
    .split(",")
    .some((tag) => SKIPPED_TAGS.has(tag.trim().toLowerCase()));
}

function toIdea(meal: RawMeal): MealIdea {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    if (ingredient) ingredients.push(ingredient);
  }
  const category = meal.strCategory?.trim() || "Miscellaneous";
  const mealTypes: MealType[] =
    category === "Breakfast" ? ["breakfast"] : ["lunch", "dinner"];

  return {
    id: meal.idMeal,
    name: meal.strMeal.trim(),
    category,
    mealTypes,
    thumbnail: webLink(meal.strMealThumb),
    youtube: webLink(meal.strYoutube),
    recipeUrl:
      webLink(meal.strSource) ?? `https://www.themealdb.com/meal/${meal.idMeal}`,
    ingredients,
  };
}

export async function GET() {
  try {
    const lists = await Promise.all(
      AREAS.map((area) =>
        getJson<{ meals: { idMeal: string }[] | null }>(
          `${API}/filter.php?a=${encodeURIComponent(area)}`
        )
      )
    );
    const ids = [...new Set(lists.flatMap((list) => list.meals ?? []).map((m) => m.idMeal))];
    if (ids.length === 0) throw new Error("TheMealDB returned no Indian dishes");

    const details = await Promise.all(
      ids.map((id) =>
        getJson<{ meals: RawMeal[] | null }>(`${API}/lookup.php?i=${encodeURIComponent(id)}`)
      )
    );

    const ideas = details
      .flatMap((d) => d.meals ?? [])
      .filter((meal) => !hasSkippedTag(meal))
      .map(toIdea)
      .filter(
        (idea) =>
          !SKIPPED_CATEGORIES.has(idea.category) &&
          idea.ingredients.length > 0 &&
          idea.ingredients.length <= MAX_INGREDIENTS
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    const body: MealIdeasResponse = { source: "TheMealDB", ideas };
    return NextResponse.json(body, {
      headers: {
        "Cache-Control": `public, s-maxage=${DAY}, stale-while-revalidate=${7 * DAY}`,
      },
    });
  } catch (err) {
    console.error("Meal ideas failed:", err);
    return NextResponse.json(
      { source: "TheMealDB", ideas: [], error: "Couldn't load meal ideas" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
