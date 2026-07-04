import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Space Missions Timeline & Historical Events Encyclopedia data model (Program AK) — the
 * chronological history of spaceflight. It REUSES the space missions, mission programs,
 * astronauts, organizations, space stations, telescopes, and the planets/moons/small bodies
 * already in the graph; the new entities are the historic eras, the dated timeline events,
 * the mission milestones ("firsts"), and the standing records. Nothing is fabricated — dates
 * are given only to the precision that is well established, and unknown values are omitted.
 */

export type TimelineKind =
  | "era" // a historic period of spaceflight (a grouping the events belong to)
  | "event" // a specific dated event in the history of spaceflight
  | "milestone" // a "first" — a milestone achievement
  | "record"; // a standing superlative (longest, farthest, fastest, …)

export const KIND_ENTITY_TYPE: Record<TimelineKind, EntityType> = {
  era: "historic_space_event",
  event: "timeline_event",
  milestone: "mission_milestone",
  record: "record",
};

export const KIND_LABEL: Record<TimelineKind, string> = {
  era: "Era",
  event: "Timeline event",
  milestone: "Milestone",
  record: "Record",
};

export type TimelineCategory =
  | "launch"
  | "crewed"
  | "landing"
  | "flyby"
  | "orbit"
  | "spacewalk"
  | "failure"
  | "recovery"
  | "station"
  | "sample-return"
  | "telescope"
  | "planetary-defense"
  | "commercial"
  | "discovery"
  | "record"
  | "era";

export interface TimelineRecord {
  id: string;
  slug: string;
  name: string;
  kind: TimelineKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* chronology */
  year?: number; // for deterministic sorting; the display date is dateLabel
  dateLabel?: string; // human date/span, e.g. "12 April 1961" or "1957–1961"

  /* cross-references */
  eraSlug?: string; // → historic_space_event (part_of) — for events/milestones/records
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with) — missions/people/orgs/bodies
  bodyKey?: string; // full planet/moon/dwarf_planet/asteroid/comet id (associated_with)

  /* display */
  category?: TimelineCategory;
  definition?: string;
  highlights?: string[];
}
