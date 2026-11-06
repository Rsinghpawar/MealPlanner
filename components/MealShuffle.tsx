"use client";

import { useMemo, useState } from "react";
import type { DayPlan, Meal } from "@/data/mealPlan";
import { useDisplayPrefs } from "@/lib/DisplayPrefs";
import { formatSwapMessage } from "@/lib/formatMealText";
import {
  onlineOptions,
  planOptions,
  shuffled,
  suggestionPair,
  type Suggestion,
} from "@/lib/mealSuggestions";
import { ideaKind, SOURCE_LINKS } from "@/lib/mealIdeas";
import { parseRecipeLink } from "@/lib/recipeLink";
import { useMealIdeas } from "@/lib/useMealIdeas";
import MealName from "./MealName";
import RecipeLinkChip from "./RecipeLinkChip";

interface MealShuffleProps {
  meal: Meal;
  /** The whole plan, to suggest other days' meals. */
  days: DayPlan[];
  label: string;
  onClose: () => void;
}

/**
 * Two alternatives for one of today's meals: one from the household's plan
 * and one easy Indian dish found online (TheMealDB, plus spoonacular when it's
 * set up). "Shuffle again" moves to the next
 * pair; the order is shuffled once per opening, so nothing repeats until
 * every option has been shown.
 */
export default function MealShuffle({ meal, days, label, onClose }: MealShuffleProps) {
  const ideas = useMealIdeas(ideaKind(meal.type));
  const [round, setRound] = useState(0);

  const plan = useMemo(() => shuffled(planOptions(days, meal)), [days, meal]);
  const online = useMemo(
    () => shuffled(onlineOptions(ideas.ideas, meal, days)),
    [ideas.ideas, meal, days]
  );

  // While online ideas load, show the plan suggestion with a placeholder.
  const pair: Suggestion[] =
    ideas.status === "loading"
      ? plan.length > 0
        ? [plan[round % plan.length]]
        : []
      : suggestionPair(plan, online, round);
  const total = ideas.status === "loading" ? plan.length : plan.length + online.length;

  return (
    <div
      role="region"
      aria-label={`Other ideas for ${label.toLowerCase()}`}
      className="mt-2 rounded-lg border border-line bg-surface p-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold text-ink-muted leading-snug">
          Not feeling it? Try one of these for {label.toLowerCase()}:
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close suggestions"
          className="shrink-0 -mt-0.5 rounded-full w-6 h-6 text-ink-muted hover:bg-surface-2 text-[16px] leading-none"
        >
          {"×"}
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {pair.map((suggestion) => (
          <SuggestionCard
            key={suggestion.kind === "plan" ? `plan-${suggestion.meal.name}` : `online-${suggestion.idea.id}`}
            suggestion={suggestion}
            current={meal}
          />
        ))}

        {ideas.status === "loading" && (
          <div className="rounded-lg bg-surface-2 px-3 py-2.5 text-[12px] text-ink-muted animate-pulse">
            {"\u{1F310}"} Finding an easy Indian dish online{"…"}
          </div>
        )}
        {ideas.status === "error" && (
          <p className="text-[11px] text-ink-muted">
            Couldn&apos;t reach the online recipe site, so both ideas are from your plan.
          </p>
        )}
        {pair.length === 0 && ideas.status !== "loading" && (
          <p className="text-[12px] text-ink-muted">No other ideas for this meal yet.</p>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setRound((r) => r + 1)}
          disabled={total <= pair.length}
          className="inline-flex items-center gap-1.5 rounded-full bg-forest text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-forest/90 disabled:opacity-40 transition-colors"
        >
          <ShuffleIcon />
          Shuffle again
        </button>
        {ideas.sources.length > 0 && (
          // Credit line; spoonacular's free plan requires a link back.
          <p className="text-[10px] text-ink-muted text-right">
            Online ideas:{" "}
            {ideas.sources.map((source, i) => (
              <span key={source}>
                {i > 0 && " \u00B7 "}
                <a
                  href={SOURCE_LINKS[source].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {SOURCE_LINKS[source].label}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

function SuggestionCard({ suggestion, current }: { suggestion: Suggestion; current: Meal }) {
  const { foodEmojis } = useDisplayPrefs();

  const isPlan = suggestion.kind === "plan";
  const name = isPlan ? suggestion.meal.name : suggestion.idea.name;
  const video = parseRecipeLink(isPlan ? suggestion.meal.recipeUrl : suggestion.idea.youtube);
  const written = isPlan ? null : parseRecipeLink(suggestion.idea.recipeUrl);
  const shareLink = video?.href ?? written?.href ?? null;

  function sendToCook() {
    const text = formatSwapMessage(current.type, name, current.name, shareLink, foodEmojis);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2.5 flex gap-2.5">
      {!isPlan && suggestion.idea.thumbnail && (
        <img
          src={suggestion.idea.thumbnail}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          className="shrink-0 w-12 h-12 rounded-md object-cover bg-line-soft"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
          {isPlan
            ? `\u{1F4CB} From your plan · ${suggestion.day.slice(0, 3)}, week ${suggestion.week}`
            : `\u{1F310} New idea · ${suggestion.idea.category} · ${
                suggestion.idea.readyInMinutes !== null
                  ? `${suggestion.idea.readyInMinutes} min`
                  : `${suggestion.idea.ingredients.length} ingredients`
              }`}
        </p>
        <p className="text-[13px] font-semibold leading-snug mt-0.5">
          <MealName name={name} />
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {video && <RecipeLinkChip link={video} />}
          {written && (
            <RecipeLinkChip
              link={written.platform === "link" ? { ...written, label: "Written recipe" } : written}
            />
          )}
          <button
            type="button"
            onClick={sendToCook}
            className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-[#128C7E] bg-[#25D366]/15 hover:bg-[#25D366]/25 dark:text-[#5ee39a] transition-colors"
          >
            <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true" fill="currentColor">
              <path d="M12.05 2C6.53 2 2.06 6.47 2.06 11.99c0 1.76.46 3.48 1.34 5L2 22l5.13-1.35a9.93 9.93 0 0 0 4.92 1.25h.01c5.52 0 9.99-4.47 9.99-9.99A9.93 9.93 0 0 0 12.05 2zm5.83 14.15c-.25.69-1.44 1.32-2 1.4-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.69-.62-2.97-1.28-4.91-4.27-5.06-4.47-.15-.2-1.21-1.6-1.21-3.06s.77-2.17 1.04-2.47c.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.25.59.84 2.05.92 2.2.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.06 1.14 1.01 2.09 1.33 2.39 1.48.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.07.12.07.71-.17 1.4z" />
            </svg>
            Send to cook
          </button>
        </div>
      </div>
    </div>
  );
}

export function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}
