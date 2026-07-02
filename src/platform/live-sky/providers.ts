import type { SourceKey } from "@/lib/sources";
import type { ProviderKey, Enveloped } from "@/platform/live-sky/schema";
import type {
  GeoLocation, MoonPhase, RiseSet, PlanetVisibility, Eclipse, CometVisibility,
  AsteroidCloseApproach, IssPass, AuroraForecast, SolarFlare, GeomagneticStorm,
} from "@/platform/live-sky/models";

/**
 * Live Sky — data-provider architecture.
 *
 * These are TYPED INTERFACES for future integrations, plus a registry of the
 * providers the platform is designed to draw on. Nothing here calls a live
 * external API, scrapes, or ships a paid/uncertain integration. Every provider
 * is `planned`; a real client must be written and its licensing verified before
 * any status moves to `available`. All methods return Enveloped<T> so that the
 * honesty envelope travels with every datum.
 */

export type IntegrationStatus = "planned" | "available" | "connected";

export interface ProviderInfo {
  key: ProviderKey;
  name: string;
  organization: string;
  url: string;
  /** Registry source keys this provider maps to. */
  sources: SourceKey[];
  /** What kinds of sky data it can supply. */
  dataKinds: string[];
  license: string;
  status: IntegrationStatus;
  /** Whether the provider offers a public, non-paid, non-scraped interface. */
  access: "public-api" | "public-data-files" | "requires-review";
  notes: string;
}

/* ------------------------------------------------------ provider interfaces */
/** Ephemeris: positions and rise/set for Solar System bodies (JPL Horizons / USNO). */
export interface EphemerisProvider {
  moonPhase(loc: GeoLocation, atIso: string): Promise<Enveloped<MoonPhase>>;
  riseSet(bodyEntityId: string, loc: GeoLocation, atIso: string): Promise<Enveloped<RiseSet>>;
  planetVisibility(loc: GeoLocation, atIso: string): Promise<Enveloped<PlanetVisibility>[]>;
}
/** Eclipse circumstances (a suitably-licensed eclipse catalogue / NASA). */
export interface EclipseProvider {
  upcomingEclipses(fromIso: string, limit: number): Promise<Enveloped<Eclipse>[]>;
}
/** Small-body ephemerides and close approaches (JPL / Minor Planet Center). */
export interface SmallBodyProvider {
  cometVisibility(loc: GeoLocation, atIso: string): Promise<Enveloped<CometVisibility>[]>;
  closeApproaches(fromIso: string, limit: number): Promise<Enveloped<AsteroidCloseApproach>[]>;
}
/** Satellite passes from orbital elements (CelesTrak TLEs + propagation). */
export interface SatelliteProvider {
  issPasses(loc: GeoLocation, fromIso: string, limit: number): Promise<Enveloped<IssPass>[]>;
}
/** Space weather forecasts and alerts (NOAA SWPC / NASA DONKI). */
export interface SpaceWeatherProvider {
  auroraForecast(loc: GeoLocation, atIso: string): Promise<Enveloped<AuroraForecast>>;
  recentFlares(fromIso: string): Promise<Enveloped<SolarFlare>[]>;
  geomagneticStorms(fromIso: string): Promise<Enveloped<GeomagneticStorm>[]>;
}

/* --------------------------------------------------------------- registry */
export const PROVIDERS: ProviderInfo[] = [
  {
    key: "jpl-horizons", name: "JPL Horizons", organization: "NASA Jet Propulsion Laboratory",
    url: "https://ssd.jpl.nasa.gov/horizons/", sources: ["jpl"],
    dataKinds: ["Planet ephemerides", "Moon position", "Rise/set", "Comet & asteroid ephemerides"],
    license: "Public NASA/JPL data.", status: "planned", access: "public-api",
    notes: "Authoritative ephemerides for Solar System bodies; a client must respect JPL usage guidance.",
  },
  {
    key: "usno", name: "US Naval Observatory Almanac", organization: "United States Naval Observatory",
    url: "https://aa.usno.navy.mil/", sources: ["usno"],
    dataKinds: ["Sunrise/sunset", "Moonrise/moonset", "Moon phases", "Twilight"],
    license: "Public almanac data.", status: "planned", access: "public-api",
    notes: "Standard source for rise/set and phase computations.",
  },
  {
    key: "nasa-donki", name: "NASA DONKI", organization: "NASA / CCMC",
    url: "https://ccmc.gsfc.nasa.gov/tools/DONKI/", sources: ["donki", "nasa"],
    dataKinds: ["Solar flares", "CMEs", "Geomagnetic storms", "Space weather notifications"],
    license: "Public NASA data (open API).", status: "planned", access: "public-api",
    notes: "The Space Weather Database Of Notifications, Knowledge, Information.",
  },
  {
    key: "noaa-swpc", name: "NOAA SWPC", organization: "NOAA Space Weather Prediction Center",
    url: "https://www.swpc.noaa.gov/", sources: ["swpc"],
    dataKinds: ["Aurora forecast (OVATION)", "Kp index", "Geomagnetic storm scale (G1–G5)", "Alerts"],
    license: "Public US government data.", status: "planned", access: "public-data-files",
    notes: "Authoritative aurora and geomagnetic forecasts.",
  },
  {
    key: "celestrak", name: "CelesTrak", organization: "CelesTrak (Dr. T.S. Kelso)",
    url: "https://celestrak.org/", sources: ["celestrak"],
    dataKinds: ["ISS orbital elements (TLE)", "Satellite passes (via propagation)"],
    license: "Public TLE data; attribution expected.", status: "planned", access: "public-data-files",
    notes: "Pass prediction requires an SGP4 propagator and an observer location.",
  },
  {
    key: "minor-planet-center", name: "Minor Planet Center", organization: "IAU Minor Planet Center",
    url: "https://www.minorplanetcenter.net/", sources: ["mpc"],
    dataKinds: ["Asteroid & comet designations and orbits", "Close-approach data"],
    license: "Public MPC data.", status: "planned", access: "public-data-files",
    notes: "Authoritative small-body designations and orbits.",
  },
  {
    key: "imo", name: "International Meteor Organization", organization: "IMO",
    url: "https://www.imo.net/", sources: ["imo"],
    dataKinds: ["Annual meteor shower calendar", "Peak dates", "ZHR"],
    license: "IMO working list; cited, not redistributed.", status: "planned", access: "public-data-files",
    notes: "The annual meteor-shower parameters seeded as reference data are drawn from the IMO working list.",
  },
  {
    key: "nasa-apis", name: "NASA Open APIs", organization: "NASA",
    url: "https://api.nasa.gov/", sources: ["nasa"],
    dataKinds: ["Astronomy imagery", "Near-Earth objects (NeoWs)", "General mission data"],
    license: "Public NASA data (API key).", status: "planned", access: "public-api",
    notes: "Umbrella for several NASA open data services.",
  },
  {
    key: "eclipse-catalogue", name: "Eclipse Catalogue", organization: "NASA GSFC eclipse data (five-millennium canon)",
    url: "https://eclipse.gsfc.nasa.gov/", sources: ["nasa"],
    dataKinds: ["Solar & lunar eclipse circumstances", "Paths of totality"],
    license: "Public NASA eclipse predictions.", status: "planned", access: "public-data-files",
    notes: "Eclipse dates and paths will be sourced from published predictions; none are fabricated.",
  },
];

const PROVIDER_BY_KEY = new Map(PROVIDERS.map((p) => [p.key, p]));
export function getProvider(key: ProviderKey): ProviderInfo | undefined {
  return PROVIDER_BY_KEY.get(key);
}
