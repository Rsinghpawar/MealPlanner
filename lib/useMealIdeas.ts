import { useEffect, useState } from "react";
import type { IdeaKind, IdeaSource, MealIdea, MealIdeasResponse } from "@/lib/mealIdeas";

// One request per kind (breakfast / main) per page load, shared by every
// Shuffle panel. Only the kind being shuffled is fetched, which keeps
// spoonacular's daily quota for the meals people actually shuffle.
const pending = new Map<IdeaKind, Promise<MealIdeasResponse>>();

function loadIdeas(kind: IdeaKind): Promise<MealIdeasResponse> {
  let request = pending.get(kind);
  if (!request) {
    request = fetch(`/api/meal-ideas?for=${kind}`)
      .then((res) => {
        if (!res.ok) throw new Error(`meal ideas ${res.status}`);
        return res.json() as Promise<MealIdeasResponse>;
      })
      .catch((err) => {
        pending.delete(kind); // let the next Shuffle try again
        throw err;
      });
    pending.set(kind, request);
  }
  return request;
}

export type MealIdeasState =
  | { status: "loading"; ideas: []; sources: [] }
  | { status: "ready"; ideas: MealIdea[]; sources: IdeaSource[] }
  | { status: "error"; ideas: []; sources: [] };

/** Online meal ideas of one kind, fetched the first time a Shuffle panel opens. */
export function useMealIdeas(kind: IdeaKind): MealIdeasState {
  const [state, setState] = useState<MealIdeasState>({
    status: "loading",
    ideas: [],
    sources: [],
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", ideas: [], sources: [] });
    loadIdeas(kind).then(
      (body) => {
        if (cancelled) return;
        // Sources that actually contributed ideas, for the credit line.
        const used = (Object.keys(body.sources) as IdeaSource[]).filter(
          (source) => (body.sources[source]?.count ?? 0) > 0
        );
        setState({ status: "ready", ideas: body.ideas, sources: used });
      },
      () => !cancelled && setState({ status: "error", ideas: [], sources: [] })
    );
    return () => {
      cancelled = true;
    };
  }, [kind]);

  return state;
}
