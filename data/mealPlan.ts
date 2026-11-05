export type MealType = "breakfast" | "lunch" | "dinner";

export type ReminderType = "soak" | "stock";

export type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type Difficulty = "easy" | "medium" | "hard";

export interface Meal {
  type: MealType;
  name: string;
  /** Optional recipe video (YouTube Short / video, Instagram Reel). */
  recipeUrl?: string;
}

export interface Reminder {
  type: ReminderType;
  text: string;
}

export interface DayPlan {
  day: DayName;
  week: number;
  meals: Meal[];
  reminders?: Reminder[];
}

export interface MentionItem {
  title: string;
  description: string;
  difficulty: Difficulty;
  difficultyNote: string;
}

export const MEAL_ICONS: Record<MealType, string> = {
  breakfast: "\u{1F305}",
  lunch: "\u{2600}\u{FE0F}",
  dinner: "\u{1F319}",
};

export const REMINDER_ICONS: Record<ReminderType, string> = {
  soak: "\u{1FAD9}",
  stock: "\u{1F6D2}",
};

export const TAGS = [
  "\u{1F95A} High Protein",
  "\u{1F33F} High Fiber",
  "\u{1F35A} Balanced Carbs",
  "\u{1F468}\u{200D}\u{1F373} Local Cook Friendly",
];

export const mealPlan: DayPlan[] = [
  // ============ WEEK 1 ============
  {
    day: "Monday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Moong Dal Veg Paneer Mix Cheela + Cut fruits" },
      { type: "lunch", name: "Rice/Roti + Dal Fry + Egg Bhurji + Cut Salad" },
      { type: "dinner", name: "Matar Paneer + Roti" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Chole</strong> tonight \u2192 Tuesday lunch" },
      { type: "stock", text: "Check stock: <strong>Paneer, Matar</strong> for tonight\u2019s dinner \u00B7 <strong>Dosa Batter</strong> for Tue breakfast" },
    ],
  },
  {
    day: "Tuesday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Masala Dosa with sambhar + Cut fruits" },
      { type: "lunch", name: "Rice/Roti + Chole + Egg Bhurji + Cut Salad" },
      { type: "dinner", name: "Egg Curry + Rice/Roti" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Moong Dal</strong> tonight \u2192 Wednesday breakfast (Besan Cheela day uses soaked dal for batter)" },
      { type: "stock", text: "Check stock: <strong>Paneer</strong> for Wed breakfast \u00B7 <strong>Mushrooms</strong> for Wed lunch \u00B7 <strong>Peas</strong> for Wed dinner \u00B7 <strong>Palak, Paneer</strong> for Thu dinner" },
    ],
  },
  {
    day: "Wednesday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Besan Cheela + Paneer Stuffing + Cut fruits" },
      { type: "lunch", name: "Rice/Roti + Mushroom Gravy + Egg Bhurji + Cut Salad" },
      { type: "dinner", name: "Aloo Matar + Roti + Paneer Bhurji" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Palak, Paneer</strong> needed tomorrow \u00B7 order today if not in stock" },
    ],
  },
  {
    day: "Thursday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Sprouts salad + Boiled Sweet potatos" },
      { type: "lunch", name: "Rice/Roti + Palak Dal + Boiled Egg Salad + Cut Salad" },
      { type: "dinner", name: "Palak Paneer + Rice/Roti" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Bread, Eggs</strong> for tomorrow breakfast \u00B7 <strong>Paneer, Matar</strong> for tomorrow dinner" },
    ],
  },
  {
    day: "Friday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Egg Sandwich + Boiled Sweet potatos" },
      { type: "lunch", name: "Rice/Roti + Mixed Veg Sabzi + Dal + Cut Salad" },
      { type: "dinner", name: "Matar Paneer + Rice/Roti" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Black Chana</strong> tonight \u2192 Saturday lunch" },
      { type: "stock", text: "Check stock: <strong>Chicken</strong> for Sat dinner" },
    ],
  },
  {
    day: "Saturday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Sattu Paratha + Pickle + Curd + Cut fruits" },
      { type: "lunch", name: "Rice/Roti + Black Chana + Curd + Cut Salad" },
      { type: "dinner", name: "Chicken Curry + Roti" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Chole</strong> tonight \u2192 Monday lunch (Week 2)" },
      { type: "soak", text: "Soak <strong>Moong Dal</strong> tonight \u2192 Monday breakfast (Moong Dal Cheela)" },
    ],
  },

  // ============ WEEK 2 ============
  {
    day: "Monday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Moong Dal Veg Paneer Mix Cheela + Cut fruits" },
      { type: "lunch", name: "Rice/Roti + Chole + Egg Bhurji + Cut Salad" },
      { type: "dinner", name: "Egg Curry + Roti" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Rajma</strong> tonight \u2192 Tuesday lunch" },
      { type: "stock", text: "Check stock: <strong>Paneer</strong> for Tue breakfast \u00B7 <strong>Chicken</strong> for Tue dinner" },
    ],
  },
  {
    day: "Tuesday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Besan Cheela + Paneer Stuffing + Cut fruits" },
      { type: "lunch", name: "Rice/Roti + Rajma + Curd + Cut Salad" },
      { type: "dinner", name: "Chicken Curry + Rice/Roti" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Paneer, Capsicum</strong> for Wed breakfast \u00B7 <strong>Loki, Eggs</strong> for Wed lunch \u00B7 <strong>Peas, Paneer</strong> for Wed dinner" },
    ],
  },
  {
    day: "Wednesday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Paneer Bhurji + Roti + Cut fruits" },
      { type: "lunch", name: "Loki kofte gravy + Egg bhurji + Rice/Roti + Cut Salad" },
      { type: "dinner", name: "Matar Paneer + Roti" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Paneer, Matar</strong> for tonight\u2019s dinner \u00B7 <strong>Bread</strong> for Thu breakfast \u00B7 <strong>Eggs</strong> for Thu lunch \u00B7 <strong>Peas, Paneer</strong> for Thu dinner" },
    ],
  },
  {
    day: "Thursday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Egg Sandwich + Boiled Sweet potatos" },
      { type: "lunch", name: "Rice/Roti + Egg Curry + Cut Salad" },
      { type: "dinner", name: "Aloo Matar + Roti + Paneer Bhurji" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Moong Dal</strong> tonight \u2192 Friday breakfast" },
      { type: "stock", text: "Check stock: <strong>Paneer</strong> for tomorrow breakfast" },
    ],
  },
  {
    day: "Friday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Moong Dal Veg Paneer Mix Cheela + Cut fruits" },
      { type: "lunch", name: "Rice/Roti + Chole + Egg Bhurji + Cut Salad" },
      { type: "dinner", name: "Egg Curry + Rice/Roti" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Rajma</strong> tonight \u2192 Saturday lunch" },
      { type: "stock", text: "Check stock: <strong>Chicken</strong> for tomorrow\u2019s dinner \u00B7 order today" },
    ],
  },
  {
    day: "Saturday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Sattu Paratha + Pickle + Curd + Cut fruits" },
      { type: "lunch", name: "Rice/Roti + Rajma + Curd + Cut Salad" },
      { type: "dinner", name: "Chicken Curry + Roti + Salad" },
    ],
  },
];

