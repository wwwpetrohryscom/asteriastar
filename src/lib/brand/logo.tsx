import type { CSSProperties } from "react";

/**
 * The official AsteriaStar emblem — a single source of truth for the logo mark.
 *
 * A single telescope-diffraction star in a scientific coordinate ring: no
 * letterform, no mascot, no fantasy. The mark is deliberately simple enough to
 * survive at favicon size while retaining a premium institutional character on
 * dark and light surfaces. Every static asset (favicon, Apple touch icon, PWA
 * icons, social-card mark, public logo files) is generated from this component.
 *
 * `id` namespaces the gradient definitions so multiple instances on one page
 * never collide. No hooks are used, so this stays a Server Component.
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
  const navy = `${id}-navy`;
  const gold = `${id}-gold`;
  const silver = `${id}-silver`;
  const star = `${id}-star`;
  const glow = `${id}-glow`;
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
        <radialGradient id={navy} cx="0.5" cy="0.38" r="0.8">
          <stop offset="0" stopColor="#0a1728" />
          <stop offset="0.6" stopColor="#07111c" />
          <stop offset="1" stopColor="#02050b" />
        </radialGradient>
        <linearGradient id={gold} x1="0.14" y1="0.04" x2="0.86" y2="0.96">
          <stop offset="0" stopColor="#fff7d8" />
          <stop offset="0.5" stopColor="#e7c98a" />
          <stop offset="1" stopColor="#a47a21" />
        </linearGradient>
        <linearGradient id={silver} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c8d2e6" />
          <stop offset="1" stopColor="#637088" />
        </linearGradient>
        <radialGradient id={star} cx="0.46" cy="0.42" r="0.58">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.32" stopColor="#fff4c9" />
          <stop offset="0.72" stopColor="#e7c98a" />
          <stop offset="1" stopColor="#9f761f" />
        </radialGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.48" />
          <stop offset="0.28" stopColor="#e7c98a" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {tile ? (
        <>
          <rect width="512" height="512" rx="112" fill={`url(#${navy})`} />
          <rect x="5" y="5" width="502" height="502" rx="107" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />
        </>
      ) : null}

      {/* Observatory coordinate ring. */}
      <g fill="none" strokeLinecap="round">
        <circle cx="256" cy="256" r="172" stroke={`url(#${silver})`} strokeWidth="5" opacity="0.34" />
        <circle cx="256" cy="256" r="128" stroke="#ffffff" strokeWidth="1.5" opacity="0.12" />
        <path d="M256 66v38M256 408v38M66 256h38M408 256h38" stroke={`url(#${gold})`} strokeWidth="8" opacity="0.86" />
        <path d="M121 121l27 27M364 364l27 27M391 121l-27 27M148 364l-27 27" stroke="#c8d2e6" strokeWidth="4" opacity="0.36" />
      </g>

      {/* One realistic diffraction star. */}
      <g transform="translate(256 256)">
        <circle r="118" fill={`url(#${glow})`} />
        <path d="M0 -190 L24 -26 L190 0 L24 26 L0 190 L-24 26 L-190 0 L-24 -26 Z" fill={`url(#${gold})`} />
        <path
          d="M0 -112 L13 -13 L112 0 L13 13 L0 112 L-13 13 L-112 0 L-13 -13 Z"
          fill="#ffffff"
          opacity="0.9"
        />
        <g stroke={`url(#${silver})`} strokeWidth="8" strokeLinecap="round" opacity="0.72">
          <path d="M0 0 L58 -58" />
          <path d="M0 0 L58 58" />
          <path d="M0 0 L-58 58" />
          <path d="M0 0 L-58 -58" />
        </g>
        <circle r="58" fill={`url(#${star})`} />
        <circle r="17" fill="#ffffff" />
      </g>
    </svg>
  );
}
