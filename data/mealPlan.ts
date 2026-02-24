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
      { type: "breakfast", name: "Moong Dal + Veg + Paneer Cheela + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Moong dal soaked last night \u00B7 3 cheelas each" },
      { type: "lunch", name: "Rice/Roti + Dal Fry + Egg Bhurji + Cut Salad (Cucumber, Amla)", note: "Toor dal with mustard tadka \u00B7 2 eggs per person" },
      { type: "dinner", name: "Matar Paneer + Roti", note: "4 rotis each \u00B7 medium gravy" },
    ],
    reminders: [
      { type: "soak", text: "Soak <strong>Chole</strong> and <strong>Dosa Batter</strong> tonight \u2192 Tuesday meals" },
      { type: "stock", text: "Check stock: <strong>Paneer, Matar</strong> for tonight\u2019s dinner" },
    ],
  },
  {
    day: "Tuesday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Masala Dosa with sambhar + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Dosa batter prepped last night" },
      { type: "lunch", name: "Rice/Roti + Chole + Egg Bhurji + Cut Salad (Cucumber, Amla)", note: "Chole soaked last night \u00B7 2 eggs per person" },
      { type: "dinner", name: "Egg Curry + Rice/Roti", note: "2 eggs each \u00B7 onion-tomato gravy" },
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
      { type: "breakfast", name: "Besan Cheela + Paneer Stuffing + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Spiced crumbled paneer filling \u00B7 mint chutney" },
      { type: "lunch", name: "Rice/Roti + Mushroom Gravy + Egg Bhurji + Cut Salad (Cucumber, Amla)", note: "Button mushroom gravy \u00B7 2 eggs per person \u00B7 hearty combo" },
      { type: "dinner", name: "Aloo Matar + Roti + Paneer Bhurji", note: "Dry sabzi \u00B7 scrambled paneer \u00B7 3\u20134 rotis each" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Palak, Paneer</strong> needed tomorrow \u00B7 order today if not in stock" },
    ],
  },
  {
    day: "Thursday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Sprouts salad + Boiled Sweet potatos", note: "Light healthy breakfast" },
      { type: "lunch", name: "Rice/Roti + Palak Dal + Boiled Egg Salad + Cut Salad (Cucumber, Amla)", note: "Moong dal + chopped palak \u00B7 sliced boiled eggs with lemon" },
      { type: "dinner", name: "Palak Paneer + Rice/Roti", note: "Healthy replacing chicken curry" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Bread, Eggs</strong> for tomorrow breakfast \u00B7 <strong>Paneer, Matar</strong> for tomorrow dinner" },
    ],
  },
  {
    day: "Friday",
    week: 1,
    meals: [
      { type: "breakfast", name: "Egg Sandwich + Boiled Sweet potatos", note: "Quick midweek breakfast \u00B7 no prep needed" },
      { type: "lunch", name: "Rice/Roti + Mixed Veg Sabzi + Dal + Cut Salad (Cucumber, Amla)", note: "Carrots, beans, potato sabzi \u00B7 moong dal" },
      { type: "dinner", name: "Matar Paneer + Rice/Roti", note: "Comfort end-of-week meal" },
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
      { type: "breakfast", name: "Sattu Paratha + Pickle + Curd + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Heavier weekend breakfast" },
      { type: "lunch", name: "Rice/Roti + Black Chana + Curd + Cut Salad (Cucumber, Amla)", note: "Black Chana soaked last night" },
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
      { type: "breakfast", name: "Moong Dal + Veg + Paneer Cheela + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Moong dal soaked last night \u00B7 3 cheelas each" },
      { type: "lunch", name: "Rice/Roti + Chole + Egg Bhurji + Cut Salad (Cucumber, Amla)", note: "Chole soaked Sat night" },
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
      { type: "breakfast", name: "Besan Cheela + Paneer Stuffing + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Spiced paneer crumble inside \u00B7 crispy tawa" },
      { type: "lunch", name: "Rice/Roti + Rajma + Curd + Cut Salad (Cucumber, Amla)", note: "Rajma soaked last night" },
      { type: "dinner", name: "Chicken Curry + Rice/Roti", note: "Midweek protein boost \u00B7 250g per person" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Paneer, Capsicum</strong> for Wed breakfast \u00B7 <strong>Loki, Eggs</strong> for Wed lunch \u00B7 <strong>Peas, Paneer</strong> for Wed dinner" },
    ],
  },
  {
    day: "Wednesday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Paneer Bhurji + Roti + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Scrambled paneer with onion, tomato, capsicum \u00B7 2 rotis" },
      { type: "lunch", name: "Loki kofte gravy + Egg bhurji + Rice/Roti + Cut Salad (Cucumber, Amla)", note: "New meal addition" },
      { type: "dinner", name: "Matar Paneer + Roti", note: "4 rotis each \u00B7 medium gravy" },
    ],
    reminders: [
      { type: "stock", text: "Check stock: <strong>Paneer, Matar</strong> for tonight\u2019s dinner \u00B7 <strong>Bread</strong> for Thu breakfast \u00B7 <strong>Eggs</strong> for Thu lunch \u00B7 <strong>Peas, Paneer</strong> for Thu dinner" },
    ],
  },
  {
    day: "Thursday",
    week: 2,
    meals: [
      { type: "breakfast", name: "Egg Sandwich + Boiled Sweet potatos", note: "Light healthy breakfast" },
      { type: "lunch", name: "Rice/Roti + Egg Curry + Cut Salad (Cucumber, Amla)", note: "Simple onion-tomato egg curry \u00B7 2 eggs per person" },
      { type: "dinner", name: "Aloo Matar + Roti + Paneer Bhurji", note: "Light dry sabzi \u00B7 scrambled paneer \u00B7 3 rotis each" },
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
      { type: "breakfast", name: "Moong Dal + Veg + Paneer Cheela + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Moong dal soaked last night \u00B7 3 cheelas each" },
      { type: "lunch", name: "Rice/Roti + Chole + Egg Bhurji + Cut Salad (Cucumber, Amla)", note: "Chole soaked last night" },
      { type: "dinner", name: "Egg Curry + Rice/Roti", note: "2 eggs per person \u00B7 rich gravy" },
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
      { type: "breakfast", name: "Sattu Paratha + Pickle + Curd + Cut fruits (Papaya, Watermelon, Pineapple - whichever available)", note: "Weekend special" },
      { type: "lunch", name: "Rice/Roti + Rajma + Curd + Cut Salad (Cucumber, Amla)", note: "Rajma soaked last night" },
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
