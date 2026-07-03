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
  | "hipparcos"
  | "gaia"
  | "hyg"
  | "openngc"
  | "britannica"
  | "nobel"
  | "planck"
  | "ligo"
  | "eht"
  | "euclid"
  | "desi"
  | "sdss"
  | "swpc"
  | "noaa"          // NOAA — the public-domain Solar Calculator (sunrise/sunset/twilight geometry)
  | "donki"
  | "celestrak"
  | "stsci"
  | "esa-hubble"
  | "esa-webb"
  | "wikimedia"
  // Launch-vehicle manufacturers/operators + a specialist launch-vehicle reference
  // (Program V). Manufacturer sources are "reference" authority — primary for
  // their own hardware, but secondary/press-derived, not peer-reviewed.
  | "spacex"
  | "arianespace"
  | "ula"
  | "rocketlab"
  | "blueorigin"
  | "gunters";

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
  hipparcos: {
    key: "hipparcos",
    name: "Hipparcos",
    organization: "ESA Hipparcos space astrometry mission",
    url: "https://www.cosmos.esa.int/web/hipparcos",
    scope: "High-precision parallax, magnitude, and position for ~118,000 stars.",
    country: "Europe",
    authorityType: "space-agency",
    reliability: "Primary astrometric catalogue; the basis for stellar distances and magnitudes.",
  },
  gaia: {
    key: "gaia",
    name: "Gaia",
    organization: "ESA Gaia astrometric survey",
    url: "https://www.cosmos.esa.int/web/gaia",
    scope: "Billion-star astrometry, photometry, and distances (future identifier support).",
    country: "Europe",
    authorityType: "space-agency",
    reliability: "The most precise modern astrometric survey.",
  },
  hyg: {
    key: "hyg",
    name: "HYG Database",
    organization: "HYG Database (Hipparcos + Yale Bright Star + Gliese), by D. Nash / astronexus",
    url: "https://www.astronexus.com/hyg",
    scope: "Aggregated, openly-licensed star catalogue combining Hipparcos, the Yale Bright Star Catalogue, and the Gliese Catalogue of Nearby Stars.",
    country: "International",
    authorityType: "database",
    reliability: "A compilation of primary catalogues (Hipparcos/Yale/Gliese); CC BY-SA 4.0. The underlying surveys are the primary evidence.",
  },
  openngc: {
    key: "openngc",
    name: "OpenNGC",
    organization: "OpenNGC (M. Verga) — NGC/IC, Messier, and Caldwell catalogue data",
    url: "https://github.com/mattiaverga/OpenNGC",
    scope: "Openly-licensed deep-sky catalogue: object types, positions, magnitudes, sizes, morphology, and cross-identifiers.",
    country: "International",
    authorityType: "database",
    reliability: "A curated compilation of the NGC/IC, Messier, and Caldwell catalogues (CC BY-SA 4.0); underlying surveys (NED, HyperLEDA, SIMBAD) are the primary evidence.",
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
  nobel: {
    key: "nobel",
    name: "The Nobel Prize",
    organization: "The Nobel Foundation",
    url: "https://www.nobelprize.org",
    scope: "Official record of Nobel laureates, prize motivations, and award years.",
    country: "Sweden",
    authorityType: "reference",
    reliability: "Definitive primary source for Nobel Prize laureates, citations, and years.",
    citationFormat: "The Nobel Foundation. (Year). Title. https://www.nobelprize.org",
  },
  planck: {
    key: "planck",
    name: "Planck Collaboration",
    organization: "ESA Planck mission / Planck Collaboration",
    url: "https://www.cosmos.esa.int/web/planck",
    scope: "Cosmic microwave background maps and the cosmological parameters of the ΛCDM model.",
    country: "Europe",
    authorityType: "space-agency",
    reliability: "Primary source for CMB measurements and best-fit cosmological parameters; peer-reviewed.",
    citationFormat: "Planck Collaboration. (Year). Planck results. Astronomy & Astrophysics.",
  },
  ligo: {
    key: "ligo",
    name: "LIGO Scientific Collaboration",
    organization: "LIGO Scientific Collaboration & Virgo Collaboration",
    url: "https://www.ligo.org",
    scope: "Direct detections of gravitational waves from compact-object mergers.",
    country: "International",
    authorityType: "observatory",
    reliability: "Primary source for gravitational-wave detections; peer-reviewed and openly archived.",
  },
  eht: {
    key: "eht",
    name: "Event Horizon Telescope",
    organization: "Event Horizon Telescope Collaboration",
    url: "https://eventhorizontelescope.org",
    scope: "Horizon-scale images of supermassive black holes (M87*, Sagittarius A*).",
    country: "International",
    authorityType: "observatory",
    reliability: "Primary source for black-hole imaging; peer-reviewed results.",
  },
  euclid: {
    key: "euclid",
    name: "ESA Euclid",
    organization: "ESA Euclid mission",
    url: "https://www.esa.int/Science_Exploration/Space_Science/Euclid",
    scope: "Wide-field mapping of dark matter and dark energy via weak lensing and galaxy clustering.",
    country: "Europe",
    authorityType: "space-agency",
    reliability: "Primary mission source for dark-energy and large-scale-structure constraints.",
  },
  desi: {
    key: "desi",
    name: "DESI",
    organization: "Dark Energy Spectroscopic Instrument",
    url: "https://www.desi.lbl.gov",
    scope: "Spectroscopic redshift survey measuring baryon acoustic oscillations and dark energy.",
    country: "International",
    authorityType: "observatory",
    reliability: "Primary survey source for BAO and expansion-history measurements; peer-reviewed.",
  },
  sdss: {
    key: "sdss",
    name: "SDSS",
    organization: "Sloan Digital Sky Survey",
    url: "https://www.sdss.org",
    scope: "Multi-wavelength survey of galaxies, quasars, and large-scale structure.",
    country: "International",
    authorityType: "database",
    reliability: "Reference survey; underlying observations are peer-reviewed public data.",
  },
  swpc: {
    key: "swpc",
    name: "NOAA SWPC",
    organization: "NOAA Space Weather Prediction Center",
    url: "https://www.swpc.noaa.gov",
    scope: "Space-weather forecasts and alerts: aurora (OVATION), the Kp index, and the G1–G5 geomagnetic storm scale.",
    country: "United States",
    authorityType: "observatory",
    reliability: "Authoritative US government source for real-time space-weather forecasts and alerts.",
    citationFormat: "NOAA SWPC. (Year). Space weather product. https://www.swpc.noaa.gov",
  },
  noaa: {
    key: "noaa",
    name: "NOAA Solar Calculator",
    organization: "NOAA Global Monitoring Laboratory",
    url: "https://gml.noaa.gov/grad/solcalc/",
    scope: "Public-domain solar-position geometry: sunrise, sunset, solar noon, twilight, declination, and the equation of time.",
    country: "United States",
    authorityType: "observatory",
    reliability: "Authoritative US-government solar calculator; its algorithm is the low-precision method of the Astronomical Almanac.",
    citationFormat: "NOAA Global Monitoring Laboratory. Solar Calculator. https://gml.noaa.gov/grad/solcalc/",
    usage: "Public domain (US Government work).",
  },
  donki: {
    key: "donki",
    name: "NASA DONKI",
    organization: "NASA Community Coordinated Modeling Center",
    url: "https://ccmc.gsfc.nasa.gov/tools/DONKI/",
    scope: "The Space Weather Database Of Notifications, Knowledge, Information: solar flares, CMEs, and geomagnetic storms.",
    country: "United States",
    authorityType: "database",
    reliability: "Public NASA space-weather database with an open API.",
  },
  celestrak: {
    key: "celestrak",
    name: "CelesTrak",
    organization: "CelesTrak (Dr. T. S. Kelso)",
    url: "https://celestrak.org",
    scope: "Two-line orbital elements (TLEs) for satellites including the ISS, used with a propagator to predict passes.",
    country: "United States",
    authorityType: "database",
    reliability: "Long-standing public source of orbital elements; attribution expected.",
  },
  stsci: {
    key: "stsci",
    name: "STScI",
    organization: "Space Telescope Science Institute",
    url: "https://www.stsci.edu",
    scope: "Science operations and public image archives for the Hubble and James Webb space telescopes (MAST, HubbleSite, webbtelescope.org).",
    country: "United States",
    authorityType: "observatory",
    reliability: "Primary US image archive for Hubble and Webb; most releases are free to use with credit.",
    usage: "Hubble/Webb images released by NASA/STScI are generally free to use with a credit line; each item's terms are checked before use.",
  },
  "esa-hubble": {
    key: "esa-hubble",
    name: "ESA/Hubble",
    organization: "ESA/Hubble (European Space Agency)",
    url: "https://esahubble.org",
    scope: "The European Hubble image archive and press releases.",
    country: "Europe",
    authorityType: "observatory",
    reliability: "Primary European Hubble image archive; most images are released under CC BY 4.0.",
    usage: "ESA/Hubble images are generally licensed CC BY 4.0; attribution is required.",
  },
  "esa-webb": {
    key: "esa-webb",
    name: "ESA/Webb",
    organization: "ESA/Webb (European Space Agency)",
    url: "https://esawebb.org",
    scope: "The European James Webb Space Telescope image archive and press releases.",
    country: "Europe",
    authorityType: "observatory",
    reliability: "Primary European Webb image archive; most images are released under CC BY 4.0.",
    usage: "ESA/Webb images are generally licensed CC BY 4.0; attribution is required.",
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
  spacex: {
    key: "spacex",
    name: "SpaceX",
    organization: "Space Exploration Technologies Corp.",
    url: "https://www.spacex.com",
    scope: "Falcon 9, Falcon Heavy, Starship, and the Merlin/Raptor engines — manufacturer specifications and launch data.",
    country: "United States",
    authorityType: "reference",
    reliability: "Primary manufacturer source for its own vehicles; published figures are cross-checked against launch records and agency documents.",
    citationFormat: "SpaceX. (Year). Title. https://www.spacex.com",
  },
  arianespace: {
    key: "arianespace",
    name: "Arianespace",
    organization: "Arianespace SA",
    url: "https://www.arianespace.com",
    scope: "Ariane and Vega launch-vehicle families — user's manuals and mission data.",
    country: "Europe",
    authorityType: "reference",
    reliability: "Primary operator source for European launchers; user's-manual figures are authoritative for its own vehicles.",
    citationFormat: "Arianespace. (Year). Title. https://www.arianespace.com",
  },
  ula: {
    key: "ula",
    name: "ULA",
    organization: "United Launch Alliance",
    url: "https://www.ulalaunch.com",
    scope: "Atlas V, Delta IV, and Vulcan Centaur — manufacturer specifications and mission data.",
    country: "United States",
    authorityType: "reference",
    reliability: "Primary manufacturer source for its own launch vehicles; specification sheets cross-checked against launch records.",
    citationFormat: "United Launch Alliance. (Year). Title. https://www.ulalaunch.com",
  },
  rocketlab: {
    key: "rocketlab",
    name: "Rocket Lab",
    organization: "Rocket Lab USA, Inc.",
    url: "https://www.rocketlabusa.com",
    scope: "Electron, Neutron, and the Rutherford/Archimedes engines — manufacturer specifications.",
    country: "United States / New Zealand",
    authorityType: "reference",
    reliability: "Primary manufacturer source for its own vehicles; figures cross-checked against launch records.",
    citationFormat: "Rocket Lab. (Year). Title. https://www.rocketlabusa.com",
  },
  blueorigin: {
    key: "blueorigin",
    name: "Blue Origin",
    organization: "Blue Origin, LLC",
    url: "https://www.blueorigin.com",
    scope: "New Shepard, New Glenn, and the BE-3/BE-4 engines — manufacturer specifications.",
    country: "United States",
    authorityType: "reference",
    reliability: "Primary manufacturer source for its own vehicles; figures cross-checked against launch records.",
    citationFormat: "Blue Origin. (Year). Title. https://www.blueorigin.com",
  },
  gunters: {
    key: "gunters",
    name: "Gunter's Space Page",
    organization: "Gunter Krebs — Gunter's Space Page",
    url: "https://space.skyrocket.de",
    scope: "A specialist reference compilation of launch vehicles, stages, and spacecraft across all spacefaring nations.",
    country: "International",
    authorityType: "reference",
    reliability: "Widely-cited secondary reference for launch-vehicle history and configurations; used to corroborate agency and manufacturer figures, not as a sole primary source.",
    citationFormat: "Krebs, G. D. (Year). Title. Gunter's Space Page. https://space.skyrocket.de",
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
