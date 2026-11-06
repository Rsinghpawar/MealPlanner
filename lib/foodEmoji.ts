/**
 * Picks a food emoji for each dish in a meal name, so
 * "Rice/Roti + Dal Fry + Egg Bhurji" reads "🍚 Rice/Roti + 🍲 Dal Fry + 🍳 Egg Bhurji".
 * Purely decorative: worked out from the name, never stored.
 */

/** First match wins, so the more specific rules come first. */
const RULES: [RegExp, string][] = [
  [/sandwich/i, "\u{1F96A}"], // 🥪
  [/cheela|chilla|dosa|uttapam|pancake/i, "\u{1F95E}"], // 🥞
  [/egg bhurji|omelet/i, "\u{1F373}"], // 🍳
  [/chicken/i, "\u{1F357}"], // 🍗
  [/fish|prawn|shrimp/i, "\u{1F41F}"], // 🐟
  [/baingan|brinjal|eggplant/i, "\u{1F346}"], // 🍆
  [/\beggs?\b/i, "\u{1F95A}"], // 🥚
  [/sweet potato/i, "\u{1F360}"], // 🍠
  [/kofte|kofta/i, "\u{1F9C6}"], // 🧆
  [/mushroom/i, "\u{1F344}"], // 🍄
  [/palak|spinach|saag/i, "\u{1F96C}"], // 🥬
  [/paneer/i, "\u{1F9C0}"], // 🧀
  [/sprout/i, "\u{1F331}"], // 🌱
  [/chole|chana|rajma|beans|lobia/i, "\u{1FAD8}"], // 🫘
  [/\bdaa?l\b|sambh?ar/i, "\u{1F372}"], // 🍲
  [/rice|pulao|biryani|khichdi/i, "\u{1F35A}"], // 🍚
  [/paratha|roti|chapati|naan|phulka/i, "\u{1FAD3}"], // 🫓
  [/aloo|potato/i, "\u{1F954}"], // 🥔
  [/fruit/i, "\u{1F349}"], // 🍉
  [/salad|cucumber/i, "\u{1F957}"], // 🥗
  [/curd|raita|yogh?urt|dahi/i, "\u{1F963}"], // 🥣
  [/pickle|achar/i, "\u{1F336}\u{FE0F}"], // 🌶️ (not 🫙: that's the soak reminder icon)
  [/\bveg|sabzi|sabji/i, "\u{1F966}"], // 🥦
  [/curry|gravy/i, "\u{1F35B}"], // 🍛
];

const STARTS_WITH_EMOJI = /^\p{Extended_Pictographic}/u;

export interface Dish {
  name: string;
  /** null when nothing matched, or the name already starts with an emoji */
  emoji: string | null;
}

/** Splits "A + B + C" into dishes, each with its emoji. */
export function splitDishes(mealName: string): Dish[] {
  return mealName
    .split(/\s+\+\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((name) => ({
      name,
      emoji: STARTS_WITH_EMOJI.test(name)
        ? null
        : RULES.find(([pattern]) => pattern.test(name))?.[1] ?? null,
    }));
}

/** The meal name with emojis, as plain text (for shared messages). */
export function withFoodEmojis(mealName: string): string {
  return splitDishes(mealName)
    .map((dish) => (dish.emoji ? `${dish.emoji} ${dish.name}` : dish.name))
    .join(" + ");
}
