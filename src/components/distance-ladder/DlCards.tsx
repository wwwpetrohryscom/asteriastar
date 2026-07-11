import Link from "next/link";
import type { DistanceRecord } from "@/knowledge-graph/data/distance-ladder-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/distance-ladder-catalog/types";
import { distanceLadderPath } from "@/lib/routes";

/** A card grid of distance indicators, cosmological parameters, programmes, and concepts. */
export function DlCards({ records }: { records: DistanceRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col scientific-card p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={distanceLadderPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-white hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          {r.rungLabel ? <div className="mt-0.5 text-xs text-white">{r.rungLabel} rung</div> : (r.symbol ? <div className="mt-0.5 text-xs text-white">{r.symbol}</div> : null)}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
