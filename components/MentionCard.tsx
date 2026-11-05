import type { MentionItem, Difficulty } from "@/data/mealPlan";

const DIFFICULTY_CONFIG: Record<Difficulty, { icon: string; color: string; bg: string }> = {
  easy:   { icon: "\u2705", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-500/15" },
  medium: { icon: "\u26A0", color: "text-mention-accent", bg: "bg-[#fef3ec] dark:bg-orange-400/15" },
  hard:   { icon: "\u26A0", color: "text-mention-accent", bg: "bg-[#fef3ec] dark:bg-orange-400/15" },
};

interface MentionCardProps {
  item: MentionItem;
}

export default function MentionCard({ item }: MentionCardProps) {
  const diff = DIFFICULTY_CONFIG[item.difficulty];
  const label = item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1);

  return (
    <div className="bg-surface rounded-[10px] p-3.5 px-4 shadow-[0_2px_6px_rgba(0,0,0,0.06)] border-l-4 border-mention-accent">
      <h3 className="text-[13px] font-bold mb-1">{item.title}</h3>
      <p className="text-[12px] text-ink-muted leading-relaxed">{item.description}</p>
      <span
        className={`inline-block mt-1.5 px-2 py-0.5 rounded-[10px] text-[10px] font-bold ${diff.bg} ${diff.color}`}
      >
        {diff.icon} {label} {"\u00B7"} {item.difficultyNote}
      </span>
    </div>
  );
}
