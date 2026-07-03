import type { SourceKey } from "@/lib/sources";
import type { ProviderKey } from "@/platform/live-sky/schema";
import { PROVIDERS, getProvider } from "@/platform/live-sky/providers";
import { meteorShowers, METEOR_SHOWERS } from "@/platform/live-sky/meteorShowers";
import { moon } from "@/platform/live-sky/moon";
import { sun } from "@/platform/live-sky/sun";
import { twilight } from "@/platform/live-sky/twilight";
import { planets } from "@/platform/live-sky/planets";
import { eclipses } from "@/platform/live-sky/eclipses";
import { comets } from "@/platform/live-sky/comets";
import { asteroids } from "@/platform/live-sky/asteroids";
import { iss } from "@/platform/live-sky/iss";
import { aurora } from "@/platform/live-sky/aurora";
import { spaceWeather } from "@/platform/live-sky/spaceWeather";
import { observingCalendar, OBSERVING_EVENTS } from "@/platform/live-sky/observingCalendar";
import { validateLiveSky, collectLinkedEntityIds } from "@/platform/live-sky/validation";

/**
 * Live Sky platform — assembly and public surface. A set of data clients on top
 * of the Knowledge Graph. No live providers are connected; data is `reference`
 * (timeless, source-backed) or `prepared` (architecture ready, no values shown).
 */

export * from "@/platform/live-sky/schema";
export * from "@/platform/live-sky/models";
export { PROVIDERS, getProvider } from "@/platform/live-sky/providers";
export { validateLiveSky, collectLinkedEntityIds } from "@/platform/live-sky/validation";
export { meteorShowers, METEOR_SHOWERS } from "@/platform/live-sky/meteorShowers";
export { moon } from "@/platform/live-sky/moon";
export { sun } from "@/platform/live-sky/sun";
export { twilight, TWILIGHT_BANDS } from "@/platform/live-sky/twilight";
export { planets } from "@/platform/live-sky/planets";
export { eclipses } from "@/platform/live-sky/eclipses";
export { comets } from "@/platform/live-sky/comets";
export { asteroids } from "@/platform/live-sky/asteroids";
export { iss } from "@/platform/live-sky/iss";
export { aurora } from "@/platform/live-sky/aurora";
export { spaceWeather } from "@/platform/live-sky/spaceWeather";
export { observingCalendar, OBSERVING_EVENTS, monthName } from "@/platform/live-sky/observingCalendar";

/** A prepared/reference sky page served by /sky/[slug]. */
export interface SkyPageDef {
  slug: string;
  title: string;
  eyebrow: string;
  lead: string;
  /** What kind of reference block the page renders. */
  content: "tonight" | "moon" | "sun" | "twilight" | "planets" | "comets" | "asteroids" | "iss" | "aurora" | "observing-calendar";
  providerKeys: ProviderKey[];
  sourceKeys: SourceKey[];
  relatedEntityIds: string[];
  learnHref?: string;
}

