import Link from "next/link";
import type { OpsRecord } from "@/knowledge-graph/data/mission-operations-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/mission-operations-catalog/types";
import { missionOperationsPath } from "@/lib/routes";

/** A card grid of operations centres and functions. */
export function OpsCards({ records }: { records: OpsRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col scientific-card p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={missionOperationsPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          {(r.agencyLabel || r.countryLabel) ? <div className="mt-0.5 text-xs text-faint">{[r.agencyLabel, r.countryLabel].filter(Boolean).join(" · ")}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
