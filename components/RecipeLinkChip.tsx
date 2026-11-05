import type { RecipeLink, RecipePlatform } from "@/lib/recipeLink";

const CHIP_STYLES: Record<RecipePlatform, string> = {
  "youtube-short": "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  youtube: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  "instagram-reel": "bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  instagram: "bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  link: "bg-surface-2 text-ink-muted",
};

/** "▶ YouTube Short" pill that opens the recipe video in a new tab / the app. */
export default function RecipeLinkChip({ link }: { link: RecipeLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold hover:opacity-80 transition-opacity ${CHIP_STYLES[link.platform]}`}
    >
      <RecipeIcon platform={link.platform} />
      {link.label}
    </a>
  );
}

export function RecipeIcon({ platform }: { platform: RecipePlatform }) {
  if (platform === "instagram-reel" || platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (platform === "link") {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
      </svg>
    );
  }
  // YouTube
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  );
}
