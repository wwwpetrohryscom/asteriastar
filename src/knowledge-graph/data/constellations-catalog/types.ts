import type { SourceKey } from "@/lib/sources";

/**
 * Constellation Encyclopedia data model (Program W).
 *
 * The 88 IAU constellations already exist as graph entities; these records
 * ENRICH them (never recreate) with standard IAU reference data, and add
 * first-class family / asterism / seasonal-sky entities. EVERY rich field is
 * optional and omitted when not reliably known — areas, ranks, coordinates,
 * mythology, and observing seasons are curated from authoritative references
 * (IAU, standard star atlases) and NEVER invented. Stars, deep-sky objects,
 * exoplanets, meteor showers, and mythology figures are REUSED by id — this
 * program creates none of them.
 */

export type Hemisphere = "northern" | "southern" | "equatorial";
export type Season = "winter" | "spring" | "summer" | "autumn";

/** One of the 88 IAU constellations (enrichment record, existing entity). */
export interface ConstellationRecord {
  /** Graph entity id, "constellation:{slug}" — reuses the existing entity. */
  id: string;
  slug: string;
  /** Canonical name from the star catalogue (e.g. "Boötes", "Canis Major"). */
  name: string;
  /** IAU 3-letter abbreviation. */
  abbr: string;
  /** Latin genitive form. */
  genitive: string;
  /** English/common meaning of the name, when it has one. */
  meaning?: string;
  sources: SourceKey[];

  /* --- reference groupings (drive discovery hubs + faceted pages) --- */
  family?: string; // family slug (e.g. "ursa-major", "zodiacal", "hercules")
  hemisphere?: Hemisphere;
  season?: Season; // best evening visibility from the northern mid-latitudes
  zodiac?: boolean;
  ptolemaic?: boolean; // one of Ptolemy's ancient 48
  circumpolarNorth?: boolean;
  circumpolarSouth?: boolean;
  neighborSlugs?: string[]; // curated IAU-boundary adjacency → neighbor_of edges

  /* --- optional display specs, NEVER invented --- */
  areaSqDeg?: number; // official IAU area
  rankByArea?: number; // 1 = largest (Hydra) … 88 = smallest (Crux)
  raHours?: number; // approximate central right ascension (hours)
  decDeg?: number; // approximate central declination (degrees)
  quadrant?: string; // e.g. "NQ1", "SQ3"
  visibleLatMin?: number; // southern latitude limit of full visibility
  visibleLatMax?: number; // northern latitude limit of full visibility
  bestMonth?: string; // month of best evening culmination (reference, not computed)
  brightestStarId?: string; // "star:{slug}" (reused); else derived from the catalogue
  mythologyFigureId?: string; // "mythology_figure:{slug}" (reused)

  description?: string;
  highlights?: string[]; // naked-eye / binocular / telescope highlights (curated)
}

/** A traditional constellation family (new first-class entity). Membership is
 *  DERIVED from each constellation's `family` field (single source of truth). */
export interface FamilyRecord {
  slug: string;
  name: string;
  sources: SourceKey[];
  description: string;
}

/** A named asterism — a recognizable star pattern (new first-class entity). */
export interface AsterismRecord {
  slug: string;
  name: string;
  sources: SourceKey[];
  description: string;
  /** Constellation slugs the asterism draws its stars from (→ associated_with). */
  constellationSlugs: string[];
  /** Star ids the asterism is composed of, when catalogued (reused). */
  starIds?: string[];
}

/** A seasonal sky (new first-class entity). Northern-hemisphere evening sky. */
export interface SeasonRecord {
  slug: Season;
  name: string;
  sources: SourceKey[];
  description: string;
  months: string; // e.g. "December–February"
}
