import Link from "next/link";
import { cometPath, cometActivePath, cometDormantPath } from "@/lib/routes";
import { entryPathFor } from "@/knowledge-graph/data/comets-catalog";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import type { CometRecord } from "@/knowledge-graph/data/comets-catalog/types";

export const CATEGORY_LABEL: Record<string, string> = {
  periodic: "Periodic",
  "long-period": "Long-period",
  "great-comet": "Great comet",
  sungrazer: "Sungrazer",
  transition: "Transition object",
  reservoir: "Reservoir",
};

/** The browsable URL for a record: its /comets page if new, else its existing home. */
export function recordHref(r: CometRecord): string | undefined {
  if (r.kind === "comet" && !r.existing) return cometPath(r.slug);
  if (r.kind === "active-asteroid") return cometActivePath(r.slug);
  if (r.kind === "dormant-comet") return cometDormantPath(r.slug);
  const p = entryPathFor(r);
  if (p && !r.existing) return p;
  const e = getEntityById(r.id);
  return e ? entityGraphPath(e) : undefined;
}

export function periodLabel(r: CometRecord): string | undefined {
  if (r.orbitalPeriodYears == null) return undefined;
  return r.orbitalPeriodYears >= 200 ? `${Math.round(r.orbitalPeriodYears).toLocaleString()} yr` : `${r.orbitalPeriodYears} yr`;
}

export function CometsTable({ records }: { records: CometRecord[] }) {
  if (records.length === 0) {
    return <p className="scientific-card p-4 text-sm text-muted">No comets match this view yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-faint">
            <th scope="col" className="px-4 py-3 font-medium">Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Designation</th>
            <th scope="col" className="px-4 py-3 font-medium">Type</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Period</th>
            <th scope="col" className="px-4 py-3 font-medium">Discovered</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.map((r) => {
            const href = recordHref(r);
            return (
              <tr key={r.id} className="transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  {href ? <Link href={href} className="font-medium text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link> : <span className="font-medium text-fg">{r.name}</span>}
                  {r.greatComet && <span className="ml-2 rounded bg-nasa/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-nasa">Great</span>}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{r.designation ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{r.cometTypeLabel ?? (r.category ? CATEGORY_LABEL[r.category] ?? r.category : "—")}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-fg">{periodLabel(r) ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{r.discoveryYear ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
