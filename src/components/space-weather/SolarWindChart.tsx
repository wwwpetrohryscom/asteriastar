import type { SolarWindPoint } from "@/platform/space-weather/model";
import { utcStamp } from "@/components/space-weather/LiveStatus";

/**
 * The last hour of solar wind, as inline SVG.
 *
 * Two traces on one time axis with independent scales: speed in km/s, and the north–south field
 * component Bz in nT. They are drawn together because the pairing is the physics — fast wind with
 * a southward field couples into the magnetosphere, fast wind with a northward field largely does
 * not — and separating them would hide the only thing the pair is for.
 *
 * The Bz zero line is drawn and labelled, because the sign is the whole point, and the two traces
 * are distinguished by dash pattern as well as by colour so that neither greyscale nor
 * colour-blindness loses the distinction. The full series is available as a table.
 */

const WIDTH = 720;
const HEIGHT = 200;
const PAD = { top: 14, right: 44, bottom: 26, left: 44 };

function path(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}

function niceRange(values: number[], padFraction = 0.1): [number, number] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [min - 1, max + 1];
  const pad = (max - min) * padFraction;
  return [min - pad, max + pad];
}

export function SolarWindChart({ points, describedBy }: { points: SolarWindPoint[]; describedBy: string }) {
  const speeds = points.filter((p) => p.speedKmS !== undefined) as (SolarWindPoint & { speedKmS: number })[];
  const bzs = points.filter((p) => p.bzNt !== undefined) as (SolarWindPoint & { bzNt: number })[];
  if (speeds.length < 2 && bzs.length < 2) return null;

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const times = points.map((p) => Date.parse(p.observedAt));
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const x = (iso: string) => PAD.left + (tMax === tMin ? plotW / 2 : ((Date.parse(iso) - tMin) / (tMax - tMin)) * plotW);

  const [sLo, sHi] = niceRange(speeds.map((p) => p.speedKmS));
  const ySpeed = (v: number) => PAD.top + plotH - ((v - sLo) / (sHi - sLo)) * plotH;

  // Bz is scaled symmetrically about zero so the zero line sits in the middle and a southward
  // excursion is visually obvious rather than being flattened by an asymmetric range.
  const bzMax = Math.max(5, ...bzs.map((p) => Math.abs(p.bzNt)));
  const yBz = (v: number) => PAD.top + plotH / 2 - (v / bzMax) * (plotH / 2);

  const lastSpeed = speeds[speeds.length - 1];
  const lastBz = bzs[bzs.length - 1];
  const minBz = bzs.length > 0 ? Math.min(...bzs.map((p) => p.bzNt)) : undefined;

  const summary = [
    `Solar wind over the last hour: ${points.length} one-minute rows.`,
    lastSpeed ? `Speed ${lastSpeed.speedKmS.toFixed(0)} km/s at ${utcStamp(lastSpeed.observedAt)}, ranging ${Math.min(...speeds.map((p) => p.speedKmS)).toFixed(0)} to ${Math.max(...speeds.map((p) => p.speedKmS)).toFixed(0)} km/s.` : "",
    lastBz ? `Bz ${lastBz.bzNt.toFixed(1)} nT, most southward ${minBz?.toFixed(1)} nT.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label={summary} aria-describedby={describedBy} preserveAspectRatio="xMidYMid meet">
        {/* Bz zero line — the sign of Bz is the physics, so the axis it flips about is drawn. */}
        <line x1={PAD.left} y1={yBz(0)} x2={WIDTH - PAD.right} y2={yBz(0)} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <text x={WIDTH - PAD.right + 4} y={yBz(0) + 4} fontSize="10" fill="var(--color-faint)">0 nT</text>
        <text x={WIDTH - PAD.right + 4} y={yBz(bzMax) + 10} fontSize="10" fill="var(--color-faint)">+{bzMax.toFixed(0)}</text>
        <text x={WIDTH - PAD.right + 4} y={yBz(-bzMax)} fontSize="10" fill="var(--color-faint)">−{bzMax.toFixed(0)}</text>

        <text x={4} y={PAD.top + 8} fontSize="10" fill="var(--color-faint)">{sHi.toFixed(0)}</text>
        <text x={4} y={PAD.top + plotH} fontSize="10" fill="var(--color-faint)">{sLo.toFixed(0)}</text>
        <text x={4} y={HEIGHT - 8} fontSize="10" fill="var(--color-faint)">km/s</text>

        {bzs.length > 1 && (
          <path d={path(bzs.map((p) => ({ x: x(p.observedAt), y: yBz(p.bzNt) })))} fill="none" stroke="var(--color-nasa)" strokeWidth="1.6" strokeDasharray="5 3" />
        )}
        {speeds.length > 1 && (
          <path d={path(speeds.map((p) => ({ x: x(p.observedAt), y: ySpeed(p.speedKmS) })))} fill="none" stroke="rgba(217,222,226,0.95)" strokeWidth="1.8" />
        )}

        <text x={PAD.left} y={HEIGHT - 8} fontSize="10" fill="var(--color-faint)">{points[0]?.observedAt.slice(11, 16)}</text>
        <text x={WIDTH - PAD.right - 30} y={HEIGHT - 8} fontSize="10" fill="var(--color-faint)">{points[points.length - 1]?.observedAt.slice(11, 16)} UTC</text>
      </svg>

      <figcaption id={describedBy} className="mt-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-0.5 w-6 bg-silver" /> Speed (km/s, left)
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-0.5 w-6 border-t-2 border-dashed border-nasa" /> Bz GSM (nT, right)
          </li>
        </ul>
        <p className="mt-2 text-xs leading-relaxed text-faint">{summary}</p>
      </figcaption>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-muted hover:text-fg">Show these values as a table</summary>
        <div className="mt-2 max-h-72 overflow-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{summary}</caption>
            <thead className="sticky top-0 bg-surface text-faint">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Observed at L1 (UTC)</th>
                <th scope="col" className="px-3 py-2 font-medium">Speed (km/s)</th>
                <th scope="col" className="px-3 py-2 font-medium">Density (cm⁻³)</th>
                <th scope="col" className="px-3 py-2 font-medium">Bt (nT)</th>
                <th scope="col" className="px-3 py-2 font-medium">Bz GSM (nT)</th>
                <th scope="col" className="px-3 py-2 font-medium">Modelled arrival</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[...points].reverse().map((p) => (
                <tr key={p.observedAt}>
                  <td className="px-3 py-1.5 text-muted">{p.observedAt.slice(11, 16)}</td>
                  <td className="px-3 py-1.5 font-medium text-fg">{p.speedKmS?.toFixed(0) ?? "—"}</td>
                  <td className="px-3 py-1.5 text-muted">{p.densityPerCm3?.toFixed(2) ?? "—"}</td>
                  <td className="px-3 py-1.5 text-muted">{p.btNt?.toFixed(1) ?? "—"}</td>
                  <td className="px-3 py-1.5 text-muted">{p.bzNt?.toFixed(1) ?? "—"}</td>
                  <td className="px-3 py-1.5 text-muted">{p.arrivesAt?.slice(11, 16) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-faint">
          An em dash means the provider published no value for that field in that row — it does not mean zero.
        </p>
      </details>
    </figure>
  );
}
