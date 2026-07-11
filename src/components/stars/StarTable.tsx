import Link from "next/link";
import type { StarRecord } from "@/knowledge-graph/data/star-catalog/types";
import { STAR_CATEGORY_LABELS } from "@/knowledge-graph/data/star-catalog/types";
import { starPath } from "@/lib/routes";

/**
 * Professional, scientific star table. Renders real catalogue data; empty cells
 * mean the catalogue has no reliable value (never a fabricated one).
 */
export function StarTable({
  stars,
  showConstellation = true,
  metric = "magnitude",
}: {
  stars: StarRecord[];
  showConstellation?: boolean;
  metric?: "magnitude" | "distance";
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead className="bg-white/[0.03] text-faint">
          <tr>
            <th className="px-4 py-2.5 font-medium">Star</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            {showConstellation && <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Constellation</th>}
            <th className="px-4 py-2.5 text-right font-medium">Mag</th>
            <th className="px-4 py-2.5 text-right font-medium">Distance (ly)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {stars.map((s) => (
            <tr key={s.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-2.5">
                <Link href={starPath(s.slug)} className="font-medium text-fg transition hover:text-nasa">{s.name}</Link>
                {s.scientificName && s.scientificName !== s.name && (
                  <span className="block text-xs text-faint">{s.scientificName}</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-muted">{s.category ? STAR_CATEGORY_LABELS[s.category] : "—"}</td>
              {showConstellation && <td className="hidden px-4 py-2.5 text-muted sm:table-cell">{s.constellationAbbr}</td>}
              <td className={`px-4 py-2.5 text-right font-mono ${metric === "magnitude" ? "text-fg" : "text-muted"}`}>{s.apparentMagnitude ?? "—"}</td>
              <td className={`px-4 py-2.5 text-right font-mono ${metric === "distance" ? "text-fg" : "text-muted"}`}>{s.distanceLy != null ? s.distanceLy.toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
