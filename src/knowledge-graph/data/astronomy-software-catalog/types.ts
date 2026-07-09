import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Astronomical Software Ecosystem data model (Program CH) — the software layer. The graph already models
 * the scientific-software half under `research_software` (Astropy, Astroquery) and the ephemeris
 * software/services under `ephemeris_system` (the SPICE toolkit, JPL Horizons, the JPL DE) — all REUSED,
 * not duplicated. CH adds the missing packages: the desktop planetarium and imaging/acquisition apps as a
 * new `astronomy_software` type, and the scientific tools and libraries (IRAF, CASA, DS9, TOPCAT, Aladin,
 * AstroImageJ, Montage, Skyfield, poliastro, Orekit) as `research_software` (the existing type, beside
 * Astropy). Each package links to the observing techniques, data archives and standards, observatories,
 * instruments, ephemerides, and sibling software it works with. Only well-established, checkable facts
 * (purpose, platforms) are stated; version numbers and unknowns are left out and nothing is fabricated.
 */

export type ChKind =
  | "desktop" // a desktop planetarium / sky-visualisation app
  | "imaging" // image-processing software
  | "acquisition" // acquisition / device-control software
  | "scientific" // a professional scientific tool
  | "library"; // a programming library / toolkit

export const KIND_ENTITY_TYPE: Record<ChKind, EntityType> = {
  desktop: "astronomy_software",
  imaging: "astronomy_software",
  acquisition: "astronomy_software",
  scientific: "research_software",
  library: "research_software",
};

export const KIND_LABEL: Record<ChKind, string> = {
  desktop: "Desktop / planetarium",
  imaging: "Imaging software",
  acquisition: "Acquisition & control",
  scientific: "Scientific tool",
  library: "Library / toolkit",
};

export interface ChRecord {
  id: string;
  slug: string;
  name: string;
  kind: ChKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED techniques/archives/observatories/ephemerides or other new CH software

  /* display — only firmly-established facts; unknowns stay empty */
  platforms?: string[]; // e.g. ["Windows", "macOS", "Linux"]
  licenseLabel?: string; // e.g. "Open source (GPL)", "Commercial" — only when firmly known
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type. NASA default source. */
export function ch(
  kind: ChKind,
  r: Omit<ChRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): ChRecord {
  return { sources: ["nasa"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
