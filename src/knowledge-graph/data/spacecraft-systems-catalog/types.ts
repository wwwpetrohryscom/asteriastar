import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Spacecraft Systems & Engineering Encyclopedia data model (Program AG) — the engineering
 * layer of spacecraft: the subsystems and the components that make them up. Curated from
 * NASA, ESA, and engineering references. The docking systems, life-support systems (ECLSS),
 * antennas (Program AD), and attitude sensors (star trackers, IMUs — Program AD) are REUSED;
 * only the subsystem and component entities are created here. Nothing is fabricated.
 */

export type SysKind =
  | "subsystem" // a major spacecraft subsystem
  | "component"; // a component within a subsystem

export const KIND_ENTITY_TYPE: Record<SysKind, EntityType> = {
  subsystem: "spacecraft_subsystem",
  component: "spacecraft_component",
};

export const KIND_LABEL: Record<SysKind, string> = {
  subsystem: "Subsystem",
  component: "Component",
};

export type SysCategory =
  | "structure" | "thermal" | "power" | "propulsion" | "attitude" | "avionics"
  | "communications" | "edl" | "robotics" | "crew";

export interface SysRecord {
  id: string;
  slug: string;
  name: string;
  kind: SysKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];

  /* cross-references */
  subsystemSlug?: string; // → spacecraft_subsystem (part_of) — for components
  relatedKeys?: string[]; // full ids (associated_with) — reused antennas/nav/docking/life-support, or other components

  /* display */
  category?: SysCategory;
  role?: string;
  definition?: string;
  highlights?: string[];
}
