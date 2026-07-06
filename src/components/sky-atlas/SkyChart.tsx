import { plotEquirectangular, type SkyPoint } from "@/lib/sky-atlas/projection";

/**
 * Server-rendered all-sky star chart. Plots REAL sky points (measured right ascension / declination)
 * on an equirectangular grid as scalable vector graphics. No position is invented — every dot is a
 * catalogued object at its measured coordinates. Labels are shown for a handful of the brightest.
 */
export function SkyChart({
  points,
  width = 720,
  height = 360,
  labelCount = 12,
  accent = "#8ab4ff",
}: {
  points: SkyPoint[];
  width?: number;
  height?: number;
  labelCount?: number;
  accent?: string;
}) {
  const plotted = plotEquirectangular(points, width, height);
  // Label the brightest (lowest-magnitude) points.
  const labelled = [...plotted]
    .filter((p) => typeof p.magnitude === "number")
    .sort((a, b) => (a.magnitude! - b.magnitude!))
    .slice(0, labelCount);
  const labelledIds = new Set(labelled.map((p) => p.id));

  const raGrid = [0, 60, 120, 180, 240, 300]; // degrees
  const decGrid = [-60, -30, 0, 30, 60];

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#05070f]">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={`Sky chart of ${plotted.length} objects at their measured positions`} className="block">
        <rect x={0} y={0} width={width} height={height} fill="#05070f" />
        {/* graticule */}
        {raGrid.map((ra) => {
          const x = (1 - ra / 360) * width;
          return <line key={`ra${ra}`} x1={x} y1={0} x2={x} y2={height} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={1} />;
        })}
        {decGrid.map((dec) => {
          const y = (1 - (dec + 90) / 180) * height;
          return (
            <g key={`dec${dec}`}>
              <line x1={0} y1={y} x2={width} y2={y} stroke="#ffffff" strokeOpacity={dec === 0 ? 0.16 : 0.06} strokeWidth={1} />
              <text x={4} y={y - 3} fill="#ffffff" fillOpacity={0.28} fontSize={9}>{dec > 0 ? `+${dec}°` : `${dec}°`}</text>
            </g>
          );
        })}
        {/* objects */}
        {plotted.map((p) => (
          <circle key={p.id} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={p.r.toFixed(2)} fill={accent} fillOpacity={0.85} />
        ))}
        {/* labels for the brightest */}
        {labelled.map((p) => (
          labelledIds.has(p.id) ? (
            <text key={`l${p.id}`} x={(p.x + 4).toFixed(1)} y={(p.y - 3).toFixed(1)} fill="#dfe8ff" fillOpacity={0.75} fontSize={9}>{p.name}</text>
          ) : null
        ))}
      </svg>
    </div>
  );
}
