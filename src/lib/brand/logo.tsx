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
 * No hooks are used, so this stays a Server Component.
 */
export function Emblem({
  size = 64,
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
  const labelled = Boolean(title);
  const ring = tile ? "#d9dee2" : "#050708";
  const secondary = tile ? "#8f989f" : "#30363d";
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
      {tile ? (
        <>
          <rect width="512" height="512" rx="112" fill="#020304" />
          <rect x="5" y="5" width="502" height="502" rx="107" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />
        </>
      ) : null}

      {/* Observatory coordinate ring. */}
      <g fill="none" strokeLinecap="round">
        <circle cx="256" cy="256" r="172" stroke={ring} strokeWidth="5" opacity="0.36" />
        <circle cx="256" cy="256" r="128" stroke={ring} strokeWidth="1.5" opacity="0.14" />
        <path d="M256 66v38M256 408v38M66 256h38M408 256h38" stroke="#e10600" strokeWidth="8" opacity="0.92" />
        <path d="M121 121l27 27M364 364l27 27M391 121l-27 27M148 364l-27 27" stroke={secondary} strokeWidth="4" opacity="0.42" />
      </g>

      {/* One realistic diffraction star. */}
      <g transform="translate(256 256)">
        <circle r="118" fill="#ffffff" opacity="0.08" />
        <path d="M0 -190 L24 -26 L190 0 L24 26 L0 190 L-24 26 L-190 0 L-24 -26 Z" fill="#e10600" />
        <path
          d="M0 -112 L13 -13 L112 0 L13 13 L0 112 L-13 13 L-112 0 L-13 -13 Z"
          fill="#ffffff"
          opacity="0.9"
        />
        <g stroke={ring} strokeWidth="8" strokeLinecap="round" opacity="0.72">
          <path d="M0 0 L58 -58" />
          <path d="M0 0 L58 58" />
          <path d="M0 0 L-58 58" />
          <path d="M0 0 L-58 -58" />
        </g>
        <circle r="58" fill="#f5f7f8" />
        <circle r="17" fill="#ffffff" />
      </g>
    </svg>
  );
}
