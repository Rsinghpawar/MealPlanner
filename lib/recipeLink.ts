/**
 * Recipe video links (YouTube Shorts / videos, Instagram Reels) attached to a
 * meal. Links are typed in by editors and shown to everyone, so only plain
 * http(s) URLs are ever turned into links.
 */

export type RecipePlatform =
  | "youtube-short"
  | "youtube"
  | "instagram-reel"
  | "instagram"
  | "link";

export interface RecipeLink {
  href: string;
  platform: RecipePlatform;
  /** "YouTube Short", "Instagram Reel", ... */
  label: string;
}

const LABELS: Record<RecipePlatform, string> = {
  "youtube-short": "YouTube Short",
  youtube: "YouTube video",
  "instagram-reel": "Instagram Reel",
  instagram: "Instagram post",
  link: "Recipe link",
};

/** Parses a stored link. Returns null for anything that isn't a usable web link. */
export function parseRecipeLink(url: string | undefined | null): RecipeLink | null {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (!parsed.hostname.includes(".")) return null;

  const host = parsed.hostname.toLowerCase().replace(/^(www|m)\./, "");
  const path = parsed.pathname.toLowerCase();

  let platform: RecipePlatform = "link";
  if (host === "youtube.com" || host === "youtu.be") {
    platform = path.startsWith("/shorts/") ? "youtube-short" : "youtube";
  } else if (host === "instagram.com") {
    platform = /^\/(reel|reels)\//.test(path) ? "instagram-reel" : "instagram";
  }

  return { href: parsed.toString(), platform, label: LABELS[platform] };
}

/**
 * Cleans up what an editor typed: trims it and adds https:// when it was
 * pasted without one ("youtube.com/shorts/..."). Returns "" for an empty
 * field and null when it can't be a link.
 */
export function normalizeRecipeInput(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed === "") return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return parseRecipeLink(withScheme)?.href ?? null;
}
