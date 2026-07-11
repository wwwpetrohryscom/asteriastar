import Link from "next/link";
import type { Point3D } from "@/lib/universe-3d/projection3d";

/**
 * The accessibility fallback for a 3D scene: a plain data table of every plotted object with its real
 * measured value. It carries the same data as the visual scene in a form a screen reader can read and a
 * no-JavaScript browser can render. Values are the measured distances already on the points; nothing is
 * computed here.
 */
export function SceneObjectTable({
  points,
  unit,
  valueLabel,
  caption,
  max = 200,
}: {
  points: Point3D[];
  unit: string;
  valueLabel: string;
  caption: string;
  max?: number;
}) {
  const rows = points
    .filter((p) => p.name)
    .slice(0, max);
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full border-collapse text-sm">
        <caption className="px-4 pt-3 text-left text-xs text-faint">{caption}</caption>
        <thead>
          <tr className="border-b border-white/10 text-left text-faint">
            <th scope="col" className="px-4 py-2 font-medium">Object</th>
            <th scope="col" className="px-4 py-2 font-medium">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b border-white/5">
              <td className="px-4 py-1.5 text-fg">
                {p.href ? (
                  <Link href={p.href} className="hover:text-nasa">{p.name}</Link>
                ) : (
                  p.name
                )}
              </td>
              <td className="px-4 py-1.5 text-muted">
                {typeof p.distance === "number" ? `${p.distance.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
