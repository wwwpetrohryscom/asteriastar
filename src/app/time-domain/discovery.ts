import { engine } from "@/platform/data-engine";
import type { TimeDomainRecord } from "@/knowledge-graph/data/time-domain-catalog/types";

/** Engine-driven discovery hubs for the Multi-Wavelength & Time-Domain Astronomy Atlas. */
export interface TDDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => TimeDomainRecord[];
}

const e = engine.timeDomain;
const byName = (a: TimeDomainRecord, b: TimeDomainRecord) => a.name.localeCompare(b.name);

export const TD_DISCOVERIES: TDDiscovery[] = [
  { slug: "explosive-transients", title: "Explosive Transients", description: "The supernovae and novae — the thermonuclear and core-collapse explosions of stars.", get: () => e.byCategory("explosive") },
  { slug: "relativistic-and-mergers", title: "Relativistic Events & Mergers", description: "Gamma-ray bursts, magnetar flares, kilonovae, and the compact-object mergers that ring the gravitational-wave sky.", get: () => ["relativistic", "merger"].flatMap((c) => e.byCategory(c as never)).sort(byName) },
  { slug: "tidal-radio-and-variable", title: "Tidal, Radio & Variable", description: "Tidal disruption events, fast radio bursts, and the variable and cataclysmic transients.", get: () => ["tidal", "radio", "variable"].flatMap((c) => e.byCategory(c as never)).sort(byName) },
  { slug: "alert-infrastructure", title: "Alert Infrastructure", description: "How the discovery of a transient is broadcast — GCN, VOEvent, the Transient Name Server, ATel, and the Rubin alert stream.", get: () => e.alerts() },
  { slug: "observation-workflow", title: "The Observation Workflow", description: "From discovery to publication — how a transient is found, followed up, confirmed, classified, and shared.", get: () => e.stages() },
];

const BY_SLUG = new Map(TD_DISCOVERIES.map((d) => [d.slug, d]));
export function getTDDiscovery(slug: string): TDDiscovery | undefined {
  return BY_SLUG.get(slug);
}
