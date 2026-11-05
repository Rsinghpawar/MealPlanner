import type { DayName, DayPlan, MealType } from "@/data/mealPlan";
import { MEAL_ICONS, REMINDER_ICONS } from "@/data/mealPlan";
import { withFoodEmojis } from "@/lib/foodEmoji";
import { parseRecipeLink } from "@/lib/recipeLink";

export interface FormatOptions {
  /** Add 🥞 🍚 🥗 ... in front of each dish. */
  foodEmojis: boolean;
  /** Put each meal's recipe video link under it. */
  recipeLinks: boolean;
}

const RECIPE_ICON = "▶️"; // ▶️

/** True when at least one meal of the day has a usable recipe link. */
export function hasRecipeLinks(dayPlan: DayPlan): boolean {
  return dayPlan.meals.some((meal) => parseRecipeLink(meal.recipeUrl) !== null);
}

/** Just the recipe links, e.g. to go with a shared image. */
export function formatRecipeLinks(dayPlan: DayPlan): string {
  return dayPlan.meals
    .map((meal) => {
      const link = parseRecipeLink(meal.recipeUrl);
      return link
        ? `${RECIPE_ICON} ${MEAL_LABELS[meal.type]} recipe: ${link.href}`
        : null;
    })
    .filter((line): line is string => line !== null)
    .join("\n");
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

/**
 * Cook's name, put in front of each soak instruction. This is plain text:
 * a pre-filled WhatsApp message can't carry a real @mention. To make it a
 * live tag in a group, retype "@" and pick the contact before sending.
 */
const COOK_MENTION = "@Surya";

const NEXT_DAY: Record<DayName, string> = {
  Monday: "Tuesday",
  Tuesday: "Wednesday",
  Wednesday: "Thursday",
  Thursday: "Friday",
  Friday: "Saturday",
  Saturday: "Sunday",
};

/** "Soak Moong Dal tonight → Wednesday breakfast", sent on Tuesday, reads "→ tomorrow breakfast". */
function nextDayAsTomorrow(text: string, day: DayName): string {
  return text.replace(new RegExp(`\\b${NEXT_DAY[day]}\\b`, "g"), "tomorrow");
}

/**
 * Reminder text is stored as HTML (e.g. "Soak <strong>Rajma</strong> tonight").
 * Turn bold into WhatsApp bold (*Rajma*) and drop any other markup.
 */
function htmlToWhatsApp(html: string): string {
  return html
    .replace(/<(strong|b)>\s*([\s\S]*?)\s*<\/\1>/gi, "*$2*")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * Formats a DayPlan into shareable plain-text (WhatsApp-friendly).
 * Meals (each with its recipe link, if any), then tonight's soak reminders.
 * No day/week heading or stock reminders, to keep it short for the cook.
 */
export function formatMealText(
  dayPlan: DayPlan,
  options: FormatOptions = { foodEmojis: false, recipeLinks: true }
): string {
  const mealLines = dayPlan.meals.map((meal) => {
    const name = options.foodEmojis ? withFoodEmojis(meal.name) : meal.name;
    const line = `${MEAL_ICONS[meal.type]} ${MEAL_LABELS[meal.type]}: ${name}`;
    const link = options.recipeLinks ? parseRecipeLink(meal.recipeUrl) : null;
    return link ? `${line}\n${RECIPE_ICON} Recipe: ${link.href}` : line;
  });

  const soakLines = (dayPlan.reminders ?? [])
    .filter((r) => r.type === "soak")
    .map((r) => nextDayAsTomorrow(htmlToWhatsApp(r.text), dayPlan.day))
    .filter((text) => text.length > 0)
    .map((text) => `${REMINDER_ICONS.soak} ${COOK_MENTION} ${text}`);

  return [...mealLines, ...soakLines].join("\n\n");
}
