import { NextResponse } from "next/server";
import type {
  IdeaKind,
  IdeaSource,
  MealIdea,
  MealIdeasResponse,
  SourceStatus,
} from "@/lib/mealIdeas";
import { DAY, HOUR, SourceUnavailable } from "@/lib/mealIdeaSources/shared";
import { fromSpoonacular } from "@/lib/mealIdeaSources/spoonacular";
import { fromTheMealDB } from "@/lib/mealIdeaSources/themealdb";

/**
 * Easy Indian dishes found online, for the Shuffle suggestions on today's
 * card: TheMealDB (always) plus spoonacular (when SPOONACULAR_API_KEY is
 * set). One source failing still returns the other's ideas.
 *
 *   GET /api/meal-ideas?for=breakfast   breakfast ideas
 *   GET /api/meal-ideas?for=main        lunch / dinner ideas
 *
 * The response lists each source's status, so opening this URL shows
 * whether spoonacular is working ("not configured", "daily quota used up").
 */

/** "Matar Paneer" and "matar paneer!" are the same dish. */
function squash(text: string): string {
  return text.toLowerCase().replace(/[^a-z]/g, "");
}

async function collect(
  load: () => Promise<MealIdea[]>
): Promise<{ ideas: MealIdea[]; status: SourceStatus }> {
  try {
    const ideas = await load();
    return { ideas, status: { ok: true, count: ideas.length } };
  } catch (err) {
    if (err instanceof SourceUnavailable) {
      return { ideas: [], status: { ok: false, count: 0, error: err.message } };
    }
    console.error("Meal idea source failed:", err);
    return { ideas: [], status: { ok: false, count: 0, error: "request failed" } };
  }
}

export async function GET(request: Request) {
  const param = new URL(request.url).searchParams.get("for");
  const kinds: IdeaKind[] =
    param === "breakfast" ? ["breakfast"] : param === "main" ? ["main"] : ["breakfast", "main"];

  const [mealdb, ...spoonacular] = await Promise.all([
    collect(async () => {
      const all = await fromTheMealDB();
      return all.filter((idea) =>
        kinds.some((kind) =>
          kind === "breakfast"
            ? idea.mealTypes.includes("breakfast")
            : idea.mealTypes.includes("lunch")
        )
      );
    }),
    ...kinds.map((kind) => collect(() => fromSpoonacular(kind))),
  ]);

  const spoonacularStatus: SourceStatus = spoonacular.every((s) => s.status.ok)
    ? { ok: true, count: spoonacular.reduce((n, s) => n + s.ideas.length, 0) }
    : spoonacular.find((s) => !s.status.ok)!.status;

  // TheMealDB first: on a duplicate name its copy (with a YouTube video) wins.
  const seen = new Set<string>();
  const ideas: MealIdea[] = [];
  for (const idea of [...mealdb.ideas, ...spoonacular.flatMap((s) => s.ideas)]) {
    const key = squash(idea.name);
    if (seen.has(key)) continue;
    seen.add(key);
    ideas.push(idea);
  }
  ideas.sort((a, b) => a.name.localeCompare(b.name));

  // Counts after de-duplication: what each source actually adds.
  const countFrom = (source: IdeaSource) => ideas.filter((i) => i.source === source).length;
  const sources: Partial<Record<IdeaSource, SourceStatus>> = {
    TheMealDB: { ...mealdb.status, count: countFrom("TheMealDB") },
    spoonacular: { ...spoonacularStatus, count: countFrom("spoonacular") },
  };
  const body: MealIdeasResponse = { ideas, sources };

  if (!mealdb.status.ok && !spoonacularStatus.ok) {
    return NextResponse.json(body, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  // spoonacular's terms allow caching its results for at most an hour. When
  // it's set up but failed (quota used up), also retry within the hour.
  const spoonacularConfigured = spoonacularStatus.error !== "not configured";
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": spoonacularConfigured
        ? `public, s-maxage=${HOUR}`
        : `public, s-maxage=${DAY}, stale-while-revalidate=${7 * DAY}`,
    },
  });
}
