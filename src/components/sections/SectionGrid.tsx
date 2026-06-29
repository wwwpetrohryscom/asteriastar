import { TopicCard, type TopicCardProps } from "@/components/ui/TopicCard";

/** Responsive grid of TopicCards. Column count adapts to viewport. */
export function SectionGrid({
  items,
  columns = 3,
  className = "",
}: {
  items: TopicCardProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <ul className={`grid grid-cols-1 gap-4 ${cols} ${className}`}>
      {items.map((item) => (
        <li key={item.href} className="contents">
          <TopicCard {...item} />
        </li>
      ))}
    </ul>
  );
}
