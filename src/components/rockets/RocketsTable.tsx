import Link from "next/link";
import { rocketPath } from "@/lib/routes";
import type { RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";

/** Status pill with an honest colour per lifecycle state. */
function StatusPill({ status }: { status?: string }) {
  if (!status) return <span className="text-faint">—</span>;
  const s = status.toLowerCase();
  const cls = /active/.test(s)
    ? "border-success/40 bg-success/10 text-success-strong"
    : /retired/.test(s)
      ? "border-white/15 bg-white/[0.03] text-faint"
      : /develop|planned/.test(s)
        ? "border-white/20 bg-white/[0.045] text-muted"
        : "border-white/15 bg-white/[0.03] text-muted";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${cls}`}>{status}</span>;
}

/** A sortable-by-nothing static table of launch vehicles. */
export function RocketsTable({ records }: { records: RocketRecord[] }) {
  if (records.length === 0) {
    return <p className="scientific-card p-4 text-sm text-muted">No launch vehicles match this view yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-faint">
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Country</th>
            <th className="px-4 py-3 font-medium">First flight</th>
            <th className="px-4 py-3 font-medium">Lift class</th>
            <th className="px-4 py-3 text-right font-medium">LEO payload</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.map((r) => (
            <tr key={r.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <Link href={rocketPath(r.slug)} className="font-medium text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link>
              </td>
              <td className="px-4 py-3 text-muted">{r.country ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{r.firstFlight ?? "—"}</td>
              <td className="px-4 py-3 text-muted">{r.liftClass ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-fg">{r.payloadLeoKg != null ? `${r.payloadLeoKg.toLocaleString()} kg` : "—"}</td>
              <td className="px-4 py-3"><StatusPill status={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
