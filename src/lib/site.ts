/**
 * Global site configuration for Asteria Star.
 *
 * This is the single source of truth for site-wide identity, URLs, and
 * positioning. Keeping it here (rather than scattered across components)
 * means metadata, JSON-LD, sitemap, robots, and llms.txt all stay in sync.
 */

const FALLBACK_URL = "https://asteriastar.com";

/** Absolute site origin, e.g. `https://asteriastar.com` (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL
).replace(/\/$/, "");

export const SITE = {
  name: "Asteria Star",
  shortName: "Asteria",
  domain: "asteriastar.com",
  url: SITE_URL,
  locale: "en_US",
  /** One-line positioning used as the default meta description. */
  description:
    "A knowledge platform for everything above Earth — astronomy, space, the night sky, celestial events, mythology, and astrology as a clearly separate cultural tradition.",
  tagline: "Everything Above Earth.",
  /**
   * The full positioning statement. Used on the about page and anywhere the
   * brand concept is stated in long form.
   */
  positioning:
    "Asteria Star is a knowledge platform for everything above Earth — astronomy, space exploration, the night sky, celestial phenomena, mythology, observation, astrophotography, telescopes, and astrology as a separate cultural tradition.",
  /**
   * The core editorial principle that defines the platform. Surfaced in the
   * footer and the editorial policy so the science/tradition boundary is never
   * ambiguous.
   */
  principle:
    "Astronomy is presented as scientific, evidence-based, and sourced. Astrology is presented as cultural, symbolic, and interpretive — never as proven science.",
  founded: "2026",
  organizationType: "Organization",
} as const;

/**
 * The standard astrology disclaimer. Used verbatim by the DisclaimerBox so the
 * wording is consistent everywhere astrology content appears.
 */
export const ASTROLOGY_DISCLAIMER =
  "Astrology content on Asteria Star is presented as cultural, symbolic, historical, and interpretive material. It is not presented as scientifically proven astronomy.";
