interface WeekToggleProps {
  activeWeek: number;
  onWeekChange: (week: number) => void;
  /** Jump to today's card. Omitted on Sunday (no plan that day). */
  onToday?: () => void;
}

/**
 * Week 1 / Week 2 switch. On phones it sticks to the top of the screen with a
 * "Today" button, so today's meals are one tap away from anywhere on the page.
 */
export default function WeekToggle({ activeWeek, onWeekChange, onToday }: WeekToggleProps) {
  return (
    <div className="sticky top-0 z-30 md:static bg-page flex items-center justify-between gap-3 px-4 pt-3 pb-2 mt-2 md:mt-0 md:pt-5 md:pb-0 md:px-8">
      <div className="flex">
        {[1, 2].map((week) => (
          <button
            key={week}
            onClick={() => onWeekChange(week)}
            aria-pressed={activeWeek === week}
            className={`px-6 md:px-7 py-2.5 border-2 border-forest dark:border-accent/70 text-sm font-semibold transition-colors
              ${week === 1 ? "rounded-l-lg" : "rounded-r-lg"}
              ${activeWeek === week
                ? "bg-forest text-white"
                : "bg-surface text-accent hover:bg-forest/10"
              }`}
          >
            Week {week}
          </button>
        ))}
      </div>

      {onToday && (
        <button
          onClick={onToday}
          className="md:hidden shrink-0 inline-flex items-center gap-1.5 rounded-full bg-forest text-white text-[13px] font-semibold px-4 py-2.5 shadow-sm hover:bg-forest/90 active:scale-95 transition"
        >
          <span aria-hidden="true">{"\u{1F4CD}"}</span>
          Today
        </button>
      )}
    </div>
  );
}
