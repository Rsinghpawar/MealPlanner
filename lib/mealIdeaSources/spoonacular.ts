import type { MealIdea, IdeaKind } from "@/lib/mealIdeas";
import { HOUR, MAX_INGREDIENTS, SKIPPED_MEAT, SourceUnavailable, webLink } from "./shared";

/**
 * spoonacular (needs a free API key in SPOONACULAR_API_KEY; off without one).
 *
 * Free plan limits shape this:
 * - 50 points a day. One search of 30 recipes with recipe info and
 *   ingredients costs about 2.8 points, and only the kind being shuffled
 *   (breakfast or main course) is fetched.
 * - Results may be cached for at most an hour, so the search is cached for
 *   an hour. sort=random gives a different 30 recipes each hour.
 * - A backlink is required: the Shuffle panel credits spoonacular.
 */

/** Overridable for local tests against a stand-in server. */
const API = process.env.SPOONACULAR_API_URL ?? "https://api.spoonacular.com";

const RESULTS_PER_SEARCH = 30;

/** "Not very technical": done in 45 minutes. */
const MAX_READY_MINUTES = 45;

interface IngredientItem {
  name?: string;
  nameClean?: string | null;
}

interface Recipe {
  id: number;
  title?: string;
  image?: string;
  readyInMinutes?: number;
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  vegetarian?: boolean;
  // With addRecipeInformation the full ingredient list may be here...
  extendedIngredients?: IngredientItem[];
  // ...and with fillIngredients (and no ingredient query) everything is "missed".
  missedIngredients?: IngredientItem[];
  usedIngredients?: IngredientItem[];
}

interface SearchResponse {
  results?: Recipe[];
}

function ingredientNames(recipe: Recipe): string[] {
  const items =
    recipe.extendedIngredients && recipe.extendedIngredients.length > 0
      ? recipe.extendedIngredients
      : [...(recipe.missedIngredients ?? []), ...(recipe.usedIngredients ?? [])];
  const names = items
    .map((item) => (item.nameClean || item.name || "").trim())
    .filter((name) => name.length > 0);
  return [...new Set(names.map((n) => n.toLowerCase()))];
}

function toIdea(recipe: Recipe, kind: IdeaKind): MealIdea | null {
  const name = recipe.title?.trim();
  if (!name || typeof recipe.id !== "number") return null;
  const ingredients = ingredientNames(recipe);

  return {
    id: `spoonacular-${recipe.id}`,
    source: "spoonacular",
    name,
    category: recipe.vegetarian ? "Vegetarian" : "Non-veg",
    mealTypes: kind === "breakfast" ? ["breakfast"] : ["lunch", "dinner"],
    thumbnail: webLink(recipe.image),
    youtube: null,
    recipeUrl:
      webLink(recipe.sourceUrl) ??
      webLink(recipe.spoonacularSourceUrl) ??
      `https://spoonacular.com/recipes/-${recipe.id}`,
    ingredients,
    readyInMinutes:
      typeof recipe.readyInMinutes === "number" ? recipe.readyInMinutes : null,
  };
}

function isEasy(idea: MealIdea): boolean {
  if (SKIPPED_MEAT.test(idea.name)) return false;
  if (idea.ingredients.some((i) => SKIPPED_MEAT.test(i))) return false;
  if (idea.ingredients.length > MAX_INGREDIENTS) return false;
  if (idea.readyInMinutes !== null && idea.readyInMinutes > MAX_READY_MINUTES) return false;
  return true;
}

/** Easy Indian recipes of one kind from spoonacular. */
export async function fromSpoonacular(kind: IdeaKind): Promise<MealIdea[]> {
  const apiKey = process.env.SPOONACULAR_API_KEY?.trim();
  if (!apiKey) throw new SourceUnavailable("not configured");

  const params = new URLSearchParams({
    cuisine: "Indian",
    type: kind === "breakfast" ? "breakfast" : "main course",
    maxReadyTime: String(MAX_READY_MINUTES),
    excludeIngredients: "beef,pork,lamb,goat,bacon,ham",
    instructionsRequired: "true",
    addRecipeInformation: "true",
    fillIngredients: "true",
    sort: "random",
    number: String(RESULTS_PER_SEARCH),
  });

  // The key goes in a header, not the URL, so it never shows up in logs.
  const res = await fetch(`${API}/recipes/complexSearch?${params}`, {
    headers: { "x-api-key": apiKey },
    next: { revalidate: HOUR },
    signal: AbortSignal.timeout(8000),
  });
  if (res.status === 402) throw new SourceUnavailable("daily quota used up");
  if (res.status === 401 || res.status === 403) throw new SourceUnavailable("API key rejected");
  if (!res.ok) throw new Error(`spoonacular ${res.status}`);

  const body = (await res.json()) as SearchResponse;
  return (body.results ?? [])
    .map((recipe) => toIdea(recipe, kind))
    .filter((idea): idea is MealIdea => idea !== null && isEasy(idea));
}
