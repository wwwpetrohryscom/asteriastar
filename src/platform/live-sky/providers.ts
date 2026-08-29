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
    license: "Public NASA/JPL data.", status: "connected", access: "public-api",
    notes: "Authoritative ephemerides and small-body data. CONNECTED by Program CK for the SSD/CNEOS near-Earth-object services - close approaches, the Sentry impact-risk table and recent database entries, shown at /neo. JPL's Fair Use Policy permits only ONE request at a time, which the live-provider runtime enforces per provider; the Horizons ephemeris service itself is not yet used.",
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
    license: "Public NASA data (open API).", status: "connected", access: "public-api",
    notes: "The Space Weather Database Of Notifications, Knowledge, Information. CONNECTED by Program CJ through the documented key-less CCMC web service: flares, CMEs, geomagnetic storms and SEP events are fetched live and shown at /space-weather. CCMC states its real-time contents are prototyping quality and for research use, and that caveat travels with every event.",
  },
  {
    key: "noaa-swpc", name: "NOAA SWPC", organization: "NOAA Space Weather Prediction Center",
    url: "https://www.swpc.noaa.gov/", sources: ["swpc"],
    dataKinds: ["Aurora forecast (OVATION)", "Kp index", "Geomagnetic storm scale (G1–G5)", "Alerts"],
    license: "Public US government data.", status: "connected", access: "public-data-files",
    notes: "Authoritative aurora and geomagnetic forecasts. CONNECTED by Program CJ: eleven products - real-time solar wind and IMF, the propagated solar-wind series, observed and forecast Kp, the R/S/G scales, the alert stream, GOES X-ray flares, the daily active-region report, F10.7 and the OVATION aurora grid - are fetched live and shown at /space-weather.",
  },
  {
    key: "celestrak", name: "CelesTrak", organization: "CelesTrak (Dr. T.S. Kelso)",
    url: "https://celestrak.org/", sources: ["celestrak"],
    dataKinds: ["ISS orbital elements (TLE)", "Satellite passes (via propagation)"],
    license: "Public TLE data; attribution expected.", status: "planned", access: "requires-review",
    notes: "EVALUATED AND NOT CONNECTED (Program CL). The host refused automated connections after a handful of requests, so an integration could not be established or its terms verified. The ISS is tracked instead from NASA/JSC's own published operational ephemeris, which needs no propagator: it is state vectors, not mean elements, and it comes with the ascending-node longitudes that make the coordinate transformation verifiable.",
  },
  {
    key: "nasa-iss-ephemeris", name: "NASA ISS Trajectory Data", organization: "NASA Johnson Space Center, Flight Operations Directorate",
    url: "https://www.nasa.gov/spot-the-station/", sources: ["nasa"],
    dataKinds: ["ISS operational ephemeris (CCSDS OEM)", "Sub-satellite position & ground track", "Visible passes for an explicit observer"],
    license: "Public domain (US Government work), NASA/JSC.", status: "connected", access: "public-data-files",
    notes: "CONNECTED by Program CL. The station's own operational trajectory — state vectors every four minutes in the mean equator and equinox of J2000, spanning fifteen days — rather than mean elements requiring SGP4. Its ascending-node longitudes make the coordinate transformation verifiable against the provider's own figures.",
  },
  {
    key: "minor-planet-center", name: "Minor Planet Center", organization: "IAU Minor Planet Center",
    url: "https://www.minorplanetcenter.net/", sources: ["mpc"],
    dataKinds: ["Asteroid & comet designations and orbits", "Close-approach data"],
    license: "Public MPC data.", status: "connected", access: "public-data-files",
    notes: "Authoritative small-body designations and orbits. CONNECTED by Program CK for the NEO Confirmation Page, the machine-readable list of candidate objects awaiting confirmation, shown at /neo/recently-discovered. The bulk orbit files (MPCORB, NEA, PHA) are not ingested.",
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
