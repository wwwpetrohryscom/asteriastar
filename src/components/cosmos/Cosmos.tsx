import type { CSSProperties } from "react";
import { starField, CONSTELLATIONS, type Constellation } from "@/lib/cosmos/starfield";

/**
 * Decorative cosmic layers — original vector art (star fields, constellation
 * figures, orbital rings, a celestial grid) that give the platform a serious,
 * NASA/ESA-style astronomical feel. Everything is a Server Component: no client
 * JS, deterministic geometry (no hydration mismatch), `aria-hidden`, and
 * absolutely positioned so it never causes layout shift.
 */

const STARS = starField(140);
const STARS_DENSE = starField(220, 1000, 600, 990201);

/** A quiet field of stars. */
export function Starfield({ dense = false, className = "" }: { dense?: boolean; className?: string }) {
  const stars = dense ? STARS_DENSE : STARS;
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#eaf2ff" opacity={s.o} />
      ))}
    </svg>
  );
}

function ConstellationFigure({ c, ox, oy, scale, opacity }: { c: Constellation; ox: number; oy: number; scale: number; opacity: number }) {
  const pts = c.stars.map(([x, y]) => [ox + x * scale, oy + y * scale] as const);
  return (
    <g opacity={opacity}>
      {c.lines.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#8fbfff" strokeWidth={0.8} />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.9 : 1.3} fill="#dbe9ff" />
      ))}
    </g>
  );
}

/** A few real constellation figures, faintly drawn across the field. */
export function ConstellationField({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <ConstellationFigure c={CONSTELLATIONS[0]} ox={80} oy={90} scale={320} opacity={0.22} />
      <ConstellationFigure c={CONSTELLATIONS[1]} ox={640} oy={70} scale={340} opacity={0.16} />
      <ConstellationFigure c={CONSTELLATIONS[2]} ox={520} oy={360} scale={300} opacity={0.14} />
    </svg>
  );
}

/** Concentric orbital rings, off to one side. */
export function OrbitalLines({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g fill="none" stroke="#f6d27a" opacity="0.14">
        <ellipse cx="820" cy="150" rx="150" ry="150" strokeWidth="1" />
        <ellipse cx="820" cy="150" rx="250" ry="250" strokeWidth="1" opacity="0.7" />
        <ellipse cx="820" cy="150" rx="360" ry="360" strokeWidth="1" opacity="0.45" />
      </g>
      <circle cx="670" cy="150" r="2.5" fill="#f6d27a" opacity="0.7" />
      <circle cx="970" cy="150" r="2" fill="#8fbfff" opacity="0.6" />
    </svg>
  );
}

/** A faint celestial coordinate grid (curved meridians + parallels). */
export function ScientificGrid({ className = "" }: { className?: string }) {
  const parallels = [120, 220, 320, 420, 520];
  const meridians = [100, 300, 500, 700, 900];
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g stroke="#3b6ea5" strokeWidth="0.6" opacity="0.16" fill="none">
        {parallels.map((y, i) => (
          <path key={`p${i}`} d={`M0 ${y} Q500 ${y - 34} 1000 ${y}`} />
        ))}
        {meridians.map((x, i) => (
          <path key={`m${i}`} d={`M${x} 0 Q${x + 26} 300 ${x} 600`} />
        ))}
      </g>
    </svg>
  );
}

type BackdropVariant = "hero" | "section" | "subtle";

/**
 * Composed background for heroes and feature sections: a deep-navy wash plus the
 * star field, constellation figures, orbital rings, and celestial grid, layered
 * for depth. Place inside a `relative` container; it fills and sits behind
 * content. `variant` tunes how much shows through.
 */
export function CosmicBackdrop({
  variant = "hero",
  fixed = false,
  fade = true,
  className = "",
  style,
}: {
  variant?: BackdropVariant;
  fixed?: boolean;
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div aria-hidden className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 -z-10 overflow-hidden ${className}`} style={style}>
      {variant !== "subtle" ? (
        <div className="absolute inset-0 bg-[radial-gradient(1200px_680px_at_78%_-8%,rgba(56,110,165,0.20),transparent_60%),radial-gradient(900px_520px_at_6%_108%,rgba(246,210,122,0.07),transparent_55%)]" />
      ) : null}
      <ScientificGrid className={variant === "subtle" ? "opacity-30" : "opacity-70"} />
      <Starfield dense={variant === "hero"} className={variant === "subtle" ? "opacity-55" : ""} />
      {variant !== "subtle" ? <ConstellationField /> : null}
      {variant === "hero" ? <OrbitalLines /> : null}
      {fade ? <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg" /> : null}
    </div>
  );
}

/** A small star-chart cluster used as a section-header accent. */
export function StarChartAccent({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={`inline-block ${className}`} width="26" height="26">
      <g stroke="#56b6f6" strokeWidth="1" opacity="0.7">
        <line x1="8" y1="34" x2="20" y2="14" />
        <line x1="20" y1="14" x2="34" y2="22" />
        <line x1="34" y1="22" x2="40" y2="10" />
        <line x1="20" y1="14" x2="26" y2="34" />
      </g>
      <g fill="#dbe9ff">
        <circle cx="8" cy="34" r="1.6" />
        <circle cx="20" cy="14" r="2.1" fill="#f6d27a" />
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
          <linearGradient id={l} x1="0" x2="1"><stop offset="0" stopColor="#56b6f6" stopOpacity="0" /><stop offset="1" stopColor="#56b6f6" stopOpacity="0.5" /></linearGradient>
          <linearGradient id={r} x1="0" x2="1"><stop offset="0" stopColor="#56b6f6" stopOpacity="0.5" /><stop offset="1" stopColor="#56b6f6" stopOpacity="0" /></linearGradient>
        </defs>
        <g stroke="#8fbfff" strokeWidth="0.9" opacity="0.8">
          <line x1="250" y1="12" x2="290" y2="5" /><line x1="290" y1="5" x2="310" y2="19" /><line x1="310" y1="19" x2="350" y2="12" />
        </g>
        <g fill="#dbe9ff">
          <circle cx="250" cy="12" r="1.6" /><circle cx="290" cy="5" r="1.6" /><circle cx="300" cy="12" r="2.4" fill="#f6d27a" /><circle cx="310" cy="19" r="1.6" /><circle cx="350" cy="12" r="1.6" />
        </g>
      </svg>
    </div>
  );
}
