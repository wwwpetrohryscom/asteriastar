import { engine } from "@/platform/data-engine";
import type { OpsRecord } from "@/knowledge-graph/data/mission-operations-catalog/types";

/** Engine-driven discovery hubs for the Ground Segment & Mission Operations Encyclopedia. */
export interface OpsDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => OpsRecord[];
}

const e = engine.missionOperations;

export const OPS_DISCOVERIES: OpsDiscovery[] = [
  { slug: "operations-centers", title: "Operations Centres", description: "The mission-control and operations centres that fly spacecraft — JPL's SFOF, ESA's ESOC, Houston's Mission Control, and their counterparts worldwide.", get: () => e.centers() },
  { slug: "control", title: "Command & Control", description: "The real-time functions of mission control — commanding, telemetry, command sequencing, and automation.", get: () => e.byCategory("control") },
  { slug: "flight-dynamics", title: "Flight Dynamics & Navigation", description: "Determining and controlling where a spacecraft is and where it is going — orbit determination and navigation operations.", get: () => e.byCategory("dynamics") },
  { slug: "spacecraft-health", title: "Spacecraft Health & Safety", description: "Keeping spacecraft alive — health monitoring, fault protection, and safe mode.", get: () => e.byCategory("health") },
  { slug: "mission-lifecycle", title: "Mission Lifecycle", description: "The operational phases of a mission — launch, cruise, science, and end-of-mission operations.", get: () => e.byCategory("lifecycle") },
];

const BY_SLUG = new Map(OPS_DISCOVERIES.map((d) => [d.slug, d]));
export function getOpsDiscovery(slug: string): OpsDiscovery | undefined {
  return BY_SLUG.get(slug);
}
