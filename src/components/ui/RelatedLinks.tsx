import { SectionGrid } from "@/components/sections/SectionGrid";
import type { TopicCardProps } from "@/components/ui/TopicCard";

/**
 * A titled block of related TopicCards. Used to weave internal links between
 * categories and across hubs, which is core to the SEO strategy.
 */
export function RelatedLinks({
  title = "Related topics",
  items,
  columns = 4,
}: {
  title?: string;
  items: TopicCardProps[];
  columns?: 2 | 3 | 4;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-display text-xl font-semibold text-fg">
        {title}
      </h2>
      <SectionGrid items={items} columns={columns} className="mt-4" />
    </section>
  );
}
