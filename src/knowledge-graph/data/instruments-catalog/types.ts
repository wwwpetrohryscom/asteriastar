import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Scientific Instruments & Payloads Encyclopedia data model (Program AH) — the science
 * payload layer: the classes of instrument and the instruments themselves. The many
 * `scientific_instrument` entities already in the graph (Mars, JWST, Hubble, Juno, and
 * ground-telescope instruments) are REUSED and enriched by linking them to their instrument
 * class; new notable instruments are created and linked to their host missions. Nothing is
 * fabricated — unknown values are omitted.
 */

export type InstKind =
  | "class" // an instrument class / type
  | "instrument"; // a specific instrument (existing scientific_instrument reused, or created)

export const KIND_ENTITY_TYPE: Record<InstKind, EntityType> = {
  class: "instrument_class",
  instrument: "scientific_instrument",
};

export const KIND_LABEL: Record<InstKind, string> = {
  class: "Instrument class",
  instrument: "Instrument",
};

export type InstCategory = "imaging" | "spectroscopy" | "fields-particles" | "active-sensing" | "other";

export interface InstRecord {
  id: string;
  slug: string;
  name: string;
  kind: InstKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  classSlug?: string; // → instrument_class (member_of_group) — for instruments
  hostKeys?: string[]; // full space_mission/space_telescope/spacecraft ids (contains_instrument) — for new instruments
  relatedKeys?: string[]; // full ids (associated_with)

  /* display */
  category?: InstCategory;
  measures?: string;
  definition?: string;
  highlights?: string[];
}
