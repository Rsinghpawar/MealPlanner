import { useEffect, useState } from "react";
import type { MealIdea, MealIdeasResponse } from "@/lib/mealIdeas";

// One request per page load, shared by every Shuffle panel.
let pending: Promise<MealIdea[]> | null = null;

function loadIdeas(): Promise<MealIdea[]> {
  if (!pending) {
    pending = fetch("/api/meal-ideas")
      .then((res) => {
        if (!res.ok) throw new Error(`meal ideas ${res.status}`);
        return res.json() as Promise<MealIdeasResponse>;
      })
      .then((body) => body.ideas)
      .catch((err) => {
        pending = null; // let the next Shuffle try again
        throw err;
      });
  }
  return pending;
}

export type MealIdeasState =
  | { status: "loading"; ideas: [] }
  | { status: "ready"; ideas: MealIdea[] }
  | { status: "error"; ideas: [] };

/** Online meal ideas, fetched the first time a Shuffle panel opens. */
export function useMealIdeas(enabled: boolean): MealIdeasState {
  const [state, setState] = useState<MealIdeasState>({ status: "loading", ideas: [] });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    loadIdeas().then(
      (ideas) => !cancelled && setState({ status: "ready", ideas }),
      () => !cancelled && setState({ status: "error", ideas: [] })
    );
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return state;
}
