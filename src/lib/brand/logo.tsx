import type { CSSProperties } from "react";

/**
 * The official AsteriaStar emblem — a single source of truth for the logo mark.
 *
 * Rendered as a self-contained, theme-agnostic SVG badge: a golden triangular
 * "A" enclosed by an orbital ring, a radiant star in its opening, and the
 * rising crescent of the Earth at its base, on deep-space navy. Because the
 * mark carries its own dark tile it reads crisply on both light and dark
 * backgrounds and at every size from a 16px favicon to a 512px app icon.
 *
 * Every static asset (favicon, apple-touch icon, PWA icons, social cards,
 * public logo files) is generated from THIS component via
 * `scripts/generate-brand.ts`, so the brand can never drift between the
 * runtime UI and the exported files.
 *
 * `id` namespaces the gradient definitions so multiple instances on one page
 * (header + footer) never collide — no hooks, so this stays a Server Component.
 */
export function Emblem({
  size = 64,
  id = "emblem",
  title,
  tile = true,
  className,
  style,
}: {
  size?: number;
  id?: string;
  title?: string;
  tile?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const gold = `${id}-gold`;
  const goldSoft = `${id}-gold-soft`;
  const star = `${id}-star`;
  const earth = `${id}-earth`;
  const navy = `${id}-navy`;
  const labelled = Boolean(title);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      {labelled ? <title>{title}</title> : null}
      <defs>
        <radialGradient id={navy} cx="0.5" cy="0.42" r="0.75">
          <stop offset="0" stopColor="#0b1330" />
          <stop offset="1" stopColor="#05060f" />
        </radialGradient>
        <linearGradient id={gold} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#fdebba" />
          <stop offset="0.45" stopColor="#e9c163" />
          <stop offset="0.8" stopColor="#c6941d" />
          <stop offset="1" stopColor="#9c7412" />
        </linearGradient>
        <linearGradient id={goldSoft} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8dd96" />
          <stop offset="1" stopColor="#b8860b" />
        </linearGradient>
        <radialGradient id={star} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.35" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#f0b83f" />
        </radialGradient>
        <radialGradient id={earth} cx="0.4" cy="0.32" r="0.85">
          <stop offset="0" stopColor="#8fd0ff" />
          <stop offset="0.4" stopColor="#3d86cf" />
          <stop offset="0.75" stopColor="#123a6b" />
          <stop offset="1" stopColor="#071c38" />
        </radialGradient>
      </defs>

      {tile ? (
        <>
          <rect width="512" height="512" rx="112" fill={`url(#${navy})`} />
          <rect x="4" y="4" width="504" height="504" rx="108" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        </>
      ) : null}

      {/* starfield */}
      <g fill="#e9ebf8">
        <circle cx="120" cy="132" r="2.4" opacity="0.8" />
        <circle cx="404" cy="150" r="1.8" opacity="0.65" />
        <circle cx="150" cy="330" r="1.6" opacity="0.5" />
        <circle cx="392" cy="356" r="2.2" opacity="0.7" />
        <circle cx="316" cy="110" r="1.4" opacity="0.55" />
        <circle cx="96" cy="250" r="1.5" opacity="0.5" />
      </g>
      <circle cx="404" cy="150" r="5" fill={`url(#${goldSoft})`} opacity="0.9" />

      {/* orbital ring */}
      <circle cx="256" cy="250" r="150" fill="none" stroke={`url(#${gold})`} strokeWidth="3" opacity="0.7" />

      {/* rising Earth crescent at the base of the A */}
      <g>
        <circle cx="256" cy="498" r="80" fill={`url(#${earth})`} />
        <path d="M182 478 A80 80 0 0 1 330 478" fill="none" stroke="#9ad4ff" strokeWidth="3" opacity="0.75" strokeLinecap="round" />
      </g>

      {/* the golden A (crossbar sits behind the star's core) */}
      <path d="M176 384 L336 384" fill="none" stroke={`url(#${gold})`} strokeWidth="16" strokeLinecap="round" />
      <path
        d="M150 452 L256 58 L362 452"
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="24"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M256 40 L244 82 L268 82 Z" fill={`url(#${gold})`} />

      {/* radiant star in the opening */}
      <g>
        <circle cx="256" cy="296" r="62" fill={`url(#${star})`} opacity="0.30" />
        <path
          d="M256 212 L272 280 L340 296 L272 312 L256 380 L240 312 L172 296 L240 280 Z"
          fill={`url(#${star})`}
        />
        <g stroke={`url(#${star})`} strokeWidth="6" strokeLinecap="round" opacity="0.85">
          <path d="M256 296 L289 263" />
          <path d="M256 296 L289 329" />
          <path d="M256 296 L223 329" />
          <path d="M256 296 L223 263" />
        </g>
        <circle cx="256" cy="296" r="9" fill="#fffaf0" />
      </g>
    </svg>
  );
}
