interface WeekToggleProps {
  activeWeek: number;
  onWeekChange: (week: number) => void;
}

export default function WeekToggle({ activeWeek, onWeekChange }: WeekToggleProps) {
  return (
    <div className="flex px-4 pt-5 md:px-8">
      {[1, 2].map((week) => (
        <button
          key={week}
          onClick={() => onWeekChange(week)}
          className={`px-7 py-2.5 border-2 border-forest text-sm font-semibold transition-colors
            ${week === 1 ? "rounded-l-lg" : "rounded-r-lg"}
            ${activeWeek === week
              ? "bg-forest text-white"
              : "bg-white text-forest hover:bg-forest/10"
            }`}
        >
          Week {week}
        </button>
      ))}
    </div>
  );
}
