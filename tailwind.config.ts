import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#2d6a4f",
        "meal-breakfast": "#e07b39",
        "meal-lunch": "#2d6a4f",
        "meal-dinner": "#4a4e9a",
        "soak-bg": "#fff8e1",
        "soak-border": "#f59e0b",
        "soak-text": "#92400e",
        "stock-bg": "#fef2f2",
        "stock-border": "#ef4444",
        "stock-text": "#991b1b",
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
