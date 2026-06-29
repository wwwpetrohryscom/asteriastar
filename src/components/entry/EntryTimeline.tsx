import type { EntryTimelineItem } from "@/lib/content/entry-types";

/** A vertical, dated timeline for an entry. Renders nothing when empty. */
export function EntryTimeline({ items }: { items: EntryTimelineItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="font-display text-xl font-semibold text-fg">
        Timeline
      </h2>
      <ol className="relative mt-5 space-y-6 border-l border-white/10 pl-6">
        {items.map((item, i) => (
          <li key={`${item.date}-${i}`} className="relative">
            <span
              aria-hidden
              className="absolute -left-[1.65rem] top-1 h-2.5 w-2.5 rounded-full bg-[var(--accent,#a78bfa)] ring-4 ring-bg"
            />
            <p className="text-xs font-medium uppercase tracking-wider text-faint">{item.date}</p>
            <p className="mt-0.5 font-medium text-fg">{item.title}</p>
            {item.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
