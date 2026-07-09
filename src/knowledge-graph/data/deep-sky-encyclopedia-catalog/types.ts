import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Deep Sky Objects Encyclopedia data model (Program CE) — the DSO class/taxonomy layer that the graph's
 * 619+ deep-sky objects lacked. The object layer itself (galaxies, nebulae, star clusters, with
 * coordinates, magnitudes, sizes, constellations, and catalogue ids) is already comprehensive — and the
 * galaxy morphologies are already complete — so both are REUSED, not duplicated. CE adds the missing
 * *class* concepts — the deep-sky object classes (open & globular clusters and stellar associations, the
 * nebula subtypes, supernova remnants, HII regions, Bok globules) as `astrophysical_object_class`
 * entities — plus the two genuinely-missing famous objects (the Horsehead and Cone nebulae) as `nebula`
 * entities. It reuses the existing object classes, morphologies, interstellar-medium concepts,
 * stellar-death processes, catalogues, and constellations. No new EntityType is introduced. Only
 * well-established astrophysics is stated; distances/values appear only where firm; nothing is fabricated.
 */

export type CeKind =
  | "dso-class" // a deep-sky object class (astrophysical_object_class)
  | "object"; // a specific deep-sky object (nebula)

export const KIND_ENTITY_TYPE: Record<CeKind, EntityType> = {
  "dso-class": "astrophysical_object_class",
  object: "nebula",
};

export const KIND_LABEL: Record<CeKind, string> = {
  "dso-class": "Deep-sky object class",
  object: "Deep-sky object",
};

export interface CeRecord {
  id: string;
  slug: string;
  name: string;
  kind: CeKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED objects/concepts/catalogues or other new CE entities

  /* display — only firmly-established values; unknowns stay empty */
  prototype?: string; // a canonical example, e.g. "M13 (Hercules Cluster)"
  constellationLabel?: string; // for objects, e.g. "Orion"
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type. NASA default source. */
export function ce(
  kind: CeKind,
  r: Omit<CeRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): CeRecord {
  return { sources: ["nasa"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
