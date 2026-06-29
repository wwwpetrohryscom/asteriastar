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
  | "csa"
  | "jaxa"
  | "roscosmos"
  | "isro"
  | "iau"
  | "mpc"
  | "usno"
  | "imo"
  | "noirlab"
  | "eso"
  | "simbad"
  | "ned"
  | "ads"
  | "britannica"
  | "wikimedia";

/** The kind of authority a source carries — used for evidence weighting. */
export type AuthorityType =
  | "space-agency"
  | "observatory"
  | "database"
  | "union"
  | "literature"
  | "reference"
  | "media";

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
  /** Country or region of the body. */
  country: string;
  /** The kind of authority this source carries. */
  authorityType: AuthorityType;
  /** A short note on reliability and how the source should be used. */
  reliability: string;
  /** Recommended human-readable citation pattern for this source. */
  citationFormat?: string;
  /** Imagery / data licensing note, where relevant. */
  usage?: string;
}

export const SOURCES: Record<SourceKey, Source> = {
  nasa: {
    key: "nasa",
    name: "NASA",
    organization: "National Aeronautics and Space Administration",
    url: "https://www.nasa.gov",
    scope: "Mission data, planetary science, space telescopes, and public-domain imagery.",
    country: "United States",
    authorityType: "space-agency",
    reliability: "Primary agency source; authoritative for its own missions and data products.",
    citationFormat: "NASA. (Year). Title. https://www.nasa.gov",
    usage: "Most NASA-produced imagery is in the public domain; individual items are checked for usage terms before publication.",
  },
  jpl: {
    key: "jpl",
    name: "NASA JPL",
    organization: "Jet Propulsion Laboratory / Solar System Dynamics",
    url: "https://www.jpl.nasa.gov",
    scope: "Orbital data, ephemerides, and small-body parameters for planets, asteroids, and comets.",
    country: "United States",
    authorityType: "space-agency",
    reliability: "Primary for ephemerides and small-body orbital elements.",
    citationFormat: "NASA/JPL. (Year). Title. https://ssd.jpl.nasa.gov",
  },
  esa: {
    key: "esa",
    name: "ESA",
    organization: "European Space Agency",
    url: "https://www.esa.int",
    scope: "European missions, observatories, and space science imagery.",
    country: "Europe",
    authorityType: "space-agency",
    reliability: "Primary agency source for ESA missions and instruments.",
    citationFormat: "ESA. (Year). Title. https://www.esa.int",
  },
  csa: {
    key: "csa",
    name: "CSA",
    organization: "Canadian Space Agency",
    url: "https://www.asc-csa.gc.ca",
    scope: "Canadian missions, instruments, and contributions to international programs.",
    country: "Canada",
    authorityType: "space-agency",
    reliability: "Primary agency source for CSA programs.",
  },
  jaxa: {
    key: "jaxa",
    name: "JAXA",
    organization: "Japan Aerospace Exploration Agency",
    url: "https://global.jaxa.jp",
    scope: "Japanese missions (Hayabusa, Akatsuki) and space science.",
    country: "Japan",
    authorityType: "space-agency",
    reliability: "Primary agency source for JAXA missions.",
  },
  roscosmos: {
    key: "roscosmos",
    name: "Roscosmos",
    organization: "State Space Corporation Roscosmos",
    url: "https://www.roscosmos.ru",
    scope: "Russian crewed and robotic spaceflight history and programs.",
    country: "Russia",
    authorityType: "space-agency",
    reliability: "Primary agency source for Russian/Soviet programs; cross-check historical claims.",
  },
  isro: {
    key: "isro",
    name: "ISRO",
    organization: "Indian Space Research Organisation",
    url: "https://www.isro.gov.in",
    scope: "Indian missions (Chandrayaan, Mangalyaan) and launch vehicles.",
    country: "India",
    authorityType: "space-agency",
    reliability: "Primary agency source for ISRO missions.",
  },
  iau: {
    key: "iau",
    name: "IAU",
    organization: "International Astronomical Union",
    url: "https://www.iau.org",
    scope: "Official naming, definitions, constellation boundaries, and astronomical nomenclature.",
    country: "International",
    authorityType: "union",
    reliability: "Definitive for nomenclature, definitions, and official designations.",
    citationFormat: "IAU. (Year). Title/Resolution. https://www.iau.org",
  },
  mpc: {
    key: "mpc",
    name: "Minor Planet Center",
    organization: "IAU Minor Planet Center",
    url: "https://www.minorplanetcenter.net",
    scope: "Designations and orbits of asteroids, comets, and minor bodies.",
    country: "International",
    authorityType: "database",
    reliability: "Authoritative for minor-body designations and orbital data.",
  },
  usno: {
    key: "usno",
    name: "US Naval Observatory",
    organization: "United States Naval Observatory",
    url: "https://www.usno.navy.mil",
    scope: "Precise time, almanac data, Sun/Moon rise-set, and phases.",
    country: "United States",
    authorityType: "observatory",
    reliability: "Authoritative for precise time and almanac computations.",
  },
  imo: {
    key: "imo",
    name: "IMO",
    organization: "International Meteor Organization",
    url: "https://www.imo.net",
    scope: "Meteor shower activity, radiants, and peak forecasts.",
    country: "International",
    authorityType: "union",
    reliability: "Authoritative for meteor shower activity and observing data.",
  },
  noirlab: {
    key: "noirlab",
    name: "NSF NOIRLab",
    organization: "NSF National Optical-Infrared Astronomy Research Laboratory",
    url: "https://noirlab.edu",
    scope: "Ground-based optical/infrared observatory data and imagery.",
    country: "United States",
    authorityType: "observatory",
    reliability: "Primary for its facilities' data and imagery.",
  },
  eso: {
    key: "eso",
    name: "ESO",
    organization: "European Southern Observatory",
    url: "https://www.eso.org",
    scope: "Southern-hemisphere observatory data and imagery (VLT, ALMA partner).",
    country: "Europe",
    authorityType: "observatory",
    reliability: "Primary for ESO facilities' data and imagery.",
  },
  simbad: {
    key: "simbad",
    name: "SIMBAD",
    organization: "Centre de données astronomiques de Strasbourg (CDS)",
    url: "https://simbad.cds.unistra.fr",
    scope: "Reference database of astronomical objects, identifiers, and measurements.",
    country: "France",
    authorityType: "database",
    reliability: "Authoritative cross-identification database; aggregates published measurements.",
  },
  ned: {
    key: "ned",
    name: "NED",
    organization: "NASA/IPAC Extragalactic Database",
    url: "https://ned.ipac.caltech.edu",
    scope: "Reference database for extragalactic objects (galaxies, quasars).",
    country: "United States",
    authorityType: "database",
    reliability: "Authoritative aggregate database for extragalactic objects.",
  },
  ads: {
    key: "ads",
    name: "NASA ADS",
    organization: "NASA Astrophysics Data System",
    url: "https://ui.adsabs.harvard.edu",
    scope: "Bibliographic index of peer-reviewed astronomy and astrophysics literature.",
    country: "United States",
    authorityType: "literature",
    reliability: "Index of peer-reviewed literature; the underlying papers are the primary evidence.",
  },
  britannica: {
    key: "britannica",
    name: "Britannica",
    organization: "Encyclopaedia Britannica",
    url: "https://www.britannica.com",
    scope: "General reference for the history of astronomy, biographies, and cultural context.",
    country: "United States",
    authorityType: "reference",
    reliability: "Edited reference work; suitable for historical and biographical context, not primary data.",
  },
  wikimedia: {
    key: "wikimedia",
    name: "Wikimedia Commons",
    organization: "Wikimedia Foundation",
    url: "https://commons.wikimedia.org",
    scope: "Openly licensed and public-domain space imagery.",
    country: "International",
    authorityType: "media",
    reliability: "Media repository; each file's license and original source are verified before use.",
    usage: "Each file's license (public domain or Creative Commons) and attribution are recorded before use.",
  },
};

