import { engine } from "@/platform/data-engine";
import type { ChemistryRecord } from "@/knowledge-graph/data/astrochemistry-catalog/types";

/** Engine-driven discovery hubs for the Astrochemistry & Molecular Universe Encyclopedia. */
export interface BbDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => ChemistryRecord[];
}

const e = engine.astrochemistry;

export const BB_DISCOVERIES: BbDiscovery[] = [
  { slug: "interstellar-environments", title: "Interstellar Environments", description: "Where cosmic chemistry happens — the diffuse medium, molecular clouds, star-forming regions, protoplanetary disks, and the dust between the stars.", get: () => e.environments() },
  { slug: "molecules", title: "The Molecules of Space", description: "The chemical inventory of the cosmos — water, carbon monoxide, ammonia, methanol, PAHs, and the precursors of life.", get: () => e.molecules() },
  { slug: "processes", title: "Astrochemical Processes", description: "How molecules are built and destroyed — gas-phase and grain-surface chemistry, photochemistry, shocks, and the chemistry of planets and life.", get: () => e.processes() },
];

const BY_SLUG = new Map(BB_DISCOVERIES.map((d) => [d.slug, d]));
export function getBbDiscovery(slug: string): BbDiscovery | undefined {
  return BY_SLUG.get(slug);
}