export const mentions: MentionItem[] = [
  {
    title: "Egg & Veggie Fried Rice",
    description:
      "Use leftover rice from the previous day. Scramble eggs in, add chopped carrots, peas, capsicum, and soy sauce. Cook needs to use high flame and not over-stir \u2014 that\u2019s the only real trick here.",
    difficulty: "medium",
    difficultyNote: "needs high flame technique",
  },
  {
    title: "Ragi / Bajra Roti + Dal",
    description:
      "Swap wheat roti with bajra or ragi 2\u20133 days a week. Much higher fiber and minerals. These doughs are stickier and harder to roll thin \u2014 worth a few dedicated practice sessions with the cook.",
    difficulty: "hard",
    difficultyNote: "dough handling is tricky",
  },
  {
    title: "Chicken Keema + Roti",
    description:
      "Minced chicken with peas and spices. More flavorful than curry and higher protein density. Cook needs to ensure keema is fully cooked through. Great Saturday dinner upgrade.",
    difficulty: "medium",
    difficultyNote: "doneness check needed",
  },
  {
    title: "Chana + Boiled Egg Salad (Side)",
    description:
      "Boiled white chana + sliced boiled eggs + onion + tomato + lemon + chaat masala. No active cooking once chana is boiled. A great add-on to any lunch to bump up protein without extra effort.",
    difficulty: "easy",
    difficultyNote: "no cooking needed",
  },
];