export const AUTHORITY_TYPE_LABELS: Record<AuthorityType, string> = {
  "space-agency": "Space agency",
  observatory: "Observatory",
  database: "Reference database",
  union: "Scientific union",
  literature: "Peer-reviewed literature",
  reference: "Reference work",
  media: "Media repository",
};

export function getSource(key: SourceKey): Source {
  return SOURCES[key];
}

export function getSources(keys: readonly SourceKey[] = []): Source[] {
  return keys.map((k) => SOURCES[k]).filter(Boolean);
}

export function getAllSources(): Source[] {
  return Object.values(SOURCES);
}

/** Validate the source registry (structure + required authority fields). */
export function validateSources(sources: Source[] = getAllSources()): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const s of sources) {
    if (seen.has(s.key)) issues.push(`duplicate source key: ${s.key}`);
    seen.add(s.key);
    if (!s.organization?.trim()) issues.push(`${s.key}: missing organization`);
    if (!s.url?.trim()) issues.push(`${s.key}: missing url`);
    if (!s.country?.trim()) issues.push(`${s.key}: missing country`);
    if (!s.authorityType) issues.push(`${s.key}: missing authority type`);
    if (!s.reliability?.trim()) issues.push(`${s.key}: missing reliability note`);
  }
  return issues;
}
