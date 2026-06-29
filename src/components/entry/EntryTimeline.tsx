import { TimelineList } from "@/components/timeline/TimelineList";
import type { EntryTimelineItem } from "@/lib/content/entry-types";

/** An entry's timeline, rendered via the reusable TimelineList. */
export function EntryTimeline({ items }: { items: EntryTimelineItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="font-display text-xl font-semibold text-fg">
        Timeline
      </h2>
      <div className="mt-5">
        <TimelineList events={items} />
      </div>
    </section>
  );
}
