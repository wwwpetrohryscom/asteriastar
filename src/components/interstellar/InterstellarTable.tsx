import Link from "next/link";
import { StatusBadge } from "@/components/interstellar/StatusBadge";
import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";
import { interstellarObjectPath } from "@/lib/routes";

/** A source-honest table of interstellar objects / hyperbolic comets. Unknown values render as "—". */
export function InterstellarTable({ records }: { records: InterstellarRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[46rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-wider text-faint">
            <th className="px-4 py-3 font-medium">Object</th>
            <th className="px-4 py-3 font-medium">Designation</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Trajectory</th>
            <th className="px-4 py-3 font-medium">Discovered</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <Link href={interstellarObjectPath(r.slug)} className="font-medium text-fg hover:text-aurora">{r.name}</Link>
              </td>
              <td className="px-4 py-3 text-muted">{r.designation ?? "—"}</td>
              <td className="px-4 py-3">{r.status ? <StatusBadge status={r.status} /> : "—"}</td>
              <td className="px-4 py-3 text-muted">{r.trajectoryLabel ?? (r.eccentricity !== undefined ? `e ≈ ${r.eccentricity}` : "—")}</td>
              <td className="px-4 py-3 text-muted">{r.discoveryDate ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
