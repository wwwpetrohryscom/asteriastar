import { engine } from "@/platform/data-engine";
import type { MethodRecord } from "@/knowledge-graph/data/astronomy-methods-catalog/types";

type Ref = { id: string; name: string; href?: string };

/** Engine-driven discovery hubs for the Astronomy Methods, Measurements & Techniques Encyclopedia. */
export interface MethodDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => MethodRecord[];
  categorySlugs?: string[];
}

const e = engine.astronomyMethods;
const byName = (a: MethodRecord, b: MethodRecord) => a.name.localeCompare(b.name);
const union = (slugs: string[]) => slugs.flatMap((s) => e.byCategory(s)).sort(byName);

export const METHOD_DISCOVERIES: MethodDiscovery[] = [
  { slug: "categories", title: "Method Categories", description: "The families of technique — astrometry, photometry, spectroscopy, the distance ladder, exoplanet detection, time-domain, gravitation, and measurement.", get: () => e.categories() },
  { slug: "the-distance-ladder", title: "Measuring Distances", description: "How astronomers measure distances across the universe — parallax, proper motion, standard candles, Cepheids, and redshift.", get: () => union(["astrometry-and-motion", "the-cosmic-distance-ladder"]), categorySlugs: ["astrometry-and-motion", "the-cosmic-distance-ladder"] },
  { slug: "light-and-spectra", title: "Light & Spectra", description: "Reading light — photometry and the magnitude system, imaging and interferometry, and the spectroscopy that reveals composition and motion.", get: () => union(["photometry-and-imaging", "spectroscopy-and-classification"]), categorySlugs: ["photometry-and-imaging", "spectroscopy-and-classification"] },
  { slug: "finding-exoplanets", title: "Finding Exoplanets", description: "The techniques that find and weigh planets around other stars — transit, radial velocity, microlensing, and more.", get: () => e.byCategory("exoplanet-detection"), categorySlugs: ["exoplanet-detection"] },
  { slug: "beyond-light", title: "Beyond Light", description: "Astronomy in other channels — gravitational lensing and waves, neutrinos, multi-messenger events, and the seismology of stars.", get: () => union(["gravitation-and-multi-messenger", "time-domain-and-seismology"]), categorySlugs: ["gravitation-and-multi-messenger", "time-domain-and-seismology"] },
];

const BY_SLUG = new Map(METHOD_DISCOVERIES.map((d) => [d.slug, d]));
export function getMethodDiscovery(slug: string): MethodDiscovery | undefined {
  return BY_SLUG.get(slug);
}

/** The reused detection methods surfaced by a hub (deduped across its categories). */
export function reusedForMethodDiscovery(d: MethodDiscovery): Ref[] {
  const seen = new Set<string>();
  const out: Ref[] = [];
  for (const c of d.categorySlugs ?? []) {
    for (const ref of e.memberSet(c).reused) {
      if (!seen.has(ref.id)) { seen.add(ref.id); out.push(ref); }
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