export const SKY_PAGES: SkyPageDef[] = [
  {
    slug: "night-sky-tonight", title: "The Night Sky Tonight", eyebrow: "Night Sky Platform",
    lead: "Location-aware Moon (phase, rise, set, position), Sun (rise, set, twilight), and naked-eye planet visibility are available now — on the Moon, Sun & Twilight, and Planet Visibility pages. A single combined 'tonight' view, plus ISS passes, is prepared for integration; nothing location-dependent is fabricated until its provider is connected.",
    content: "tonight", providerKeys: ["jpl-horizons", "usno"], sourceKeys: ["jpl", "usno"],
    relatedEntityIds: ["moon:the-moon", "star:sun", "planet:jupiter", "planet:saturn"],
    learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "moon", title: "Moon Phase & Position", eyebrow: "Night Sky Platform",
    lead: "The current Moon phase and illuminated fraction, computed from public-domain astronomical formulae and timestamped, plus location-aware moonrise, moonset, transit, and the Moon's altitude and azimuth for any latitude and longitude. Your location is used only for the calculation and is never stored.",
    content: "moon", providerKeys: ["usno", "jpl-horizons"], sourceKeys: ["usno", "jpl"],
    relatedEntityIds: ["moon:the-moon", "star:sun"], learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "sun", title: "Sun & Twilight Calculator", eyebrow: "Night Sky Platform",
    lead: "Source-backed sunrise, sunset, solar noon, day length, and civil, nautical, and astronomical twilight for any location and date — computed from public-domain solar formulae and timestamped. Enter a latitude and longitude; your location is used only for the calculation and is never stored.",
    content: "sun", providerKeys: ["usno"], sourceKeys: ["noaa", "usno"],
    relatedEntityIds: ["star:sun", "planet:earth"], learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "twilight", title: "Twilight Times & Phases", eyebrow: "Night Sky Platform",
    lead: "Civil, nautical, and astronomical twilight explained, with source-backed computed times for any location and date. How long twilight lasts — and whether true night falls at all — depends on your latitude and the season.",
    content: "twilight", providerKeys: ["usno"], sourceKeys: ["noaa", "usno"],
    relatedEntityIds: ["star:sun", "planet:earth"], learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "planet-visibility", title: "Planet Visibility Calculator", eyebrow: "Night Sky Platform",
    lead: "Which naked-eye planets are up tonight, and where — computed rise, set, and transit times, altitude, approximate magnitude, and honest, conservative visibility for any location and date, from public-domain planetary elements. Your location is used only for the calculation and is never stored.",
    content: "planets", providerKeys: ["jpl-horizons"], sourceKeys: ["jpl", "usno"],
    relatedEntityIds: ["planet:mercury", "planet:venus", "planet:mars", "planet:jupiter", "planet:saturn"],
    learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "comets", title: "Comet Visibility — Data Architecture", eyebrow: "Night Sky Platform",
    lead: "What makes comets visible is shown as reference, with links to notable comets in the encyclopedia. Currently-visible comets and their (notoriously unpredictable) brightness are prepared for integration.",
    content: "comets", providerKeys: ["jpl-horizons", "minor-planet-center"], sourceKeys: ["jpl", "mpc"],
    relatedEntityIds: ["comet:halleys-comet", "comet:hale-bopp", "comet:hyakutake"],
    learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "asteroid-close-approaches", title: "Asteroid Close Approaches — Data Architecture", eyebrow: "Night Sky Platform",
    lead: "What a 'close approach' means (and why it rarely means danger) is shown as reference. Upcoming approach dates and miss distances are prepared for the Minor Planet Center and NASA near-Earth-object data.",
    content: "asteroids", providerKeys: ["minor-planet-center", "nasa-apis"], sourceKeys: ["mpc", "nasa"],
    relatedEntityIds: ["asteroid:apophis", "asteroid:bennu", "asteroid:eros"],
    learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "iss-tracker", title: "ISS Tracker — Data Architecture", eyebrow: "Night Sky Platform",
    lead: "What the International Space Station is and how visible passes work is shown as reference. Live position and pass predictions are prepared for orbital-element data and an observer location — no position is ever fabricated.",
    content: "iss", providerKeys: ["celestrak"], sourceKeys: ["celestrak"],
    relatedEntityIds: ["satellite:international-space-station"], learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "aurora", title: "Aurora Forecast — Data Architecture", eyebrow: "Night Sky Platform",
    lead: "What causes the aurora and the Kp index are shown as reference. Location-aware aurora forecasts are prepared for NOAA SWPC space-weather data.",
    content: "aurora", providerKeys: ["noaa-swpc"], sourceKeys: ["swpc"],
    relatedEntityIds: ["star:sun", "planet:earth"], learnHref: "/learn/observing-the-night-sky",
  },
  {
    slug: "observing-calendar", title: "Observing Calendar", eyebrow: "Night Sky Platform",
    lead: "A month-by-month guide to recurring sky events — meteor-shower peaks, equinoxes, and solstices. Sun, Moon, and planet times for your location and date are available now on the Sun & Twilight, Moon, and Planet Visibility pages; exact dates for other events are prepared for a connected almanac provider.",
    content: "observing-calendar", providerKeys: ["imo", "usno"], sourceKeys: ["imo", "usno"],
    relatedEntityIds: ["star:sun", "planet:earth", "meteor_shower:perseids", "meteor_shower:geminids"],
    learnHref: "/learn/observing-the-night-sky",
  },
];

const SKY_PAGE_BY_SLUG = new Map(SKY_PAGES.map((p) => [p.slug, p]));
export const getSkyPage = (slug: string): SkyPageDef | undefined => SKY_PAGE_BY_SLUG.get(slug);

/** Every relative path under /sky (for the sitemap). Excludes the /sky hub itself. */
export function allSkyPaths(): string[] {
  return [
    ...SKY_PAGES.map((p) => `/sky/${p.slug}`),
    "/sky/meteor-showers",
    ...METEOR_SHOWERS.map((s) => `/sky/meteor-showers/${s.slug}`),
    "/sky/eclipses", "/sky/eclipses/solar", "/sky/eclipses/lunar",
    "/sky/space-weather", "/sky/space-weather/solar-flares", "/sky/space-weather/geomagnetic-storms",
    "/sky/events", "/sky/this-month",
  ];
}

export const LIVE_SKY_STATS = {
  meteorShowers: METEOR_SHOWERS.length,
  observingEvents: OBSERVING_EVENTS.length,
  providers: PROVIDERS.length,
  eclipseTypes: eclipses.types.length,
  skyPages: SKY_PAGES.length,
  totalSkyPaths: allSkyPaths().length + 1, // + the /sky hub
  linkedEntities: collectLinkedEntityIds().length,
  connectedProviders: PROVIDERS.filter((p) => p.status === "connected").length,
} as const;

/** The Live Sky data surface (wrapped by engine.liveSky). */
export const liveSky = {
  providers: PROVIDERS,
  getProvider,
  meteorShowers,
  moon, sun, twilight, planets, eclipses, comets, asteroids, iss, aurora, spaceWeather, observingCalendar,
  skyPages: SKY_PAGES,
  getSkyPage,
  allSkyPaths,
  validate: validateLiveSky,
  stats: LIVE_SKY_STATS,
};
