import type { CSSProperties } from "react";
import { starField, brightStars, milkyWay, CONSTELLATIONS, type Constellation } from "@/lib/cosmos/starfield";

/**
 * Deep-space decoration — original monochrome vector art (a realistic star field
 * with a Milky Way band and diffraction-spiked bright stars, real constellation
 * figures, and vector renderings of the Sun, Saturn and the Moon) that make the
 * platform feel like the real night sky: black, white, and silver, no colour.
 *
 * All Server Components: no client JS, deterministic geometry (no hydration
 * mismatch), `aria-hidden`, absolutely positioned so nothing shifts layout.
 * `uid` namespaces the SVG `<defs>` ids so several instances on one page never
 * collide (no `useId`, so these stay Server Components).
 */

const STARS = starField(150);
const STARS_DENSE = starField(240, 1000, 600, 990201);
const MILKY = milkyWay(360);
const BRIGHT = brightStars(9);
const BRIGHT_DENSE = brightStars(14, 1000, 600, 5150);

function BrightStar({ x, y, r, spike, o }: { x: number; y: number; r: number; spike: number; o: number }) {
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r * 3.4} fill="#ffffff" opacity={0.1} />
      <g stroke="#ffffff" strokeLinecap="round">
        <line x1={x - spike} y1={y} x2={x + spike} y2={y} strokeWidth={0.7} opacity={0.7} />
        <line x1={x} y1={y - spike} x2={x} y2={y + spike} strokeWidth={0.7} opacity={0.7} />
        <line x1={x - spike * 0.4} y1={y - spike * 0.4} x2={x + spike * 0.4} y2={y + spike * 0.4} strokeWidth={0.4} opacity={0.35} />
        <line x1={x - spike * 0.4} y1={y + spike * 0.4} x2={x + spike * 0.4} y2={y - spike * 0.4} strokeWidth={0.4} opacity={0.35} />
      </g>
      <circle cx={x} cy={y} r={r} fill="#ffffff" />
    </g>
  );
}

/** A realistic field of stars — faint dust, a Milky Way band, and bright glints. */
export function Starfield({ uid = "sf", dense = false, milky = true, className = "" }: { uid?: string; dense?: boolean; milky?: boolean; className?: string }) {
  const stars = dense ? STARS_DENSE : STARS;
  const bright = dense ? BRIGHT_DENSE : BRIGHT;
  return (
    <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      {milky ? (
        <>
          <defs>
            <linearGradient id={`${uid}-mw`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#c9d3e6" stopOpacity="0.05" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="0,560 340,600 1000,150 1000,10 700,0 0,430" fill={`url(#${uid}-mw)`} />
          {MILKY.map((s, i) => (
            <circle key={`mw${i}`} cx={s.x} cy={s.y} r={s.r} fill="#eef2fb" opacity={s.o} />
          ))}
        </>
      ) : null}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f2f6ff" opacity={s.o} />
      ))}
      {bright.map((s, i) => (
        <BrightStar key={`b${i}`} {...s} />
      ))}
    </svg>
  );
}

function ConstellationFigure({ c, ox, oy, scale, opacity }: { c: Constellation; ox: number; oy: number; scale: number; opacity: number }) {
  const pts = c.stars.map(([x, y]) => [ox + x * scale, oy + y * scale] as const);
  return (
    <g opacity={opacity}>
      {c.lines.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#c9d3e6" strokeWidth={0.7} />
      ))}
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={(i % 3 === 0 ? 2.2 : 1.4) * 2.6} fill="#ffffff" opacity={0.1} />
          <circle cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.4} fill="#ffffff" />
        </g>
      ))}
    </g>
  );
}

/** Real constellation figures, faintly drawn in silver-white. */
export function ConstellationField({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <ConstellationFigure c={CONSTELLATIONS[0]} ox={70} oy={100} scale={330} opacity={0.34} />
      <ConstellationFigure c={CONSTELLATIONS[1]} ox={630} oy={64} scale={350} opacity={0.24} />
      <ConstellationFigure c={CONSTELLATIONS[2]} ox={500} oy={370} scale={300} opacity={0.2} />
    </svg>
  );
}

