import Link from "next/link";
import { MissionStatusBadge } from "@/components/small-body-missions/MissionStatusBadge";
import type { SmallBodyRecord } from "@/knowledge-graph/data/small-body-missions-catalog/types";
import { smallBodyMissionPath } from "@/lib/routes";

/** A source-honest table of small-body missions. Unknown values render as "—". */
export function MissionsTable({ records }: { records: SmallBodyRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[48rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-wider text-faint">
            <th className="px-4 py-3 font-medium">Mission</th>
            <th className="px-4 py-3 font-medium">Agency</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Launched</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              <td className="px-4 py-3"><Link href={smallBodyMissionPath(r.slug)} className="font-medium text-fg hover:text-halo">{r.name}</Link></td>
              <td className="px-4 py-3 text-muted">{r.agencyLabel ?? "—"}</td>
              <td className="px-4 py-3 text-muted">{r.missionTypeLabel ?? "—"}</td>
              <td className="px-4 py-3">{r.status ? <MissionStatusBadge status={r.status} /> : "—"}</td>
              <td className="px-4 py-3 text-muted">{r.launchDate ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
