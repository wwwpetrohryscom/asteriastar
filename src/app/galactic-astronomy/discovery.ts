import { engine } from "@/platform/data-engine";
import type { GalacticRecord } from "@/knowledge-graph/data/galactic-astronomy-catalog/types";

/** Engine-driven discovery hubs for the Galactic Astronomy & the Milky Way Encyclopedia. */
export interface BgDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => GalacticRecord[];
}

const e = engine.galacticAstronomy;

export const BG_DISCOVERIES: BgDiscovery[] = [
  { slug: "galactic-structure", title: "The Anatomy of the Galaxy", description: "The structural components of the Milky Way — the thin and thick discs, the bulge and bar, the stellar halo, the spiral arms, the warp, the Galactic Centre and its central molecular zone, the hot corona, and the Sun's own neighbourhood.", get: () => e.structure() },
  { slug: "galactic-dynamics", title: "Dynamics, Archaeology & Fate", description: "How the Galaxy turns, remembers, and grows — its rotation and dark matter, the stellar streams and radial migration that stir the disc, galactic archaeology with Gaia, the magnetic field, its satellites and accretion, and the coming collision with Andromeda.", get: () => e.dynamics() },
];

const BY_SLUG = new Map(BG_DISCOVERIES.map((d) => [d.slug, d]));
export function getBgDiscovery(slug: string): BgDiscovery | undefined {
  return BY_SLUG.get(slug);
}
