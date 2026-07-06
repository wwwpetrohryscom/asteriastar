import Link from "next/link";
import type { LiveSourceRecord } from "@/knowledge-graph/data/live-data-catalog/types";
import { CATEGORY_LABEL } from "@/knowledge-graph/data/live-data-catalog/types";
import { livePath } from "@/lib/routes";

const STATUS_LABEL: Record<string, string> = {
  connected: "Connected", computed: "Computed", cached: "Cached", stale: "Stale", unavailable: "Unavailable", planned: "Architecture-ready",
};

/** A card grid of live data sources, each showing its honest status. */
export function LiveCards({ records }: { records: LiveSourceRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={livePath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-aurora hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{STATUS_LABEL[r.status] ?? r.status}</span>
          </div>
          <div className="mt-0.5 text-xs text-aurora">{CATEGORY_LABEL[r.category]}</div>
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
