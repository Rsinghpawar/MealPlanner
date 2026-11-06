/** Helpers shared by the online meal-idea sources (server only). */

/** "Not very technical": short ingredient lists only. */
export const MAX_INGREDIENTS = 16;

/** Meats this household's plan doesn't use. */
export const SKIPPED_MEAT = /\b(beef|pork|lamb|mutton|goat|bacon|ham|veal)\b/i;

export const HOUR = 60 * 60;
export const DAY = 24 * HOUR;

/** Only plain http(s) links get through. */
export function webLink(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  return trimmed && /^https?:\/\//i.test(trimmed) ? trimmed : null;
}

/** A source failing in an expected way (no key, quota used up); logged quietly. */
export class SourceUnavailable extends Error {}
