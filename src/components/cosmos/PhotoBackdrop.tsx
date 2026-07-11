import type { CSSProperties } from "react";

/**
 * Real NASA/ESA/JWST/Hubble/Cassini/SDO/MER photography used as the site's
 * atmospheric background (homepage hero, landing heroes, global ambient layer,
 * and footer). The responsive `/brand/backgrounds/*` files are generated from
 * sourced editorial image registry assets, not from AI artwork.
 *
 * Server Component, `aria-hidden`, absolutely/fixed positioned (never shifts
 * layout). A dark scrim tuned per placement keeps foreground text readable
 * while the real observations remain visible as credible scientific imagery.
 */

const WIDTHS = [640, 1024, 1536] as const;

export type PhotoVariant = "hero" | "ambient" | "footer";

type BackgroundPhoto = {
  id: string;
  base: `/brand/backgrounds/${string}`;
  positions: Record<PhotoVariant, string>;
};

const BACKGROUND_PHOTOS = [
  {
    id: "webb-cosmic-cliffs",
    base: "/brand/backgrounds/webb-cosmic-cliffs",
    positions: { hero: "50% 58%", ambient: "50% 44%", footer: "50% 46%" },
  },
  {
    id: "webb-first-deep-field",
    base: "/brand/backgrounds/webb-first-deep-field",
    positions: { hero: "50% 50%", ambient: "50% 46%", footer: "50% 48%" },
  },
  {
    id: "hubble-pillars-creation",
    base: "/brand/backgrounds/hubble-pillars-creation",
    positions: { hero: "50% 42%", ambient: "50% 50%", footer: "50% 48%" },
  },
  {
    id: "trumpler-14-hubble",
    base: "/brand/backgrounds/trumpler-14-hubble",
    positions: { hero: "48% 46%", ambient: "50% 50%", footer: "50% 50%" },
  },
  {
    id: "sun-sdo",
    base: "/brand/backgrounds/sun-sdo",
    positions: { hero: "47% 50%", ambient: "50% 50%", footer: "50% 50%" },
  },
  {
    id: "blue-marble-viirs",
    base: "/brand/backgrounds/blue-marble-viirs",
    positions: { hero: "42% 50%", ambient: "50% 50%", footer: "44% 50%" },
  },
  {
    id: "jupiter-hubble",
    base: "/brand/backgrounds/jupiter-hubble",
    positions: { hero: "63% 50%", ambient: "50% 50%", footer: "52% 50%" },
  },
  {
    id: "saturn-cassini",
    base: "/brand/backgrounds/saturn-cassini",
    positions: { hero: "56% 50%", ambient: "50% 50%", footer: "50% 52%" },
  },
  {
    id: "mars-marathon-valley",
    base: "/brand/backgrounds/mars-marathon-valley",
    positions: { hero: "50% 48%", ambient: "50% 50%", footer: "50% 46%" },
  },
] as const satisfies readonly BackgroundPhoto[];

const byId = (id: string) => {
  const photo = BACKGROUND_PHOTOS.find((item) => item.id === id);
  if (!photo) throw new Error(`Missing background photo: ${id}`);
  return photo;
};

const HERO_FRAMES = [
  byId("webb-cosmic-cliffs"),
  byId("webb-first-deep-field"),
  byId("hubble-pillars-creation"),
  byId("trumpler-14-hubble"),
  byId("sun-sdo"),
  byId("jupiter-hubble"),
  byId("saturn-cassini"),
  byId("mars-marathon-valley"),
] as const;

const STATIC_FRAME: Record<PhotoVariant, BackgroundPhoto> = {
  hero: byId("webb-cosmic-cliffs"),
  ambient: byId("webb-first-deep-field"),
  footer: byId("blue-marble-viirs"),
};

const srcSet = (base: string, ext: string) => WIDTHS.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");

/**
 * Darkening scrim per placement. Heroes stay open so the photo sings; the
 * ambient layer is dark enough for body copy on any page; the footer fades in
 * from the page background.
 */
const OVERLAY: Record<PhotoVariant, string> = {
  hero: "rgba(0, 0, 0, 0.64)",
  ambient: "rgba(0, 0, 0, 0.9)",
  footer: "rgba(0, 0, 0, 0.82)",
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
  const frames = variant === "hero" ? HERO_FRAMES : [STATIC_FRAME[variant]];
  const shouldCycle = variant === "hero" && frames.length > 1;
  const duration = frames.length * 12;

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 -z-10 overflow-hidden ${className}`}
      style={style}
    >
      {frames.map((photo, index) => {
        const imagePriority = priority && index === 0;
        return (
          <picture
            key={photo.id}
            data-background-photo={photo.id}
            className={`absolute inset-0 block ${shouldCycle ? "photo-backdrop-frame-cycle" : ""}`}
            style={
              shouldCycle
                ? ({
                    animationDelay: `${index * 12}s`,
                    animationDuration: `${duration}s`,
                    "--photo-drift-duration": `${duration + index * 4}s`,
                  } as CSSProperties)
                : undefined
            }
          >
            <source type="image/avif" srcSet={srcSet(photo.base, "avif")} sizes="100vw" />
            <source type="image/webp" srcSet={srcSet(photo.base, "webp")} sizes="100vw" />
            <img
              src={`${photo.base}-1536.jpg`}
              srcSet={srcSet(photo.base, "jpg")}
              sizes="100vw"
              alt=""
              decoding="async"
              loading={imagePriority ? "eager" : "lazy"}
              fetchPriority={imagePriority ? "high" : "low"}
              className="photo-backdrop-image h-full w-full object-cover"
              style={{ objectPosition: photo.positions[variant] }}
            />
          </picture>
        );
      })}
      <div className="absolute inset-0" style={{ backgroundImage: OVERLAY[variant] }} />
    </div>
  );
}
