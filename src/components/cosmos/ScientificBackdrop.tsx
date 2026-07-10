import { starField, CONSTELLATIONS } from "@/lib/cosmos/starfield";

/**
 * The premium deep-space background for every non-homepage page.
 *
 * A near-black field with *barely visible* scientific decoration — a faint
 * celestial coordinate graticule, a couple of soft orbital curves, a sparse dim
 * star field, and one quiet constellation figure. The intent is NASA SVS / ESA /
 * Nature Astronomy restraint: the background supports the content and never
 * competes with it. No purple, no glow, no gradients that read as "landing page".
 *
 * Server Component: deterministic geometry (no hydration mismatch, no client JS),
 * `aria-hidden`, fixed and `-z-10` so it never causes layout shift.
 */

const W = 1000;
const H = 600;

// Faint dim stars (rendered at low group opacity so they stay subliminal).
const STARS = starField(90, W, H, 314159);

// Celestial graticule — meridians (constant RA) and parallels (constant Dec),
// gently bowed to suggest a projected sphere.
const MERIDIANS = Array.from({ length: 9 }, (_, i) => {
  const x = (i / 8) * W;
  const bow = (x - W / 2) * 0.055;
  return `M ${x.toFixed(1)} 0 Q ${(x + bow).toFixed(1)} ${H / 2} ${x.toFixed(1)} ${H}`;
});
const PARALLELS = Array.from({ length: 7 }, (_, j) => {
  const y = (j / 6) * H;
  const bow = (y - H / 2) * 0.05;
  return `M 0 ${y.toFixed(1)} Q ${W / 2} ${(y + bow).toFixed(1)} ${W} ${y.toFixed(1)}`;
});

/** One quiet constellation figure (the Big Dipper), drawn very faintly. */
function FaintConstellation() {
  const c = CONSTELLATIONS[1];
  const ox = 610;
  const oy = 70;
  const scale = 330;
  const pts = c.stars.map(([x, y]) => [ox + x * scale, oy + y * scale] as const);
  return (
    <g opacity={0.14}>
      {c.lines.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#aeb9d2" strokeWidth={0.6} />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 1} fill="#e6ecf8" />
      ))}
    </g>
  );
}

export function ScientificBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* A soft vignette so the edges fall to pure black. */}
          <radialGradient id="sci-vignette" cx="0.5" cy="0.42" r="0.75">
            <stop offset="0" stopColor="#04070c" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Coordinate graticule — the faintest scientific grid. */}
        <g stroke="#9fb0d0" strokeWidth={0.4} fill="none" opacity={0.05}>
          {MERIDIANS.map((d, i) => (
            <path key={`m${i}`} d={d} />
          ))}
          {PARALLELS.map((d, i) => (
            <path key={`p${i}`} d={d} />
          ))}
        </g>

        {/* Barely-visible orbital curves. */}
        <g stroke="#b6c4de" fill="none">
          <ellipse cx={792} cy={128} rx={352} ry={112} opacity={0.05} strokeWidth={0.5} transform="rotate(-17 792 128)" />
          <ellipse cx={214} cy={486} rx={286} ry={92} opacity={0.04} strokeWidth={0.5} transform="rotate(12 214 486)" />
        </g>

        {/* Sparse, dim stars. */}
        <g fill="#dbe4f6" opacity={0.55}>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={Math.min(s.r, 1.1)} opacity={s.o * 0.7} />
          ))}
        </g>

        <FaintConstellation />

        <rect x="0" y="0" width={W} height={H} fill="url(#sci-vignette)" />
      </svg>
    </div>
  );
}
