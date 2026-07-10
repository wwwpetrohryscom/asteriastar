import type { CSSProperties } from "react";

/**
 * The official AsteriaStar cosmos photograph, used as the site's real-space
 * background (homepage hero, landing heroes, the global ambient layer, and the
 * footer atmosphere). One optimized asset serves every placement — the same
 * responsive `/brand/cosmos-*` files are reused, so the browser fetches the
 * chosen width once and shares it across layers.
 *
 * Server Component, `aria-hidden`, absolutely/fixed positioned (never shifts
 * layout). A dark scrim tuned per placement keeps foreground text readable
 * while the stars, Milky Way, constellation lines and Earth's limb stay visible.
 */

const WIDTHS = [640, 1024, 1536] as const;
const srcSet = (ext: string) => WIDTHS.map((w) => `/brand/cosmos-${w}.${ext} ${w}w`).join(", ");

export type PhotoVariant = "hero" | "ambient" | "footer";

/** Where the image is anchored, per placement. */
const OBJECT_POSITION: Record<PhotoVariant, string> = {
  hero: "50% 100%", // Earth's limb pinned to the bottom of the hero
  ambient: "50% 26%", // the Milky Way band sits behind the content
  footer: "50% 6%", // upper star-field behind the footer
};

/**
 * Darkening scrim per placement. Heroes stay open so the photo sings; the
 * ambient layer is dark enough for body copy on any page; the footer fades in
 * from the page background.
 */
const OVERLAY: Record<PhotoVariant, string> = {
  hero:
    "linear-gradient(90deg, rgba(2,5,11,0.70) 0%, rgba(2,5,11,0.36) 46%, rgba(2,5,11,0.10) 100%)," +
    "linear-gradient(180deg, rgba(2,5,11,0.34) 0%, rgba(2,5,11,0.05) 32%, rgba(2,5,11,0.62) 80%, var(--color-bg) 100%)",
  ambient:
    "linear-gradient(180deg, rgba(2,5,11,0.84) 0%, rgba(2,5,11,0.9) 55%, rgba(2,5,11,0.94) 100%)",
  footer:
    "linear-gradient(180deg, var(--color-bg) 0%, rgba(2,5,11,0.87) 42%, rgba(2,5,11,0.76) 100%)",
};

export function PhotoBackdrop({
  variant = "ambient",
  fixed = false,
  priority = false,
  className = "",
  style,
}: {
  variant?: PhotoVariant;
  /** Fixed to the viewport (the global ambient layer) vs. absolute to its section. */
  fixed?: boolean;
  /** Eager-load with high fetch priority — set on the LCP background only. */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 -z-10 overflow-hidden ${className}`}
      style={style}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
        <img
          src="/brand/cosmos-1536.jpg"
          srcSet={srcSet("jpg")}
          sizes="100vw"
          alt=""
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover"
          style={{ objectPosition: OBJECT_POSITION[variant] }}
        />
      </picture>
      <div className="absolute inset-0" style={{ backgroundImage: OVERLAY[variant] }} />
    </div>
  );
}
