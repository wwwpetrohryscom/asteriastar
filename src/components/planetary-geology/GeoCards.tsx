import Link from "next/link";
import type { GeoRecord } from "@/knowledge-graph/data/planetary-geology-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/planetary-geology-catalog/types";
import { getEntityById } from "@/knowledge-graph";
import { planetaryGeologyPath } from "@/lib/routes";

function bodyName(r: GeoRecord): string | undefined {
  if (!r.bodyKey) return r.bodyLabel;
  return getEntityById(r.bodyKey)?.name ?? r.bodyLabel;
}

/** A card grid of feature types and surface features. */
export function GeoCards({ records }: { records: GeoRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={planetaryGeologyPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-plasma hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          {r.kind === "feature" ? <div className="mt-0.5 text-xs text-faint">{[bodyName(r), r.dimensionsLabel].filter(Boolean).join(" · ")}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
