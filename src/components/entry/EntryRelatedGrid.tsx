import { SectionGrid } from "@/components/sections/SectionGrid";
import type { AccentToken } from "@/lib/content/types";
import type { Entry } from "@/lib/content/entry-types";

/** A titled grid of related entries, rendered as TopicCards. */
export function EntryRelatedGrid({
  entries,
  accent,
  eyebrow,
  title = "Related entries",
  columns = 4,
}: {
  entries: Entry[];
  accent: AccentToken;
  /** Optional eyebrow label shown on each card (e.g. the section name). */
  eyebrow?: string;
  title?: string;
  columns?: 2 | 3 | 4;
}) {
  if (entries.length === 0) return null;
  const items = entries.map((entry) => ({
    title: entry.title,
    description: entry.excerpt,
    href: entry.path,
    accent,
    eyebrow,
  }));
  return (
    <section aria-labelledby="related-entries-heading">
      <h2
        id="related-entries-heading"
        className="font-display text-xl font-semibold text-fg"
      >
        {title}
      </h2>
      <SectionGrid items={items} columns={columns} className="mt-4" />
    </section>
  );
}
