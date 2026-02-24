import type { Reminder as ReminderType } from "@/data/mealPlan";
import { REMINDER_ICONS } from "@/data/mealPlan";

interface ReminderProps {
  reminder: ReminderType;
}

const REMINDER_STYLES = {
  soak: "bg-soak-bg border-l-[3px] border-soak-border text-soak-text",
  stock: "bg-stock-bg border-l-[3px] border-stock-border text-stock-text",
};

export default function Reminder({ reminder }: ReminderProps) {
  return (
    <div
      className={`rounded-md px-2.5 py-1.5 flex items-start gap-1.5 text-[11px] font-medium leading-relaxed ${REMINDER_STYLES[reminder.type]}`}
    >
      <span className="text-[13px] shrink-0 mt-px">
        {REMINDER_ICONS[reminder.type]}
      </span>
      <span dangerouslySetInnerHTML={{ __html: reminder.text }} />
    </div>
  );
}
