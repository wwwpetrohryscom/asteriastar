import Link from "next/link";
import type { DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/deep-space-comms-catalog/types";
import { entryPathFor } from "@/knowledge-graph/data/deep-space-comms-catalog";

/** The link for a record — its hub page, or the standalone graph page for supporting kinds. */
export function hrefForRecord(r: DSCommRecord): string {
  return entryPathFor(r) ?? `/explore/entity/${r.id.slice(0, r.id.indexOf(":"))}/${r.slug}`;
}

/** A card grid of deep-space-communications infrastructure. Unknown values are omitted. */
export function DSCommCards({ records }: { records: DSCommRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col scientific-card p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={hrefForRecord(r)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          {(r.locationLabel || r.countryLabel) ? <div className="mt-0.5 text-xs text-faint">{[r.locationLabel, r.countryLabel].filter(Boolean).join(" · ")}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
          <dl className="mt-3 space-y-1 text-xs text-faint">
            {r.diameterLabel ? <div className="flex justify-between gap-2"><dt>Antenna</dt><dd className="text-right text-muted">{r.diameterLabel}</dd></div> : null}
            {r.frequencyLabel ? <div className="flex justify-between gap-2"><dt>Frequency</dt><dd className="text-right text-muted">{r.frequencyLabel}</dd></div> : null}
            {r.operatorLabel ? <div className="flex justify-between gap-2"><dt>Operator</dt><dd className="text-right text-muted">{r.operatorLabel}</dd></div> : null}
          </dl>
        </li>
      ))}
    </ul>
  );
}
