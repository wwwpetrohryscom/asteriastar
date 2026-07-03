import Link from "next/link";
import { StatusBadge } from "@/components/interstellar/StatusBadge";
import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";
import { interstellarObjectPath } from "@/lib/routes";

/** A card grid of interstellar objects / hyperbolic comets, each carrying its status. */
export function InterstellarCards({ records }: { records: InterstellarRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={interstellarObjectPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-aurora hover:underline">{r.name}</Link>
            {r.status ? <StatusBadge status={r.status} /> : null}
          </div>
          {r.designation && r.designation !== r.name ? <div className="mt-0.5 text-xs text-faint">{r.designation}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
          <dl className="mt-3 space-y-1 text-xs text-faint">
            {r.trajectoryLabel ? <div className="flex justify-between gap-2"><dt>Trajectory</dt><dd className="text-right text-muted">{r.trajectoryLabel}</dd></div> : null}
            {r.discoveryDate ? <div className="flex justify-between gap-2"><dt>Discovered</dt><dd className="text-right text-muted">{r.discoveryDate}</dd></div> : null}
          </dl>
        </li>
      ))}
    </ul>
  );
}
