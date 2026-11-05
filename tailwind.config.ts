import type { Config } from "tailwindcss";

/** A colour that switches between light and dark (see app/globals.css). */
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#2d6a4f",
        // Theme-aware surfaces and text
        page: token("page"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        field: token("field"),
        line: token("line"),
        "line-soft": token("line-soft"),
        ink: token("ink"),
        "ink-muted": token("ink-muted"),
        accent: token("accent"),
        header: token("header"),
        // Meals
        "meal-breakfast": token("meal-breakfast"),
        "meal-lunch": token("meal-lunch"),
        "meal-dinner": token("meal-dinner"),
        "meal-breakfast-bg": token("meal-breakfast-bg"),
        "meal-lunch-bg": token("meal-lunch-bg"),
        "meal-dinner-bg": token("meal-dinner-bg"),
        // Reminders
        "soak-bg": token("soak-bg"),
        "soak-border": "#f59e0b",
        "soak-text": token("soak-text"),
        "stock-bg": token("stock-bg"),
        "stock-border": "#ef4444",
        "stock-text": token("stock-text"),
        "mention-accent": "#f4a261",
      },
      gridTemplateColumns: {
        "days": "repeat(3, 1fr)",
        "mentions": "repeat(2, 1fr)",
      },
    },
  },
  plugins: [],
};

export default config;
