export type MealType = "breakfast" | "lunch" | "dinner";

export type ReminderType = "soak" | "stock";

export type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export type Difficulty = "easy" | "medium" | "hard";

export interface Meal {
  type: MealType;
  name: string;
  note?: string;
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
      { type: "breakfast", name: "Moong Dal + Veg + Paneer Cheela", note: "Moong dal soaked last night \u00B7 3 cheelas each" },
      { type: "lunch", name: "Rice + Dal Fry + Egg Bhurji", note: "Toor dal with mustard tadka \u00B7 2 eggs per person" },
      { type: "dinner", name: "Matar Paneer + Roti", note: "4 rotis each \u00B7 medium gravy" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Chole</strong> tonight \u2192 Tuesday lunch" },
      { type: "stock", text: "Check stock: <strong>Paneer, Matar</strong> for tonight\u2019s dinner" },
    ],
  },
  {
    day: "Tuesday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Sattu Paratha + Curd", note: "2 parathas each \u00B7 sattu filling with onion + ajwain" },
      { type: "lunch", name: "Rice + Chole + Egg Bhurji", note: "Chole soaked last night \u00B7 2 eggs per person" },
      { type: "dinner", name: "Egg Curry + Rice", note: "2 eggs each \u00B7 onion-tomato gravy" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Moong Dal</strong> tonight \u2192 Wednesday breakfast (Besan Cheela day uses soaked dal for batter)" },
      { type: "stock", text: "Check stock: <strong>Paneer</strong> for Wed breakfast \u00B7 <strong>Mushrooms</strong> for Wed lunch \u00B7 <strong>Chicken</strong> for Thu dinner \u00B7 order if needed" },
    ],
  },
  {
    day: "Wednesday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Besan Cheela + Paneer Stuffing", note: "Spiced crumbled paneer filling \u00B7 mint chutney" },
      { type: "lunch", name: "Rice + Mushroom Gravy + Egg Bhurji", note: "Button mushroom gravy \u00B7 2 eggs per person \u00B7 hearty combo" },
      { type: "dinner", name: "Aloo Matar + Roti + Paneer Bhurji", note: "Dry sabzi \u00B7 scrambled paneer \u00B7 3\u20134 rotis each" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Chicken</strong> needed tomorrow \u00B7 order today if not in stock" },
    ],
  },
  {
    day: "Thursday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Paneer Bhurji + Roti", note: "Scrambled paneer with onion, tomato, capsicum \u00B7 2 rotis" },
      { type: "lunch", name: "Rice + Palak Dal + Boiled Egg Salad", note: "Moong dal + chopped palak \u00B7 sliced boiled eggs with lemon" },
      { type: "dinner", name: "Chicken Curry + Rice", note: "Simple onion-tomato base \u00B7 250g per person" },
    ],
  },
  {
    day: "Friday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Egg Sandwich", note: "Toasted bread \u00B7 fried/scrambled egg \u00B7 chutney or ketchup" },
      { type: "lunch", name: "Rice + Egg Curry", note: "Simple onion-tomato egg curry \u00B7 2 eggs per person" },
      { type: "dinner", name: "Matar Paneer + Rice", note: "Comfort end-of-week meal" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Rajma</strong> tonight \u2192 Saturday lunch" },
      { type: "stock", text: "Check stock: <strong>Paneer, Matar</strong> for tonight\u2019s dinner \u00B7 <strong>Chicken</strong> for Sat dinner" },
    ],
  },
  {
    day: "Saturday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Sattu Paratha + Pickle + Curd", note: "Heavier weekend breakfast" },
      { type: "lunch", name: "Rice + Rajma + Curd", note: "Rajma soaked last night" },
      { type: "dinner", name: "Chicken Curry + Roti", note: "Weekend treat \u00B7 same curry base with roti" },
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
      { type: "breakfast", name: "Moong Dal + Veg + Paneer Cheela", note: "Moong dal soaked last night \u00B7 3 cheelas each" },
      { type: "lunch", name: "Rice + Chole + Egg Bhurji", note: "Chole soaked Sat night" },
      { type: "dinner", name: "Egg Curry + Roti", note: "3 eggs each \u00B7 semi-dry style" },
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
      { type: "breakfast", name: "Besan Cheela + Paneer Stuffing", note: "Spiced paneer crumble inside \u00B7 crispy tawa" },
      { type: "lunch", name: "Rice + Rajma + Curd", note: "Rajma soaked last night" },
      { type: "dinner", name: "Chicken Curry + Rice", note: "Midweek protein boost \u00B7 250g per person" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Chole</strong> tonight \u2192 Wednesday lunch" },
      { type: "soak", text: "Soak <strong>Moong Dal</strong> tonight \u2192 Thursday breakfast (Moong Dal Cheela)" },
    ],
  },
  {
    day: "Wednesday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Egg Sandwich", note: "Quick midweek breakfast \u00B7 no prep needed" },
      { type: "lunch", name: "Rice + Chole + Egg Bhurji", note: "Chole soaked last night" },
      { type: "dinner", name: "Matar Paneer + Roti", note: "4 rotis each \u00B7 medium gravy" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Paneer, Matar</strong> for tonight\u2019s dinner \u00B7 <strong>Chicken</strong> for Sat dinner" },
    ],
  },
  {
    day: "Thursday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Paneer Bhurji + Roti", note: "Quick high-protein breakfast \u00B7 2 rotis each" },
      { type: "lunch", name: "Rice + Mixed Veg Sabzi + Dal", note: "Carrots, beans, potato sabzi \u00B7 moong dal \u00B7 comfort meal" },
      { type: "dinner", name: "Aloo Matar + Roti + Paneer Bhurji", note: "Light dry sabzi \u00B7 scrambled paneer \u00B7 3 rotis each" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Moong Dal</strong> tonight \u2192 Friday breakfast (Moong Dal Cheela)" },
      { type: "stock", text: "Check stock: <strong>Paneer</strong> running low? Restock for next week" },
    ],
  },
  {
    day: "Friday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Moong Dal + Veg + Paneer Cheela", note: "Moong dal soaked last night \u00B7 3 cheelas each" },
      { type: "lunch", name: "Rice + Chole + Egg Bhurji", note: "Chole soaked last night" },
      { type: "dinner", name: "Egg Curry + Rice", note: "2 eggs per person \u00B7 rich gravy" },
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
      { type: "breakfast", name: "Sattu Paratha + Pickle + Curd", note: "Weekend special" },
      { type: "lunch", name: "Rice + Rajma + Curd", note: "Rajma soaked last night" },
      { type: "dinner", name: "Chicken Curry + Roti + Salad", note: "Cucumber + onion salad \u00B7 end the week well" },
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
