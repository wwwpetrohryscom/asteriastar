import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Space Manufacturing & In-Space Infrastructure Encyclopedia data model (Program AM) — the
 * future engineering layer: making and building things in space rather than launching them.
 * It REUSES the Moon, Mars, the metal asteroids, the commercial and inflatable space stations
 * (Gateway, Axiom, Genesis), and the solar-array/robotic-arm components already in the graph;
 * the new entities are the infrastructure domains, the in-situ resource-utilisation techniques,
 * the in-space manufacturing processes, and the infrastructure systems. Maturity is stated
 * honestly — from operational to purely theoretical — and nothing is fabricated.
 */

export type InfraKind =
  | "domain" // a domain of space infrastructure (the grouping)
  | "isru" // an in-situ resource-utilisation technique
  | "manufacturing" // an in-space manufacturing or construction process
  | "infrastructure"; // an infrastructure system or facility

export const KIND_ENTITY_TYPE: Record<InfraKind, EntityType> = {
  domain: "infrastructure_domain",
  isru: "isru_technique",
  manufacturing: "space_manufacturing_process",
  infrastructure: "space_infrastructure",
};

export const KIND_LABEL: Record<InfraKind, string> = {
  domain: "Domain",
  isru: "ISRU technique",
  manufacturing: "Manufacturing process",
  infrastructure: "Infrastructure",
};

/** Honest technology-maturity levels — never overstated. */
export type Maturity = "operational" | "demonstrated" | "in-development" | "planned" | "concept" | "theoretical";

export const MATURITY_LABEL: Record<Maturity, string> = {
  operational: "Operational",
  demonstrated: "Demonstrated",
  "in-development": "In development",
  planned: "Planned",
  concept: "Concept",
  theoretical: "Theoretical",
};

export type InfraCategory =
  | "domain"
  | "resource"
  | "manufacturing"
  | "construction"
  | "habitat"
  | "depot"
  | "power"
  | "logistics"
  | "megastructure";

export interface InfraRecord {
  id: string;
  slug: string;
  name: string;
  kind: InfraKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  domainSlug?: string; // → infrastructure_domain (member_of_group) — for non-domain kinds
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with)

  /* display */
  maturity?: Maturity;
  category?: InfraCategory;
  definition?: string;
  highlights?: string[];
}
