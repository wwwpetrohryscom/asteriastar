import Link from "next/link";
import type { TimelineRecord } from "@/knowledge-graph/data/spaceflight-history-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/spaceflight-history-catalog/types";
import { spaceflightTimelinePath } from "@/lib/routes";

/** A card grid of eras, events, milestones, and records. */
export function TimelineCards({ records }: { records: TimelineRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={spaceflightTimelinePath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-comet hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          {r.dateLabel ? <div className="mt-0.5 text-xs text-comet">{r.dateLabel}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}

/** A compact chronological list (year → event) for timeline views. */
export function TimelineList({ records }: { records: TimelineRecord[] }) {
  return (
    <ol className="relative space-y-3 border-l border-white/10 pl-6">
      {records.map((r) => (
        <li key={r.id} className="relative">
          <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border border-comet bg-black" aria-hidden />
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-mono text-xs text-comet">{r.dateLabel ?? r.year}</span>
            <Link href={spaceflightTimelinePath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-comet hover:underline">{r.name}</Link>
          </div>
          <p className="mt-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ol>
  );
}
