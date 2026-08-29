import type { GroundTrackPoint } from "@/platform/satellites/ephemeris";

/**
 * The ISS ground track on an equirectangular projection, as inline SVG.
 *
 * No map tiles, no image, no library: a coastline would be decoration, and what the picture has to
 * communicate is the shape of the track and where on it the station currently is. A graticule every
 * thirty degrees gives the eye enough to locate the path, and the numbers underneath give the
 * precise answer for anyone who needs one.
 *
 * The track is split wherever it crosses the antimeridian, so the line does not draw itself
 * straight across the map from +179° to −179° — which would be visually wrong and, on a chart about
 * position, misleading rather than merely ugly.
 */

const WIDTH = 720;
const HEIGHT = 360;
const x = (lon: number) => ((lon + 180) / 360) * WIDTH;
const y = (lat: number) => ((90 - lat) / 180) * HEIGHT;

function segments(points: GroundTrackPoint[]): GroundTrackPoint[][] {
  const out: GroundTrackPoint[][] = [];
  let current: GroundTrackPoint[] = [];
  for (let i = 0; i < points.length; i++) {
    if (i > 0 && Math.abs(points[i].longitudeDeg - points[i - 1].longitudeDeg) > 180) {
      if (current.length > 1) out.push(current);
      current = [];
    }
    current.push(points[i]);
  }
  if (current.length > 1) out.push(current);
  return out;
}

export function GroundTrack({
  track,
  nowMs,
  latitudeDeg,
  longitudeDeg,
  describedBy,
}: {
  track: GroundTrackPoint[];
  nowMs: number;
  latitudeDeg: number;
  longitudeDeg: number;
  describedBy: string;
}) {
  if (track.length < 2) return null;
  const past = track.filter((p) => p.timeMs <= nowMs);
  const future = track.filter((p) => p.timeMs >= nowMs);

  const summary = `Ground track of the International Space Station over roughly one orbit either side of now. It is currently over ${Math.abs(latitudeDeg).toFixed(1)} degrees ${latitudeDeg >= 0 ? "north" : "south"}, ${Math.abs(longitudeDeg).toFixed(1)} degrees ${longitudeDeg >= 0 ? "east" : "west"}.`;

  const draw = (points: GroundTrackPoint[], dash?: string) =>
    segments(points).map((seg, i) => (
      <path
        key={`${dash ?? "solid"}-${i}`}
        d={seg.map((p, j) => `${j === 0 ? "M" : "L"}${x(p.longitudeDeg).toFixed(1)} ${y(p.latitudeDeg).toFixed(1)}`).join(" ")}
        fill="none"
        stroke={dash ? "var(--color-nasa)" : "rgba(217,222,226,0.6)"}
        strokeWidth={dash ? 1.8 : 1.4}
        strokeDasharray={dash}
      />
    ));

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full rounded-lg border border-white/10 bg-black/40" role="img" aria-label={summary} aria-describedby={describedBy} preserveAspectRatio="xMidYMid meet">
        {/* Graticule every 30°, with the equator drawn more strongly. */}
        {[-60, -30, 0, 30, 60].map((lat) => (
          <g key={`lat${lat}`}>
            <line x1={0} y1={y(lat)} x2={WIDTH} y2={y(lat)} stroke={lat === 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"} strokeWidth="1" />
            <text x={4} y={y(lat) - 3} fontSize="10" fill="var(--color-faint)">{lat}°</text>
          </g>
        ))}
        {[-120, -60, 0, 60, 120].map((lon) => (
          <g key={`lon${lon}`}>
            <line x1={x(lon)} y1={0} x2={x(lon)} y2={HEIGHT} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x={x(lon) + 3} y={HEIGHT - 4} fontSize="10" fill="var(--color-faint)">{lon}°</text>
          </g>
        ))}
        {/* The 51.6° inclination limits: the station never goes beyond them, which is why the
            track's shape is the shape it is. */}
        {[51.6, -51.6].map((lat) => (
          <line key={`inc${lat}`} x1={0} y1={y(lat)} x2={WIDTH} y2={y(lat)} stroke="rgba(255,42,26,0.28)" strokeWidth="1" strokeDasharray="3 4" />
        ))}

        {draw(past)}
        {draw(future, "5 3")}

        <circle cx={x(longitudeDeg)} cy={y(latitudeDeg)} r="5" fill="var(--color-nasa)" />
        <circle cx={x(longitudeDeg)} cy={y(latitudeDeg)} r="9" fill="none" stroke="var(--color-nasa)" strokeWidth="1.2" opacity="0.6" />
      </svg>

      <figcaption id={describedBy} className="mt-3 space-y-2">
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
          <li className="flex items-center gap-1.5"><span aria-hidden className="inline-block h-0.5 w-6 bg-silver/60" /> Path already flown</li>
          <li className="flex items-center gap-1.5"><span aria-hidden className="inline-block h-0.5 w-6 border-t-2 border-dashed border-nasa" /> Path ahead</li>
          <li className="flex items-center gap-1.5"><span aria-hidden className="inline-block h-2 w-2 rounded-full bg-nasa" /> Position now</li>
          <li className="flex items-center gap-1.5"><span aria-hidden className="inline-block h-0.5 w-6 border-t border-dashed border-nasa/40" /> 51.6° inclination limit</li>
        </ul>
        <p className="text-xs leading-relaxed text-faint">{summary}</p>
      </figcaption>
    </figure>
  );
}
