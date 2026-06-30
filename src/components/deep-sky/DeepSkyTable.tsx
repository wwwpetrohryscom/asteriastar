import Link from "next/link";
import type { DeepSkyRecord } from "@/knowledge-graph/data/deep-sky-catalog/types";
import { DEEP_SKY_TYPE_LABELS, GALAXY_TYPE_LABELS } from "@/knowledge-graph/data/deep-sky-catalog/types";
import { deepSkyPath } from "@/lib/routes";

function classLabel(d: DeepSkyRecord): string {
  return d.galaxyType ? GALAXY_TYPE_LABELS[d.galaxyType] : DEEP_SKY_TYPE_LABELS[d.type];
}

/** Professional deep-sky table — real catalogue data; empty cells never invented. */
export function DeepSkyTable({ objects, showConstellation = true }: { objects: DeepSkyRecord[]; showConstellation?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead className="bg-white/[0.03] text-faint">
          <tr>
            <th className="px-4 py-2.5 font-medium">Object</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            {showConstellation && <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Constellation</th>}
            <th className="px-4 py-2.5 text-right font-medium">Mag</th>
            <th className="px-4 py-2.5 text-right font-medium">Size (′)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {objects.map((d) => (
            <tr key={d.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-2.5">
                <Link href={deepSkyPath(d.slug)} className="font-medium text-fg transition hover:text-nebula">{d.name}</Link>
                {(d.ids.messier || d.ids.ngc) && (
                  <span className="block text-xs text-faint">{[d.ids.messier, d.ids.caldwell, d.ids.ngc].filter(Boolean).join(" · ")}</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-muted">{classLabel(d)}</td>
              {showConstellation && <td className="hidden px-4 py-2.5 text-muted sm:table-cell">{d.constellationAbbr}</td>}
              <td className="px-4 py-2.5 text-right font-mono text-fg">{d.apparentMagnitude ?? "—"}</td>
              <td className="px-4 py-2.5 text-right font-mono text-muted">{d.sizeMajorArcmin != null ? d.sizeMajorArcmin : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