/* ---- Original celestial bodies (monochrome vector renderings) ---- */

/** The Sun — a luminous white star with a soft corona. */
export function Sun({ uid = "sun", cx, cy, r, className = "" }: { uid?: string; cx: number; cy: number; r: number; className?: string }) {
  return (
    <g aria-hidden className={className}>
      <defs>
        <radialGradient id={`${uid}-g`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f4f7ff" />
          <stop offset="1" stopColor="#c7d1e4" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.3" stopColor="#dfe7f5" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * 3.2} fill={`url(#${uid}-glow)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-g)`} />
    </g>
  );
}

/** Saturn — a shaded silver sphere with a tilted ring system. */
export function Saturn({ uid = "sat", cx, cy, r, className = "" }: { uid?: string; cx: number; cy: number; r: number; className?: string }) {
  return (
    <g aria-hidden className={className} transform={`rotate(-18 ${cx} ${cy})`}>
      <defs>
        <radialGradient id={`${uid}-body`} cx="0.36" cy="0.32" r="0.85">
          <stop offset="0" stopColor="#eef2f8" />
          <stop offset="0.5" stopColor="#aab3c4" />
          <stop offset="1" stopColor="#3a414f" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      {/* far half of the rings (behind the planet) */}
      <g fill="none" opacity="0.75">
        <ellipse cx={cx} cy={cy} rx={r * 2.05} ry={r * 0.5} stroke="#c6cede" strokeWidth={r * 0.14} />
        <ellipse cx={cx} cy={cy} rx={r * 1.62} ry={r * 0.4} stroke="#8b93a6" strokeWidth={r * 0.06} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-body)`} />
      {/* subtle atmospheric bands */}
      <g clipPath={`url(#${uid}-clip)`} stroke="#ffffff" opacity="0.10">
        <line x1={cx - r} y1={cy - r * 0.35} x2={cx + r} y2={cy - r * 0.35} strokeWidth={r * 0.08} />
        <line x1={cx - r} y1={cy + r * 0.1} x2={cx + r} y2={cy + r * 0.1} strokeWidth={r * 0.06} />
      </g>
      {/* near half of the rings (in front, lower arc) */}
      <path d={`M ${cx - r * 2.05} ${cy} A ${r * 2.05} ${r * 0.5} 0 0 0 ${cx + r * 2.05} ${cy}`} fill="none" stroke="#e6ebf5" strokeWidth={r * 0.14} opacity="0.9" />
      <path d={`M ${cx - r * 1.62} ${cy} A ${r * 1.62} ${r * 0.4} 0 0 0 ${cx + r * 1.62} ${cy}`} fill="none" stroke="#9aa2b4" strokeWidth={r * 0.06} opacity="0.9" />
    </g>
  );
}

/** The Moon — a cratered grey sphere, lit from one side. */
export function Moon({ uid = "moon", cx, cy, r, className = "" }: { uid?: string; cx: number; cy: number; r: number; className?: string }) {
  return (
    <g aria-hidden className={className}>
      <defs>
        <radialGradient id={`${uid}-g`} cx="0.34" cy="0.32" r="0.9">
          <stop offset="0" stopColor="#f1f3f8" />
          <stop offset="0.6" stopColor="#aeb4c0" />
          <stop offset="1" stopColor="#2f3540" />
        </radialGradient>
        <clipPath id={`${uid}-c`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-g)`} />
      <g clipPath={`url(#${uid}-c)`} fill="#6b7280" opacity="0.35">
        <circle cx={cx - r * 0.3} cy={cy - r * 0.28} r={r * 0.18} />
        <circle cx={cx + r * 0.22} cy={cy - r * 0.05} r={r * 0.12} />
        <circle cx={cx - r * 0.05} cy={cy + r * 0.34} r={r * 0.2} />
        <circle cx={cx + r * 0.4} cy={cy + r * 0.36} r={r * 0.1} />
        <circle cx={cx - r * 0.5} cy={cy + r * 0.05} r={r * 0.08} />
      </g>
    </g>
  );
}

type BackdropVariant = "hero" | "section" | "subtle";
type Body = "none" | "saturn" | "moon" | "sun";

/**
 * A full deep-space scene: near-black, a Milky Way band, the star field with
 * bright glints, constellation figures, and — for heroes — one large celestial
 * body (Saturn, the Moon, or the Sun). Place inside a `relative` container.
 */
export function CosmicBackdrop({
  uid = "bd",
  variant = "hero",
  body = "none",
  fixed = false,
  fade = true,
  className = "",
  style,
}: {
  uid?: string;
  variant?: BackdropVariant;
  body?: Body;
  fixed?: boolean;
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div aria-hidden className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 -z-10 overflow-hidden ${className}`} style={style}>
      <Starfield uid={uid} dense={variant === "hero"} milky={variant !== "subtle"} className={variant === "subtle" ? "opacity-70" : ""} />
      {variant !== "subtle" ? <ConstellationField /> : null}
      {body !== "none" ? (
        <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          {body === "saturn" ? <Saturn uid={`${uid}-b`} cx={862} cy={168} r={78} /> : null}
          {body === "moon" ? <Moon uid={`${uid}-b`} cx={870} cy={150} r={88} /> : null}
          {body === "sun" ? <Sun uid={`${uid}-b`} cx={880} cy={140} r={64} /> : null}
        </svg>
      ) : null}
      {fade ? <div className="absolute inset-x-0 bottom-0 h-32 bg-black/70" /> : null}
    </div>
  );
}

/** A small star-chart cluster used as a section-header accent. */
export function StarChartAccent({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={`inline-block ${className}`} width="26" height="26">
      <g stroke="#c9d3e6" strokeWidth="1" opacity="0.7">
        <line x1="8" y1="34" x2="20" y2="14" />
        <line x1="20" y1="14" x2="34" y2="22" />
        <line x1="34" y1="22" x2="40" y2="10" />
        <line x1="20" y1="14" x2="26" y2="34" />
      </g>
      <g fill="#ffffff">
        <circle cx="8" cy="34" r="1.6" />
        <circle cx="20" cy="14" r="2.3" />
        <circle cx="34" cy="22" r="1.6" />
        <circle cx="40" cy="10" r="1.4" />
        <circle cx="26" cy="34" r="1.5" />
      </g>
    </svg>
  );
}

/** A horizontal constellation-line divider between sections. `idKey` namespaces
 *  the gradient ids so multiple dividers on one page keep unique DOM ids. */
export function ConstellationDivider({ idKey = "x", className = "" }: { idKey?: string; className?: string }) {
  const l = `cdl-${idKey}`;
  const r = `cdr-${idKey}`;
  return (
    <div aria-hidden className={`relative flex items-center justify-center py-2 ${className}`}>
      <svg viewBox="0 0 600 24" className="h-6 w-full max-w-3xl" preserveAspectRatio="xMidYMid meet">
        <line x1="0" y1="12" x2="230" y2="12" stroke={`url(#${l})`} strokeWidth="1" />
        <line x1="370" y1="12" x2="600" y2="12" stroke={`url(#${r})`} strokeWidth="1" />
        <defs>
          <linearGradient id={l} x1="0" x2="1"><stop offset="0" stopColor="#c9d3e6" stopOpacity="0" /><stop offset="1" stopColor="#c9d3e6" stopOpacity="0.55" /></linearGradient>
          <linearGradient id={r} x1="0" x2="1"><stop offset="0" stopColor="#c9d3e6" stopOpacity="0.55" /><stop offset="1" stopColor="#c9d3e6" stopOpacity="0" /></linearGradient>
        </defs>
        <g stroke="#c9d3e6" strokeWidth="0.9" opacity="0.85">
          <line x1="250" y1="12" x2="290" y2="5" /><line x1="290" y1="5" x2="310" y2="19" /><line x1="310" y1="19" x2="350" y2="12" />
        </g>
        <g fill="#ffffff">
          <circle cx="250" cy="12" r="1.6" /><circle cx="290" cy="5" r="1.6" /><circle cx="300" cy="12" r="2.4" /><circle cx="310" cy="19" r="1.6" /><circle cx="350" cy="12" r="1.6" />
        </g>
      </svg>
    </div>
  );
}
