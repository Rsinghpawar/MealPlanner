"use client";

import { useCallback, useRef, useState } from "react";
import { useDisplayPrefs, type ThemePref } from "@/lib/DisplayPrefs";
import { useDismiss } from "@/lib/useDismiss";
import Switch from "./Switch";

const THEMES: { value: ThemePref; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "\u{1F319}" },
  { value: "system", label: "Auto", icon: "\u{1F4F1}" },
];

/** Gear button in the header with the theme and food-emoji settings. */
export default function DisplaySettings() {
  const { theme, setTheme, foodEmojis, setFoodEmojis } = useDisplayPrefs();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useDismiss(rootRef, open, useCallback(() => setOpen(false), []));

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Display settings"
        title="Display settings"
        className="mt-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors p-1.5"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Display settings"
          className="absolute right-0 top-full mt-2 z-40 w-64 rounded-xl bg-surface text-ink shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-3"
        >
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
            Theme
          </p>
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-1 rounded-lg bg-surface-2 p-1">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={theme === t.value}
                onClick={() => setTheme(t.value)}
                className={`rounded-md py-1.5 text-[12px] font-semibold transition-colors ${
                  theme === t.value
                    ? "bg-forest text-white shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <span aria-hidden="true">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-line-soft">
            <Switch
              label={"\u{1F60B} Food emojis"}
              description={"\u{1F95E} \u{1F35A} \u{1F957} next to each dish"}
              checked={foodEmojis}
              onChange={setFoodEmojis}
            />
          </div>
        </div>
      )}
    </div>
  );
}
