import Link from "next/link";
import type { TimelineEvent } from "@/lib/timelines";

export type { TimelineEvent };

/** Reusable vertical timeline. Used by entry pages and the Timeline Engine. */
export function TimelineList({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null;
  return (
    <ol className="relative space-y-6 border-l border-white/10 pl-6">
      {events.map((event, i) => (
        <li key={`${event.date}-${i}`} className="relative">
          <span
            aria-hidden
            className="absolute -left-[1.65rem] top-1 h-2.5 w-2.5 rounded-full bg-[var(--accent,#c8d2e6)] ring-4 ring-bg"
          />
          <p className="text-xs font-medium uppercase tracking-wider text-faint">{event.date}</p>
          {event.href ? (
            <Link
              href={event.href}
              className="mt-0.5 inline-block font-medium text-fg underline-offset-4 transition hover:text-nasa hover:underline"
            >
              {event.title}
            </Link>
          ) : (
            <p className="mt-0.5 font-medium text-fg">{event.title}</p>
          )}
          {event.description && (
            <p className="mt-1 text-sm leading-relaxed text-muted">{event.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
