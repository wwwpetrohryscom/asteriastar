import Link from "next/link";
import type { BodyRecord } from "@/knowledge-graph/data/solar-system-catalog/types";
import { BODY_KIND_LABELS } from "@/knowledge-graph/data/solar-system-catalog/types";
import { bodySlug } from "@/knowledge-graph/data/solar-system-catalog";
import { solarBodyPath } from "@/lib/routes";

/** A real-data-driven detail for each row (empty cells are never invented). */
function detail(b: BodyRecord): string {
  if (b.radiusKm != null) return `${b.radiusKm.toLocaleString()} km radius`;
  if (b.semiMajorAxisAu != null) return `${b.semiMajorAxisAu} AU`;
  if (b.orbitalPeriodYears != null) return `${b.orbitalPeriodYears} yr orbit`;
  if (b.launchYear != null) return `Launched ${b.launchYear}`;
  return "—";
}

/** Professional Solar System table. */
export function BodyTable({ bodies }: { bodies: BodyRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead className="bg-white/[0.03] text-faint">
          <tr>
            <th className="px-4 py-2.5 font-medium">Object</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 text-right font-medium">Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {bodies.map((b) => (
            <tr key={b.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-2.5">
                <Link href={solarBodyPath(bodySlug(b.id))} className="font-medium text-fg transition hover:text-nasa">{b.name}</Link>
                {b.designation && b.designation !== b.name && (
                  <span className="block text-xs text-faint">{b.designation}</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-muted">{b.classification ?? BODY_KIND_LABELS[b.kind]}</td>
              <td className="px-4 py-2.5 text-right font-mono text-muted">{detail(b)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
