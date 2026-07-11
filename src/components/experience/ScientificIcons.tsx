import type { SVGProps } from "react";

type ScientificIconName =
  | "aperture"
  | "atlas"
  | "graph"
  | "measure"
  | "orbit"
  | "source"
  | "spectrum"
  | "trajectory";

interface ScientificIconProps extends SVGProps<SVGSVGElement> {
  name: ScientificIconName;
  title?: string;
}

/**
 * Asteria scientific icon family.
 *
 * Original SVG glyphs: single-stroke, telescope-inspired geometry that stays
 * readable at small sizes and works on both dark and light editorial surfaces.
 */
export function ScientificIcon({
  name,
  title,
  className = "",
  ...props
}: ScientificIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={className}
      {...props}
    >
      {title && <title>{title}</title>}
      {name === "aperture" && (
        <>
          <circle cx="12" cy="12" r="7.2" />
          <path d="M12 4.8v14.4M4.8 12h14.4" opacity="0.42" />
          <path d="m7.2 7.2 9.6 9.6M16.8 7.2l-9.6 9.6" opacity="0.58" />
          <circle cx="12" cy="12" r="1.8" />
        </>
      )}
      {name === "atlas" && (
        <>
          <path d="M4 6.5c2.2-1.2 4.4-1.2 6.6 0 2.2 1.2 4.4 1.2 6.6 0L20 5v12.5l-2.8 1.5c-2.2 1.2-4.4 1.2-6.6 0-2.2-1.2-4.4-1.2-6.6 0V6.5Z" />
          <path d="M10.6 6.5V19M17.2 6.5V19" opacity="0.5" />
          <path d="M6.5 10.4h1.8M13.5 12.2h1.8M6.5 15.3h1.8" opacity="0.72" />
        </>
      )}
      {name === "graph" && (
        <>
          <circle cx="12" cy="12" r="2.3" />
          <circle cx="5.8" cy="7" r="1.5" />
          <circle cx="18.2" cy="7" r="1.5" />
          <circle cx="6.8" cy="18" r="1.5" />
          <circle cx="17.2" cy="18" r="1.5" />
          <path d="m7 7.8 3.2 2.6M16.9 7.8l-3.1 2.6M10.1 13.8l-2.2 2.8M13.9 13.8l2.2 2.8" />
        </>
      )}
      {name === "measure" && (
        <>
          <path d="M4.5 17.5h15" />
          <path d="M6.5 17.5v-9M10.2 17.5v-5.5M13.9 17.5v-8M17.6 17.5v-4.5" />
          <path d="M5.2 7.4c4.6-2.4 9.1-2.4 13.6 0" opacity="0.5" />
        </>
      )}
      {name === "orbit" && (
        <>
          <circle cx="12" cy="12" r="1.8" />
          <ellipse cx="12" cy="12" rx="8.3" ry="3.7" transform="rotate(-24 12 12)" />
          <ellipse cx="12" cy="12" rx="8.3" ry="3.7" transform="rotate(24 12 12)" opacity="0.56" />
          <circle cx="18.8" cy="8.6" r="1.1" />
        </>
      )}
      {name === "source" && (
        <>
          <path d="M6.5 4.8h7.7l3.3 3.3v11.1h-11V4.8Z" />
          <path d="M14.2 4.8v3.3h3.3" />
          <path d="M8.8 11h6.4M8.8 14h6.4M8.8 17h3.9" />
        </>
      )}
      {name === "spectrum" && (
        <>
          <path d="M4.5 7.2h15v9.6h-15V7.2Z" />
          <path d="M7 7.2v9.6M10.1 7.2v9.6M13.7 7.2v9.6M17 7.2v9.6" opacity="0.55" />
          <path d="M6.2 19.2h11.6" opacity="0.75" />
        </>
      )}
      {name === "trajectory" && (
        <>
          <circle cx="5.8" cy="17.8" r="1.6" />
          <circle cx="18.2" cy="6.2" r="1.6" />
          <path d="M7.2 16.8C12 13.6 14.8 10.7 17 7.5" />
          <path d="M8.9 8.2c2.2-1.4 4.4-1.8 6.5-1.1" opacity="0.52" />
          <path d="m14.1 4.6 2.1 2.4-2.6 1.6" />
        </>
      )}
    </svg>
  );
}

export type { ScientificIconName };
