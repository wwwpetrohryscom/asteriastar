import { engine } from "@/platform/data-engine";
import type { CcRecord } from "@/knowledge-graph/data/exoplanet-science-catalog/types";

/** Engine-driven discovery hubs for the Exoplanet Science & Characterization Encyclopedia. */
export interface CcDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => CcRecord[];
}

const e = engine.exoplanetScience;

export const CC_DISCOVERIES: CcDiscovery[] = [
  { slug: "characterization-methods", title: "Characterization Methods", description: "How the atmospheres of other worlds are read — transmission and emission spectroscopy, the secondary eclipse, phase curves, atmospheric retrieval, high-resolution cross-correlation spectroscopy, and the Rossiter–McLaughlin effect.", get: () => e.characterization() },
  { slug: "exoplanet-atmospheres", title: "Exoplanet Atmospheres", description: "What atmospheres are made of and how they behave — clouds and hazes, thermal inversions, equilibrium temperature, and the atmospheric metallicity and carbon-to-oxygen ratio that fingerprint a planet's origin.", get: () => e.atmospheres() },
  { slug: "planet-formation", title: "Planet Formation", description: "How worlds are built — core accretion and disk instability, planetary migration, the snow line, and pebble accretion.", get: () => e.formation() },
  { slug: "exoplanet-missions", title: "Exoplanet Missions", description: "The two dedicated exoplanet observatories now being built — ESA's Ariel atmosphere survey and PLATO's hunt for habitable-zone Earths.", get: () => e.missions() },
];

const BY_SLUG = new Map(CC_DISCOVERIES.map((d) => [d.slug, d]));
export function getCcDiscovery(slug: string): CcDiscovery | undefined {
  return BY_SLUG.get(slug);
}
