import Link from "next/link";
import { asteroidPath } from "@/lib/routes";
import { entryPathFor } from "@/knowledge-graph/data/asteroids-catalog";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";

export const CATEGORY_LABEL: Record<string, string> = {
  "main-belt": "Main belt",
  "near-earth": "Near-Earth",
  trojan: "Trojan",
  centaur: "Centaur",
  "trans-neptunian": "Trans-Neptunian",
  "dwarf-planet": "Dwarf planet",
  impactor: "Impact event",
};

export const TAXONOMY_LABEL: Record<string, string> = {
  carbonaceous: "Carbonaceous (C)",
  silicaceous: "Silicaceous (S)",
  metallic: "Metallic (M)",
  basaltic: "Basaltic (V)",
  other: "Other",
};

/** The browsable URL for a record: its /asteroids page if new, else its existing home. */
export function recordHref(r: MinorBodyRecord): string | undefined {
  if (r.kind === "asteroid" && !r.existing) return asteroidPath(r.slug);
  const p = entryPathFor(r);
  if (p && !r.existing) return p;
  const e = getEntityById(r.id);
  return e ? entityGraphPath(e) : undefined;
}

export function diameterLabel(r: MinorBodyRecord): string | undefined {
  if (r.meanDiameterKm == null) return r.dimensionsLabel;
  return r.meanDiameterKm < 1 ? `${Math.round(r.meanDiameterKm * 1000)} m` : `${r.meanDiameterKm.toLocaleString()} km`;
}

export function AsteroidsTable({ records }: { records: MinorBodyRecord[] }) {
  if (records.length === 0) {
    return <p className="scientific-card p-4 text-sm text-muted">No bodies match this view yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-faint">
            <th scope="col" className="px-4 py-3 font-medium">Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Category</th>
            <th scope="col" className="px-4 py-3 font-medium">Type</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Diameter</th>
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
                  {r.pha && <span className="ml-2 rounded bg-nasa/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-nasa">PHA</span>}
                </td>
                <td className="px-4 py-3 text-muted">{r.category ? CATEGORY_LABEL[r.category] ?? r.category : "—"}</td>
                <td className="px-4 py-3 text-muted">{r.taxonomyClass ? TAXONOMY_LABEL[r.taxonomyClass] ?? r.taxonomyClass : "—"}</td>
                <td className="px-4 py-3 text-right font-mono text-xs text-fg">{diameterLabel(r) ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{r.discoveryYear ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
