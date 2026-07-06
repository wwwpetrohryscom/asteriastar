import { bvToColor, projectScene, projectRing, radius3D, type Scene3D } from "@/lib/universe-3d/projection3d";

/**
 * Server-rendered static projection of a real 3D scene (Program BU). Every dot sits at a measured
 * position projected through a fixed camera; nothing is invented. This is the SSG base and the no-JS /
 * reduced-motion / accessibility fallback for the interactive viewer — it renders identically on the
 * server, needs no client JavaScript, and is followed by a data table of the plotted objects.
 */
export function StaticUniverse({
  scene,
  width = 720,
  height = 460,
  labelCount = 10,
  ariaLabel,
}: {
  scene: Scene3D;
  width?: number;
  height?: number;
  labelCount?: number;
  ariaLabel?: string;
}) {
  const projected = projectScene(scene.points, scene.camera, width, height);
  const byId = new Map(projected.map((p) => [p.id, p]));

  // Brightest (lowest-magnitude) plotted points get labels.
  const labelled = new Set(
    [...projected]
      .filter((p) => typeof p.magnitude === "number")
      .sort((a, b) => (a.magnitude! - b.magnitude!))
      .slice(0, labelCount)
      .map((p) => p.id),
  );

  const rings = (scene.rings ?? []).map((r) => projectRing(r, scene.camera, width, height));

  return (
    <figure className="m-0">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#04060d]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          role="img"
          aria-label={ariaLabel ?? `Projection of ${projected.length} objects at their measured positions`}
          className="block"
        >
          <rect x={0} y={0} width={width} height={height} fill="#04060d" />
          {/* reference rings (orbits / distance shells) on the scene plane */}
          {rings.map((r, i) => (
            <g key={`ring${i}`}>
              {r.d ? <path d={r.d} fill="none" stroke="#ffffff" strokeOpacity={0.10} strokeWidth={1} /> : null}
              {r.label && scene.rings?.[i]?.label ? (
                <text x={(r.label.x + 3).toFixed(1)} y={(r.label.y - 3).toFixed(1)} fill="#ffffff" fillOpacity={0.3} fontSize={9}>
                  {scene.rings[i].label}
                </text>
              ) : null}
            </g>
          ))}
          {/* connectors (constellation lines, scale rungs) behind the points */}
          {(scene.segments ?? []).map((s, i) => {
            const a = byId.get(s.a.id);
            const b = byId.get(s.b.id);
            if (!a || !b) return null;
            return (
              <line
                key={`seg${i}`}
                x1={a.sx.toFixed(1)}
                y1={a.sy.toFixed(1)}
                x2={b.sx.toFixed(1)}
                y2={b.sy.toFixed(1)}
                stroke="#8ab4ff"
                strokeOpacity={0.28}
                strokeWidth={1}
              />
            );
          })}
          {/* real objects, far → near */}
          {projected.map((p) => (
            <circle
              key={p.id}
              cx={p.sx.toFixed(1)}
              cy={p.sy.toFixed(1)}
              r={radius3D(p).toFixed(2)}
              fill={bvToColor(p.colorIndex)}
              fillOpacity={0.9}
            />
          ))}
          {/* labels for the brightest */}
          {projected.map((p) =>
            labelled.has(p.id) ? (
              <text key={`l${p.id}`} x={(p.sx + 4).toFixed(1)} y={(p.sy - 3).toFixed(1)} fill="#dfe8ff" fillOpacity={0.75} fontSize={9}>
                {p.name}
              </text>
            ) : null,
          )}
        </svg>
      </div>
      {scene.coverageNote ? (
        <figcaption className="mt-2 text-xs text-white/50">{scene.coverageNote}</figcaption>
      ) : null}
    </figure>
  );
}
