import type { MentionItem } from "@/data/mealPlan";
import MentionCard from "./MentionCard";

interface MentionsSectionProps {
  mentions: MentionItem[];
}

export default function MentionsSection({ mentions }: MentionsSectionProps) {
  return (
    <section className="px-4 pb-8 md:px-8">
      <h2 className="text-[17px] font-bold mb-3.5 pt-2">
        {"\u2B50"} Notable Mentions {"\u2014"} Worth Trying When Ready
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {mentions.map((item) => (
          <MentionCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
