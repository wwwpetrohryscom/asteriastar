import type { SourceKey } from "@/lib/sources";

/**
 * Star catalog data model.
 *
 * Records are GENERATED from the open HYG database (Hipparcos + Yale Bright Star
 * + Gliese), CC BY-SA 4.0 — see scripts/ingest-stars.ts and the records/ shards.
 * Every value is real catalog data. Fields are optional and simply omitted when
 * the catalog has no reliable value; nothing is invented.
 */

export type StarCategory =
  | "main-sequence"
  | "red-dwarf"
  | "white-dwarf"
  | "brown-dwarf"
  | "blue-giant"
  | "blue-supergiant"
  | "red-giant"
  | "red-supergiant"
  | "yellow-dwarf"
  | "hypergiant"
  | "wolf-rayet"
  | "neutron-star"
  | "pulsar"
  | "magnetar"
  | "variable-star"
  | "binary-star"
  | "triple-system"
  | "multiple-star-system"
  | "protostar"
  | "subgiant";

export const STAR_CATEGORY_LABELS: Record<StarCategory, string> = {
  "main-sequence": "Main-sequence star",
  "red-dwarf": "Red dwarf",
  "white-dwarf": "White dwarf",
  "brown-dwarf": "Brown dwarf",
  "blue-giant": "Blue giant",
  "blue-supergiant": "Blue supergiant",
  "red-giant": "Red giant",
  "red-supergiant": "Red supergiant",
  "yellow-dwarf": "Yellow dwarf",
  hypergiant: "Hypergiant",
  "wolf-rayet": "Wolf-Rayet star",
  "neutron-star": "Neutron star",
  pulsar: "Pulsar",
  magnetar: "Magnetar",
  "variable-star": "Variable star",
  "binary-star": "Binary star",
  "triple-system": "Triple system",
  "multiple-star-system": "Multiple star system",
  protostar: "Protostar",
  subgiant: "Subgiant",
};

/** Star catalogs the platform recognizes (identifiers stored per star). */
export interface StarCatalogDef {
  id: string;
  name: string;
  description: string;
}

export const STAR_CATALOGS: StarCatalogDef[] = [
  { id: "bayer", name: "Bayer", description: "Greek-letter designations within a constellation (1603)." },
  { id: "flamsteed", name: "Flamsteed", description: "Numbered designations within a constellation (1712)." },
  { id: "bright-star", name: "Bright Star Catalogue", description: "Yale catalogue of stars to ~magnitude 6.5 (HR numbers)." },
  { id: "harvard-revised", name: "Harvard Revised", description: "The HR designations of the Bright Star Catalogue." },
  { id: "hipparcos", name: "Hipparcos", description: "ESA astrometric catalogue (HIP numbers, 1997)." },
  { id: "tycho", name: "Tycho", description: "ESA Tycho astrometric catalogue." },
  { id: "gaia", name: "Gaia", description: "ESA Gaia astrometric survey (future identifier support)." },
  { id: "henry-draper", name: "Henry Draper", description: "Spectral catalogue (HD numbers)." },
  { id: "gliese", name: "Gliese", description: "Catalogue of Nearby Stars (Gl/GJ numbers)." },
  { id: "sao", name: "SAO", description: "Smithsonian Astrophysical Observatory Star Catalog." },
];

/** Catalog identifiers held for a star (all real; absent when not catalogued). */
export interface StarIdentifiers {
  hip?: string;
  hd?: string;
  hr?: string;
  gliese?: string;
  bayer?: string;
  flamsteed?: string;
  tycho?: string;
  sao?: string;
}

export interface StarRecord {
  /** Stable graph id, "star:<slug>". */
  id: string;
  slug: string;
  /** Display name: proper name, else a catalog designation. */
  name: string;
  /** Formal Bayer designation, e.g. "Alpha Canis Majoris" (when applicable). */
  scientificName?: string;
  /** Constellation entity id, e.g. "constellation:canis-major". */
  constellation: string;
  /** Standard 3-letter constellation abbreviation, e.g. "CMa". */
  constellationAbbr: string;
  ids: StarIdentifiers;
  /** Apparent (visual) magnitude. */
  apparentMagnitude?: number;
  /** Absolute magnitude. */
  absoluteMagnitude?: number;
  distanceLy?: number;
  distancePc?: number;
  /** Raw spectral type from the catalogue, e.g. "A1V". */
  spectralType?: string;
  /** Leading spectral class letter (O B A F G K M …), derived from spectralType. */
  spectralClass?: string;
  /** Luminosity class (V, IV, III, II, I …), derived from spectralType. */
  luminosityClass?: string;
  /** Luminosity in solar units. */
  luminositySolar?: number;
  /** Colour index B−V. */
  colorIndex?: number;
  /** Right ascension in hours. */
  ra?: number;
  /** Declination in degrees. */
  dec?: number;
  /** Category classified from the spectral type (a definition, not a guess). */
  category?: StarCategory;
  variable?: boolean;
  variableDesignation?: string;
  multiple?: boolean;
  /** Catalog system base designation (shared by components of one system). */
  systemBase?: string;
  sources: SourceKey[];
}
