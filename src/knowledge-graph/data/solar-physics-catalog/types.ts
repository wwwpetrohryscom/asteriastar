import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Solar Physics, Heliosphere & Solar Observatory data model (Program BY) — the Sun from its core to the
 * edge of the heliosphere. It REUSES the Sun (`star:sun`), the space-weather phenomena already in the
 * graph (solar wind, solar flare, CME, sunspot, coronal hole, active region, solar cycle, heliosphere,
 * heliopause), helioseismology (`astronomy_method:helioseismology`), the solar observatories (SOHO,
 * SDO, Hinode, Parker Solar Probe, Solar Orbiter, DKIST), and the operating organisations. The NEW
 * entities are the concentric solar regions (interior zones and atmosphere layers), the solar surface
 * and atmospheric features, the solar-physics processes and cycle concepts, and the heliosphere
 * structures. Only well-established solar physics is stated; measured values are given only where firmly
 * known and unknown values are left empty. Nothing is fabricated.
 */

export type SolarKind =
  | "interior" // a concentric interior zone of the Sun (solar_region)
  | "atmosphere" // a layer of the solar atmosphere (solar_region)
  | "feature" // a solar surface or atmospheric feature (solar_feature)
  | "physics" // a solar-physics process or mechanism (stellar_physics_concept)
  | "cycle" // a solar-cycle concept or grand-minimum epoch (stellar_physics_concept)
  | "wind" // a solar-wind regime (stellar_physics_concept)
  | "heliosphere"; // a structure of the heliosphere (heliosphere_structure)

export const KIND_ENTITY_TYPE: Record<SolarKind, EntityType> = {
  interior: "solar_region",
  atmosphere: "solar_region",
  feature: "solar_feature",
  physics: "stellar_physics_concept",
  cycle: "stellar_physics_concept",
  wind: "stellar_physics_concept",
  heliosphere: "heliosphere_structure",
};

export const KIND_LABEL: Record<SolarKind, string> = {
  interior: "Solar interior",
  atmosphere: "Solar atmosphere",
  feature: "Solar feature",
  physics: "Solar physics",
  cycle: "Solar cycle",
  wind: "Solar wind",
  heliosphere: "Heliosphere",
};

export interface SolarRecord {
  id: string;
  slug: string;
  name: string;
  kind: SolarKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "~15 million K" / "~1 AU" — only when firmly established
  definition?: string;
  highlights?: string[];
}

/** Factory: builds a record's id from its kind's entity type. Default source is NASA; override per record. */
export function solar(
  kind: SolarKind,
  r: Omit<SolarRecord, "id" | "sources" | "kind"> & { slug: string; sources?: SourceKey[] },
): SolarRecord {
  return { sources: ["nasa"], ...r, kind, id: `${KIND_ENTITY_TYPE[kind]}:${r.slug}` };
}
