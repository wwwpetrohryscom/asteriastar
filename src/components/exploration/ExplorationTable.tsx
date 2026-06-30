import Link from "next/link";
import type { ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";
import { explorationPath } from "@/lib/routes";

const AGENCY_NAME: Record<string, string> = {
  nasa: "NASA", esa: "ESA", roscosmos: "Roscosmos", jaxa: "JAXA", isro: "ISRO", cnsa: "CNSA",
  csa: "CSA", "uae-space-agency": "UAE", kari: "KARI", spacex: "SpaceX",
};

/** Professional mission table — real data; empty cells are shown as em dashes, never invented. */
export function ExplorationTable({ records, showStatus = true }: { records: ExplorationRecord[]; showStatus?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead className="bg-white/[0.03] text-faint">
          <tr>
            <th className="px-4 py-2.5 font-medium">Mission</th>
            <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Type</th>
            <th className="px-4 py-2.5 font-medium">Agency</th>
            <th className="px-4 py-2.5 text-right font-medium">Launch</th>
            {showStatus && <th className="hidden px-4 py-2.5 text-right font-medium md:table-cell">Status</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.map((r) => (
            <tr key={r.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-2.5">
                <Link href={explorationPath(r.slug)} className="font-medium text-fg transition hover:text-nebula">{r.name}</Link>
                {r.destination && <span className="block text-xs text-faint">{r.destination}</span>}
              </td>
              <td className="hidden px-4 py-2.5 text-muted sm:table-cell">{r.missionType ?? "—"}</td>
              <td className="px-4 py-2.5 text-muted">{r.agencySlug ? AGENCY_NAME[r.agencySlug] ?? r.agencySlug.toUpperCase() : "—"}</td>
              <td className="px-4 py-2.5 text-right font-mono text-fg">{r.launchDate ?? "—"}</td>
              {showStatus && <td className="hidden px-4 py-2.5 text-right md:table-cell"><StatusPill status={r.status} /></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusPill({ status }: { status?: string }) {
  if (!status) return <span className="text-faint">—</span>;
  const active = /active|en route|operational/i.test(status);
  const done = /completed|retired|lost/i.test(status);
  const tone = active ? "text-emerald-300 border-emerald-400/20 bg-emerald-400/5"
    : done ? "text-slate-300 border-white/10 bg-white/[0.03]"
    : "text-amber-300 border-amber-400/20 bg-amber-400/5";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${tone}`}>{status}</span>;
}
