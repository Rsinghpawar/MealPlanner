"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Per-device display settings: colour theme and food emojis. Saved in
 * localStorage. THEME_INIT_SCRIPT applies them before the first paint so the
 * page never flashes the wrong theme; this provider keeps them in sync after.
 */

export type ThemePref = "light" | "dark" | "system";

const THEME_KEY = "theme";
const EMOJI_KEY = "food-emojis";

/** Browser bar colour, matching the header in each theme. */
const THEME_COLORS = { light: "#2d6a4f", dark: "#1b3d2f" } as const;

export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_KEY}");var k=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",k);if(localStorage.getItem("${EMOJI_KEY}")==="off")d.setAttribute("data-food-emojis","off")}catch(e){}})();`;

interface DisplayPrefsValue {
  theme: ThemePref;
  setTheme: (theme: ThemePref) => void;
  foodEmojis: boolean;
  setFoodEmojis: (on: boolean) => void;
}

const DisplayPrefsContext = createContext<DisplayPrefsValue | null>(null);

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode / storage blocked: the setting just won't be remembered.
  }
}

function applyTheme(theme: ThemePref) {
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  const color = dark ? THEME_COLORS.dark : THEME_COLORS.light;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", color));
}

export function DisplayPrefsProvider({ children }: { children: ReactNode }) {
  // null until read from storage on the client, so nothing is applied early.
  const [theme, setThemeState] = useState<ThemePref | null>(null);
  const [foodEmojis, setFoodEmojisState] = useState(true);

  useEffect(() => {
    const stored = readStorage(THEME_KEY);
    setThemeState(stored === "light" || stored === "dark" ? stored : "system");
    setFoodEmojisState(readStorage(EMOJI_KEY) !== "off");
  }, []);

  useEffect(() => {
    if (theme === null) return;
    applyTheme(theme);
    if (theme !== "system") return;
    // Follow the phone's setting while on Auto.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemePref) => {
    setThemeState(next);
    writeStorage(THEME_KEY, next);
  }, []);

  const setFoodEmojis = useCallback((on: boolean) => {
    setFoodEmojisState(on);
    writeStorage(EMOJI_KEY, on ? "on" : "off");
    if (on) document.documentElement.removeAttribute("data-food-emojis");
    else document.documentElement.setAttribute("data-food-emojis", "off");
  }, []);

  return (
    <DisplayPrefsContext.Provider
      value={{ theme: theme ?? "system", setTheme, foodEmojis, setFoodEmojis }}
    >
      {children}
    </DisplayPrefsContext.Provider>
  );
}

export function useDisplayPrefs() {
  const ctx = useContext(DisplayPrefsContext);
  if (!ctx)
    throw new Error("useDisplayPrefs must be used within DisplayPrefsProvider");
  return ctx;
}
