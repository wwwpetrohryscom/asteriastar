/**
 * Authoritative source registry.
 *
 * Asteria Star is source-ready by design: every factual astronomy page should
 * cite from this curated set of primary and reference sources rather than
 * inventing claims. These are *source slots* — the registry records where
 * verified information will come from. We do not scrape these sources, and we
 * do not publish unverified claims.
 *
 * Add new sources here and reference them by key from the content registry.
 */

export type SourceKey =
  | "nasa"
  | "jpl"
  | "esa"
  | "iau"
  | "mpc"
  | "usno"
  | "imo"
  | "britannica"
  | "wikimedia";

export interface Source {
  key: SourceKey;
  /** Short display name. */
  name: string;
  /** Full organization / publisher name. */
  organization: string;
  /** Canonical homepage. */
  url: string;
  /** What we rely on this source for. */
  scope: string;
  /** Imagery / data licensing note, where relevant. */
  usage?: string;
}

export const SOURCES: Record<SourceKey, Source> = {
  nasa: {
    key: "nasa",
    name: "NASA",
    organization: "National Aeronautics and Space Administration",
    url: "https://www.nasa.gov",
    scope:
      "Mission data, planetary science, space telescopes, and public-domain imagery.",
    usage:
      "Most NASA-produced imagery is in the public domain; individual items are checked for usage terms before publication.",
  },
  jpl: {
    key: "jpl",
    name: "NASA JPL",
    organization: "Jet Propulsion Laboratory / Solar System Dynamics",
    url: "https://www.jpl.nasa.gov",
    scope:
      "Orbital data, ephemerides, and small-body parameters for planets, asteroids, and comets.",
  },
  esa: {
    key: "esa",
    name: "ESA",
    organization: "European Space Agency",
    url: "https://www.esa.int",
    scope: "European missions, observatories, and space science imagery.",
  },
  iau: {
    key: "iau",
    name: "IAU",
    organization: "International Astronomical Union",
    url: "https://www.iau.org",
    scope:
      "Official naming, definitions, constellation boundaries, and astronomical nomenclature.",
  },
  mpc: {
    key: "mpc",
    name: "Minor Planet Center",
    organization: "IAU Minor Planet Center",
    url: "https://www.minorplanetcenter.net",
    scope: "Designations and orbits of asteroids, comets, and minor bodies.",
  },
  usno: {
    key: "usno",
    name: "US Naval Observatory",
    organization: "United States Naval Observatory",
    url: "https://www.usno.navy.mil",
    scope: "Precise time, almanac data, Sun/Moon rise-set, and phases.",
  },
  imo: {
    key: "imo",
    name: "IMO",
    organization: "International Meteor Organization",
    url: "https://www.imo.net",
    scope: "Meteor shower activity, radiants, and peak forecasts.",
  },
  britannica: {
    key: "britannica",
    name: "Britannica",
    organization: "Encyclopaedia Britannica",
    url: "https://www.britannica.com",
    scope:
      "General reference for the history of astronomy, biographies, and cultural context.",
  },
  wikimedia: {
    key: "wikimedia",
    name: "Wikimedia Commons",
    organization: "Wikimedia Foundation",
    url: "https://commons.wikimedia.org",
    scope: "Openly licensed and public-domain space imagery.",
    usage:
      "Each file's license (public domain or Creative Commons) and attribution are recorded before use.",
  },
};

export function getSource(key: SourceKey): Source {
  return SOURCES[key];
}

export function getSources(keys: readonly SourceKey[] = []): Source[] {
  return keys.map((k) => SOURCES[k]).filter(Boolean);
}
