import Link from "next/link";
import { entryPathFor } from "@/knowledge-graph/data/meteorites-catalog";
import type { MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";

export const CATEGORY_LABEL: Record<string, string> = {
  chondrite: "Chondrite",
  achondrite: "Achondrite",
  iron: "Iron",
  "stony-iron": "Stony-iron",
  fireball: "Fireball",
  "impact-structure": "Impact structure",
};

/** The browsable URL for a record, by kind (all AA entities own a /meteorites page). */
export function recordHref(r: MeteoriteRecord): string {
  return entryPathFor(r);
}

export function MeteoritesTable({ records }: { records: MeteoriteRecord[] }) {
  if (records.length === 0) {
    return <p className="scientific-card p-4 text-sm text-muted">No meteorites match this view yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-faint">
            <th scope="col" className="px-4 py-3 font-medium">Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Classification</th>
            <th scope="col" className="px-4 py-3 font-medium">Fall / find</th>
            <th scope="col" className="px-4 py-3 font-medium">Country</th>
            <th scope="col" className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.map((r) => (
            <tr key={r.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <Link href={recordHref(r)} className="font-medium text-fg underline-offset-4 hover:text-nasa hover:underline">{r.name}</Link>
                {r.bolide && <span className="ml-2 rounded bg-nasa/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-nasa">Bolide</span>}
              </td>
              <td className="px-4 py-3 text-muted">{r.classificationLabel ?? (r.category ? CATEGORY_LABEL[r.category] ?? r.category : "—")}</td>
              <td className="px-4 py-3 text-muted">{r.fallType ? (r.fallType === "fall" ? "Fall" : "Find") : "—"}</td>
              <td className="px-4 py-3 text-muted">{r.country ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{r.fallDate ?? r.discoveryYear ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
