import Link from "next/link";
import type { ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/exploration-catalog/types";
import { explorationPath } from "@/lib/routes";

function meta(r: ExplorationRecord): string {
  switch (r.kind) {
    case "agency": return [r.country, r.founded && `est. ${r.founded}`].filter(Boolean).join(" · ");
    case "vehicle": return [r.country, r.firstFlight && `first flight ${r.firstFlight}`, r.status].filter(Boolean).join(" · ");
    case "site": return [r.location, r.country].filter(Boolean).join(" · ");
    case "program": return [r.startYear && `${r.startYear}–${r.endYear ?? "present"}`, r.status].filter(Boolean).join(" · ");
    case "spacecraft": return [r.craftType, r.status].filter(Boolean).join(" · ");
    case "astronaut": return [r.nationality, r.firstFlight && `first flight ${r.firstFlight}`].filter(Boolean).join(" · ");
    case "instrument": return r.instrumentType ?? "";
    default: return KIND_LABEL[r.kind];
  }
}

/** Card grid for non-mission exploration entities (agencies, vehicles, programs…). */
export function ExplorationCards({ records }: { records: ExplorationRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id}>
          <Link href={explorationPath(r.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
            <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{r.name}</h3>
            {meta(r) && <p className="mt-1 text-xs uppercase tracking-wide text-faint">{meta(r)}</p>}
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{r.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
