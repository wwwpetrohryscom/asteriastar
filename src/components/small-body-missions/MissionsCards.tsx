import Link from "next/link";
import { MissionStatusBadge } from "@/components/small-body-missions/MissionStatusBadge";
import type { SmallBodyRecord } from "@/knowledge-graph/data/small-body-missions-catalog/types";
import { smallBodyMissionPath } from "@/lib/routes";

/** A card grid of small-body missions, each carrying its status and key facts. */
export function MissionsCards({ records }: { records: SmallBodyRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={smallBodyMissionPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-halo hover:underline">{r.name}</Link>
            {r.status ? <MissionStatusBadge status={r.status} /> : null}
          </div>
          {r.agencyLabel ? <div className="mt-0.5 text-xs text-faint">{r.agencyLabel}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
          <dl className="mt-3 space-y-1 text-xs text-faint">
            {r.missionTypeLabel ? <div className="flex justify-between gap-2"><dt>Type</dt><dd className="text-right text-muted">{r.missionTypeLabel}</dd></div> : null}
            {r.launchDate ? <div className="flex justify-between gap-2"><dt>Launched</dt><dd className="text-right text-muted">{r.launchDate}</dd></div> : null}
          </dl>
        </li>
      ))}
    </ul>
  );
}
