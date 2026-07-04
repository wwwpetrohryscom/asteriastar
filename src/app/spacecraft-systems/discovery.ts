import { engine } from "@/platform/data-engine";
import type { SysRecord } from "@/knowledge-graph/data/spacecraft-systems-catalog/types";

/** Engine-driven discovery hubs for the Spacecraft Systems & Engineering Encyclopedia. */
export interface SysDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => SysRecord[];
}

const e = engine.spacecraftSystems;

export const SYS_DISCOVERIES: SysDiscovery[] = [
  { slug: "subsystems", title: "Subsystems", description: "The major subsystems of a spacecraft — structure, power, propulsion, thermal control, attitude control, avionics, and more.", get: () => e.subsystems() },
  { slug: "power", title: "Power", description: "How spacecraft make and store electricity — solar arrays, batteries, RTGs, and fuel cells.", get: () => e.byCategory("power") },
  { slug: "propulsion", title: "Propulsion", description: "How spacecraft change their velocity — chemical, ion, Hall-effect, cold-gas, and nuclear propulsion.", get: () => e.byCategory("propulsion") },
  { slug: "attitude-control", title: "Attitude Control", description: "How spacecraft point themselves — reaction wheels, control moment gyros, star trackers, and gyroscopes.", get: () => e.byCategory("attitude") },
  { slug: "avionics", title: "Avionics & Software", description: "The onboard computing — flight computers, radiation-hardened memory, flight software, and fault management.", get: () => e.byCategory("avionics") },
  { slug: "entry-landing", title: "Entry, Descent & Landing", description: "How spacecraft survive entry and touch down — heat shields, parachutes, and landing systems.", get: () => e.byCategory("edl") },
];

const BY_SLUG = new Map(SYS_DISCOVERIES.map((d) => [d.slug, d]));
export function getSysDiscovery(slug: string): SysDiscovery | undefined {
  return BY_SLUG.get(slug);
}
