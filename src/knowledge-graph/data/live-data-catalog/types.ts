import type { SourceKey } from "@/lib/sources";

/**
 * Live Scientific Data Platform data model (Program BT). Each entity is a real external scientific
 * data provider modelled as a first-class graph node, with the full honesty envelope. It REUSES the
 * existing live-sky provider registry (engine.liveSky) as the source of truth for each provider's
 * connection status, and the existing NASA/NOAA/SWPC/JPL/MPC organisations and space-weather
 * phenomena in the graph. Nothing is fabricated: no live value, timestamp, or provider response is
 * invented. A provider that is not connected reports its honest status (planned / unavailable), never
 * fake data. Unknown values are left empty.
 */

/** The honesty status of a provider or a fetched response. */
export type LiveStatus =
  | "connected" // a live provider is connected and returning real data
  | "computed" // the value is computed on-device from real inputs (e.g. rise/set from ephemerides)
  | "cached" // a previously-fetched real response, within its validity window
  | "stale" // a previously-fetched real response, past its validity window
  | "unavailable" // the provider could not be reached; no data shown
  | "planned"; // the integration is architecture-ready but not yet connected

export type LiveCategory =
  | "space-weather" // solar wind, geomagnetic indices, alerts
  | "solar-activity" // flares, CMEs, SEP events
  | "near-earth-object" // NEO close approaches
  | "orbital" // satellite / ISS orbital elements
  | "atmospheric"; // weather, seeing, transparency, sky brightness

export const CATEGORY_LABEL: Record<LiveCategory, string> = {
  "space-weather": "Space weather",
  "solar-activity": "Solar activity",
  "near-earth-object": "Near-Earth objects",
  orbital: "Orbital / satellites",
  atmospheric: "Atmospheric conditions",
};

export interface LiveSourceRecord {
  id: string;
  slug: string;
  name: string;
  category: LiveCategory;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** The key of the matching provider in the existing live-sky registry (engine.liveSky.providers). */
  providerKey?: string;
  /** The provider's public endpoint or documentation URL. */
  endpoint?: string;
  /** Licence / terms note (real, from the provider). */
  licenseNote?: string;
  /** The kinds of data the provider serves. */
  dataKinds?: string[];
  /** Current honesty status of the integration. */
  status: LiveStatus;
  /** Honest, specific limitations of the integration. */
  limitations?: string;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED organisations, phenomena, and sibling sources

  /* display */
  highlights?: string[];
}

/**
 * The runtime honesty envelope a connected provider response must carry. Populated only when a real
 * fetch occurs; never fabricated. All timestamps are real, from the fetch and the provider.
 */
export interface ProviderEnvelope<T = unknown> {
  provider: string;
  endpoint?: string;
  license?: string;
  status: LiveStatus;
  /** When this response was fetched (ISO); empty if never fetched. */
  fetchedAt?: string;
  /** When the provider generated the data (ISO), if the provider supplies it. */
  generatedAt?: string;
  validFrom?: string;
  validUntil?: string;
  stale: boolean;
  provenance: string;
  limitations?: string;
  /** Structured error when the provider is unavailable; empty when ok. */
  error?: string;
  /** The real payload, present only when status is connected/cached/stale. */
  data?: T;
}
