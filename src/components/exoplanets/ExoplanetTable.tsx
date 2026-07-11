import Link from "next/link";
import type { ExoplanetRecord } from "@/knowledge-graph/data/exoplanet-catalog/types";
import { PLANET_CLASSES } from "@/knowledge-graph/data/exoplanet-catalog/types";
import { exoplanetPath } from "@/lib/routes";

const CLASS_LABEL = new Map(PLANET_CLASSES.map((c) => [c.slug, c.name]));
const ly = (pc?: number) => (pc == null ? undefined : Math.round(pc * 3.262));

/** Professional exoplanet table — real archive values; empty cells are em dashes, never invented. */
export function ExoplanetTable({ planets, showHost = true }: { planets: ExoplanetRecord[]; showHost?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="bg-white/[0.03] text-faint">
          <tr>
            <th className="px-4 py-2.5 font-medium">Planet</th>
            <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Class</th>
            {showHost && <th className="hidden px-4 py-2.5 font-medium md:table-cell">Host</th>}
            <th className="px-4 py-2.5 text-right font-medium">Radius (R⊕)</th>
            <th className="px-4 py-2.5 text-right font-medium">Period (d)</th>
            <th className="hidden px-4 py-2.5 text-right font-medium lg:table-cell">Distance (ly)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {planets.map((p) => (
            <tr key={p.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-2.5">
                <Link href={exoplanetPath(p.slug)} className="font-medium text-fg transition hover:text-nasa">{p.name}</Link>
                {p.discoveryYear && <span className="block text-xs text-faint">{p.discoveryMethod} · {p.discoveryYear}</span>}
              </td>
              <td className="hidden px-4 py-2.5 text-muted sm:table-cell">{p.classSlug ? CLASS_LABEL.get(p.classSlug) : "—"}</td>
              {showHost && <td className="hidden px-4 py-2.5 text-muted md:table-cell">{p.hostName}</td>}
              <td className="px-4 py-2.5 text-right font-mono text-fg">{p.radiusEarth ?? "—"}</td>
              <td className="px-4 py-2.5 text-right font-mono text-muted">{p.orbitalPeriodDays != null ? (p.orbitalPeriodDays >= 100 ? Math.round(p.orbitalPeriodDays) : p.orbitalPeriodDays) : "—"}</td>
              <td className="hidden px-4 py-2.5 text-right font-mono text-muted lg:table-cell">{ly(p.hostDistancePc) ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
