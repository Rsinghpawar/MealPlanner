import type { MealType } from "@/data/mealPlan";
import type { MealIdea } from "@/lib/mealIdeas";
import { DAY, MAX_INGREDIENTS, webLink } from "./shared";

/**
 * TheMealDB (free, no API key). Its Indian list is small (about 15 dishes,
 * plus a few Bangladeshi ones), so this fetches all of them with details.
 * Cached for a day in Next's fetch cache.
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
  const thumb = webLink(meal.strMealThumb);

  return {
    id: `themealdb-${meal.idMeal}`,
    source: "TheMealDB",
    name: meal.strMeal.trim(),
    category,
    mealTypes,
    // TheMealDB serves a 250px preview at /small.
    thumbnail: thumb ? `${thumb}/small` : null,
    youtube: webLink(meal.strYoutube),
    recipeUrl:
      webLink(meal.strSource) ?? `https://www.themealdb.com/meal/${meal.idMeal}`,
    ingredients,
    readyInMinutes: null,
  };
}

/** Every easy Indian dish on TheMealDB (breakfast and main courses). */
export async function fromTheMealDB(): Promise<MealIdea[]> {
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

  return details
    .flatMap((d) => d.meals ?? [])
    .filter((meal) => !hasSkippedTag(meal))
    .map(toIdea)
    .filter(
      (idea) =>
        !SKIPPED_CATEGORIES.has(idea.category) &&
        idea.ingredients.length > 0 &&
        idea.ingredients.length <= MAX_INGREDIENTS
    );
}
