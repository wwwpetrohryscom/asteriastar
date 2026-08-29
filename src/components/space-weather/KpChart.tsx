import type { KpPoint } from "@/platform/space-weather/model";
import { gScaleForKp } from "@/platform/space-weather/explain";
import { utcStamp } from "@/components/space-weather/LiveStatus";

/**
 * The planetary K-index over time, as inline SVG.
 *
 * Three things this chart refuses to do. It does not smooth a forecast into an observation:
 * observed, estimated and predicted bars are drawn differently and labelled in the key. It does not
 * rely on colour to carry that difference — the predicted bars are hatched and the estimated ones
 * outlined, so the distinction survives greyscale and colour-blindness. And it is not the only way
 * to read the data: every bar is also a row in a table underneath, which is what a screen reader,
 * a text browser and a reader who simply prefers numbers get.
 *
 * No charting library: a bar chart of forty values is about eighty SVG elements, and shipping a
 * hundred kilobytes of JavaScript to draw them would be a worse page for every reader.
 */

const WIDTH = 720;
const HEIGHT = 220;
const PAD = { top: 12, right: 12, bottom: 30, left: 30 };
const MAX_KP = 9;

const PROVENANCE_LABEL: Record<KpPoint["provenance"], string> = {
  observed: "Observed",
  estimated: "Estimated (interval in progress)",
  predicted: "Predicted (forecast)",
};

export function KpChart({ points, title, describedBy }: { points: KpPoint[]; title: string; describedBy: string }) {
  if (points.length === 0) return null;

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const barW = Math.max(2, plotW / points.length - 2);
  const x = (i: number) => PAD.left + (i * plotW) / points.length;
  const y = (kp: number) => PAD.top + plotH - (Math.min(kp, MAX_KP) / MAX_KP) * plotH;

  const storms = points.filter((p) => p.kp >= 5).length;
  const peak = points.reduce((a, b) => (b.kp > a.kp ? b : a));
  const summary = `${title}: ${points.length} three-hour intervals, peak planetary K-index ${peak.kp.toFixed(2)} at ${utcStamp(peak.at)}${storms > 0 ? `, ${storms} interval${storms === 1 ? "" : "s"} at storm level (Kp 5 or above)` : ", no interval reached storm level"}.`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={summary}
        aria-describedby={describedBy}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* A hatch, not a hue: this is what keeps "predicted" readable without colour. */}
          <pattern id="kp-predicted" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="rgba(255,255,255,0.06)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
          </pattern>
        </defs>

        {/* Horizontal guides at each Kp level, with the storm threshold called out. */}
        {[0, 3, 5, 7, 9].map((k) => (
          <g key={k}>
            <line
              x1={PAD.left}
              y1={y(k)}
              x2={WIDTH - PAD.right}
              y2={y(k)}
              stroke={k === 5 ? "var(--color-nasa)" : "rgba(255,255,255,0.12)"}
              strokeWidth={k === 5 ? 1.2 : 1}
              strokeDasharray={k === 5 ? "4 3" : undefined}
            />
            <text x={4} y={y(k) + 4} fontSize="11" fill="var(--color-faint)">{k}</text>
          </g>
        ))}

        {points.map((p, i) => {
          const h = PAD.top + plotH - y(p.kp);
          const isStorm = p.kp >= 5;
          const fill =
            p.provenance === "predicted"
              ? "url(#kp-predicted)"
              : isStorm
                ? "var(--color-nasa)"
                : "rgba(217,222,226,0.85)";
          return (
            <rect
              key={`${p.at}-${p.provenance}`}
              x={x(i)}
              y={y(p.kp)}
              width={barW}
              height={Math.max(1, h)}
              fill={fill}
              stroke={p.provenance === "estimated" ? "rgba(255,255,255,0.9)" : "none"}
              strokeWidth={p.provenance === "estimated" ? 1 : 0}
              strokeDasharray={p.provenance === "estimated" ? "3 2" : undefined}
            />
          );
        })}

        {/* Day boundaries as the x-axis: a tick every eight intervals is one label per day. */}
        {points.map((p, i) =>
          i % 8 === 0 ? (
            <text key={`t-${p.at}`} x={x(i)} y={HEIGHT - 10} fontSize="11" fill="var(--color-faint)">
              {p.at.slice(5, 10)}
            </text>
          ) : null,
        )}
      </svg>

      <figcaption id={describedBy} className="mt-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-3 w-3 rounded-sm bg-silver/85" /> Observed
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-3 w-3 rounded-sm border border-dashed border-white/90" /> Estimated
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-3 w-3 rounded-sm border border-white/40 bg-white/10" /> Predicted
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-3 w-3 rounded-sm bg-nasa" /> Kp 5 or above (storm level)
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
                <th scope="col" className="px-3 py-2 font-medium">Interval start (UTC)</th>
                <th scope="col" className="px-3 py-2 font-medium">Kp</th>
                <th scope="col" className="px-3 py-2 font-medium">NOAA G-level</th>
                <th scope="col" className="px-3 py-2 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {points.map((p) => {
                const g = gScaleForKp(p.kp);
                return (
                  <tr key={`row-${p.at}-${p.provenance}`}>
                    <td className="px-3 py-1.5 text-muted">{utcStamp(p.at)}</td>
                    <td className="px-3 py-1.5 font-medium text-fg">{p.kp.toFixed(2)}</td>
                    <td className="px-3 py-1.5 text-muted">{g === 0 ? "—" : `G${g}`}</td>
                    <td className="px-3 py-1.5 text-muted">{PROVENANCE_LABEL[p.provenance]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
