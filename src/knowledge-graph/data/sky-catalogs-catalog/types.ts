import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Astronomical Catalogs & Professional Sky Databases data model (Program CD) — the professional catalog
 * layer. It REUSES the eleven catalogue entities already in the graph (Messier, NGC, IC, Henry Draper,
 * Hipparcos, Gaia, the Harvard/Yerkes classifications, the historical star catalogues), the sky surveys
 * (SDSS, 2MASS, WISE, Gaia DR3, Pan-STARRS, LSST…), the data archives (CDS, SIMBAD, VizieR, NED, MAST…),
 * the compiling astronomers, and the Gaia telescope. CD adds only what was missing: the professional
 * catalogs that were carried only as designation *fields* (Caldwell, Barnard, Sharpless, Abell, PGC, UGC,
 * Gliese, Tycho-2, SAO, GCVS, WDS, LHS, Wolf, the Bonner Durchmusterung) as first-class `catalog`
 * entities, the `catalog_family` groupings, and the stellar `designation_system` schemes (Bayer,
 * Flamsteed, variable-star naming). kind groups the entries for discovery. Only well-established,
 * checkable catalogue facts are stated; unknown counts/epochs are left empty and nothing is fabricated.
 */

export type CdKind =
  | "catalog" // a professional astronomical catalogue (reuses the existing `catalog` type)
  | "family" // a grouping of related catalogues
  | "designation"; // a stellar designation / naming system

export const KIND_ENTITY_TYPE: Record<CdKind, EntityType> = {
  catalog: "catalog",
  family: "catalog_family",
  designation: "designation_system",
};

export const KIND_LABEL: Record<CdKind, string> = {
  catalog: "Catalogue",
  family: "Catalog family",
  designation: "Designation system",
};

export interface CdRecord {
  id: string;
  slug: string;
  name: string;
  kind: CdKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED catalogs/astronomers/archives/surveys or other new CD entities

  /* display — only firmly-established values; unknowns stay empty */
  abbrev?: string; // the designation prefix, e.g. "Sh2", "BD", "M", "GCVS"
  epochLabel?: string; // e.g. "1774–1781" or "1888" — only when firmly dated
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type. IAU default source. */
export function cd(
  kind: CdKind,
  r: Omit<CdRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): CdRecord {
  return { sources: ["iau"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
