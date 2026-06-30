import type { SourceKey } from "@/lib/sources";

/**
 * Knowledge graph schema.
 *
 * The graph is the connective tissue of Asteria Star: entities (stars,
 * planets, missions, myths, symbols…) joined by typed relations. Its single
 * most important rule is that **scientific, cultural, and astrological
 * connections are typed separately** — every relation carries a `domain` and a
 * `confidence`, and the validator (validate.ts) refuses to let astrology or
 * interpretive links masquerade as confirmed science.
 */

/** Kinds of things the graph can describe. */
export const ENTITY_TYPES = [
  "star",
  "planet",
  "dwarf_planet",
  "exoplanet",
  "moon",
  "galaxy",
  "nebula",
  "constellation",
  "star_cluster",
  "black_hole",
  "asteroid",
  "comet",
  "meteor_shower",
  "eclipse",
  "catalog",
  "space_mission",
  "spacecraft",
  "launch_vehicle",
  "satellite",
  "space_telescope",
  "observatory",
  "astronomer",
  "mythology_figure",
  "mythology_story",
  "astrology_sign",
  "astrology_planet",
  "astrology_house",
  "astrology_aspect",
  "calculator",
  "glossary_term",
  "guide",
  "article",
  "image_asset",
  "observation_event",
  "location",
  "organization",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

/** Ways entities can be connected. */
export const RELATION_TYPES = [
  "belongs_to",
  "part_of",
  "located_in",
  "visible_from",
  "observed_by",
  "discovered_by",
  "named_after",
  "associated_with",
  "mythologically_linked_to",
  "astrologically_associated_with",
  "scientifically_related_to",
  "mission_target",
  "operated_by",
  "launched_by",
  "studies",
  "explains",
  "references",
  "has_calculator",
  "has_gallery",
  "has_timeline",
  "related_to",
  "parent_of",
  "child_of",
  "belongs_to_constellation",
  "part_of_star_system",
  "binary_with",
  "member_of_cluster",
  "hosts_exoplanet",
  "catalogued_in",
] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

/** The realm a relation (or entity) belongs to. The boundary is structural. */
export const DOMAINS = ["science", "culture", "astrology", "editorial"] as const;
export type Domain = (typeof DOMAINS)[number];

/** Entities live in one of the knowledge realms (never "editorial"). */
export const ENTITY_DOMAINS = ["science", "culture", "astrology"] as const;
export type EntityDomain = (typeof ENTITY_DOMAINS)[number];

/** How well-established a relation is. */
export const CONFIDENCES = ["confirmed", "likely", "interpretive"] as const;
export type Confidence = (typeof CONFIDENCES)[number];

export interface GraphEntity {
  /** Stable id, conventionally `type:slug` (e.g. "star:sirius"). */
  id: string;
  type: EntityType;
  name: string;
  domain: EntityDomain;
  description?: string;
  /** Canonical path of this entity's content entry, if one exists. */
  entryPath?: string;
  aliases?: string[];
  sources?: SourceKey[];

  /* --- Optional intelligence fields. Left empty when a value is unknown;
     never invented. --- */
  /** Formal scientific designation (e.g. "Alpha Canis Majoris"). */
  scientificName?: string;
  /** Catalog designations (e.g. ["M31", "NGC 224"]). */
  catalogNumbers?: string[];
  /** Cross-reference ids/links to external identifiers. */
  crossReferences?: string[];
  /** Editorial significance hint (1–5) for ordering; optional, never fabricated science. */
  importance?: number;
}

export interface GraphRelation {
  /** Stable id, conventionally `from|type|to`. */
  id: string;
  from: string;
  to: string;
  type: RelationType;
  confidence: Confidence;
  domain: Domain;
  sources?: SourceKey[];
  note?: string;
}

/* ------------------------------------------------- domain typing rules */

/** Relation types that may ONLY be used in the science domain. */
export const SCIENCE_ONLY_RELATIONS: ReadonlySet<RelationType> = new Set([
  "belongs_to",
  "part_of",
  "located_in",
  "visible_from",
  "observed_by",
  "discovered_by",
  "mission_target",
  "operated_by",
  "launched_by",
  "studies",
  "scientifically_related_to",
  "belongs_to_constellation",
  "part_of_star_system",
  "binary_with",
  "member_of_cluster",
  "hosts_exoplanet",
  "catalogued_in",
]);

/** Relation types that may ONLY be used in the astrology domain. */
export const ASTROLOGY_ONLY_RELATIONS: ReadonlySet<RelationType> = new Set([
  "astrologically_associated_with",
]);

/** Relation types that may ONLY be used in the culture domain. */
export const CULTURE_ONLY_RELATIONS: ReadonlySet<RelationType> = new Set([
  "mythologically_linked_to",
]);

/** Build a stable relation id from its endpoints and type. */
export function makeRelationId(
  from: string,
  type: RelationType,
  to: string,
): string {
  return `${from}|${type}|${to}`;
}

/** Concise relation builder used by the graph data modules. */
export function rel(
  from: string,
  type: RelationType,
  to: string,
  confidence: Confidence,
  domain: Domain,
  extra: { sources?: SourceKey[]; note?: string } = {},
): GraphRelation {
  return { id: makeRelationId(from, type, to), from, to, type, confidence, domain, ...extra };
}

/* ------------------------------------------------------- display labels */

export const RELATION_LABELS: Record<RelationType, string> = {
  belongs_to: "Belongs to",
  part_of: "Part of",
  located_in: "Located in",
  visible_from: "Visible from",
  observed_by: "Observed by",
  discovered_by: "Discovered by",
  named_after: "Named after",
  associated_with: "Associated with",
  mythologically_linked_to: "Linked in myth to",
  astrologically_associated_with: "Associated with (astrology)",
  scientifically_related_to: "Scientifically related to",
  mission_target: "Mission target",
  operated_by: "Operated by",
  launched_by: "Launched by",
  studies: "Studies",
  explains: "Explains",
  references: "References",
  has_calculator: "Has calculator",
  has_gallery: "Has gallery",
  has_timeline: "Has timeline",
  related_to: "Related to",
  parent_of: "Parent of",
  child_of: "Child of",
  belongs_to_constellation: "In constellation",
  part_of_star_system: "Part of system",
  binary_with: "Binary with",
  member_of_cluster: "Member of cluster",
  hosts_exoplanet: "Hosts exoplanet",
  catalogued_in: "Catalogued in",
};

/** Labels for when the current entity is the *target* (incoming relation). */
export const INVERSE_RELATION_LABELS: Record<RelationType, string> = {
  belongs_to: "Includes",
  part_of: "Contains",
  located_in: "Contains",
  visible_from: "Visible location for",
  observed_by: "Observes",
  discovered_by: "Discovered",
  named_after: "Namesake of",
  associated_with: "Associated with",
  mythologically_linked_to: "Linked in myth to",
  astrologically_associated_with: "Associated with (astrology)",
  scientifically_related_to: "Scientifically related to",
  mission_target: "Target of",
  operated_by: "Operates",
  launched_by: "Launched",
  studies: "Studied by",
  explains: "Explained by",
  references: "Referenced by",
  has_calculator: "Calculator for",
  has_gallery: "Gallery for",
  has_timeline: "Timeline for",
  related_to: "Related to",
  parent_of: "Child of",
  child_of: "Parent of",
  belongs_to_constellation: "Constellation of",
  part_of_star_system: "System includes",
  binary_with: "Binary with",
  member_of_cluster: "Cluster includes",
  hosts_exoplanet: "Orbits",
  catalogued_in: "Catalogues",
};

/** Pick the readable label for a relation given the viewing direction. */
export function relationLabel(type: RelationType, outgoing: boolean): string {
  return outgoing ? RELATION_LABELS[type] : INVERSE_RELATION_LABELS[type];
}

/**
 * Connection facets — finer grouping than domain, so entity pages can show
 * Scientific / Observational / Mission / Discovery / Related groups (science)
 * plus Cultural and Astrology, never mixed.
 */
export type ConnectionFacet =
  | "scientific"
  | "observational"
  | "mission"
  | "discovery"
  | "related"
  | "cultural"
  | "astrology";

export const FACET_LABELS: Record<ConnectionFacet, string> = {
  scientific: "Scientific connections",
  observational: "Observational connections",
  mission: "Mission connections",
  discovery: "Discovery connections",
  related: "Related",
  cultural: "Cultural & mythological connections",
  astrology: "Astrology / symbolic connections",
};

/** Ordered facets for rendering. */
export const FACET_ORDER: ConnectionFacet[] = [
  "scientific",
  "observational",
  "mission",
  "discovery",
  "related",
  "cultural",
  "astrology",
];

/** Classify a relation into a connection facet. */
export function relationFacet(domain: Domain, type: RelationType): ConnectionFacet {
  if (domain === "astrology") return "astrology";
  if (domain === "culture") return "cultural";
  // science / editorial
  if (["observed_by", "studies", "visible_from"].includes(type)) return "observational";
  if (["mission_target", "operated_by", "launched_by"].includes(type)) return "mission";
  if (["discovered_by", "named_after", "catalogued_in"].includes(type)) return "discovery";
  if (["scientifically_related_to", "related_to", "references", "belongs_to_constellation", "part_of_star_system", "binary_with", "member_of_cluster", "hosts_exoplanet"].includes(type)) return "related";
  return "scientific";
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  science: "Scientific connections",
  culture: "Cultural & mythological connections",
  astrology: "Astrology / symbolic connections",
  editorial: "Editorial links",
};

/** Singular human-readable label per entity type. */
export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  star: "Star",
  planet: "Planet",
  dwarf_planet: "Dwarf planet",
  exoplanet: "Exoplanet",
  moon: "Moon",
  galaxy: "Galaxy",
  nebula: "Nebula",
  constellation: "Constellation",
  star_cluster: "Star cluster",
  black_hole: "Black hole",
  asteroid: "Asteroid",
  comet: "Comet",
  meteor_shower: "Meteor shower",
  eclipse: "Eclipse",
  catalog: "Catalog",
  space_mission: "Space mission",
  spacecraft: "Spacecraft",
  launch_vehicle: "Launch vehicle",
  satellite: "Satellite",
  space_telescope: "Space telescope",
  observatory: "Observatory",
  astronomer: "Astronomer",
  mythology_figure: "Mythological figure",
  mythology_story: "Mythological story",
  astrology_sign: "Zodiac sign",
  astrology_planet: "Astrological planet",
  astrology_house: "Astrological house",
  astrology_aspect: "Astrological aspect",
  calculator: "Calculator",
  glossary_term: "Glossary term",
  guide: "Guide",
  article: "Article",
  image_asset: "Image",
  observation_event: "Observation",
  location: "Location",
  organization: "Organization",
};
