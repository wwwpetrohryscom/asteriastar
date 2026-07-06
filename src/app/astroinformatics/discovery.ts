import { engine } from "@/platform/data-engine";
import type { AstroinformaticsRecord } from "@/knowledge-graph/data/astroinformatics-catalog/types";

/** Engine-driven discovery hubs for the Astroinformatics & Virtual Research Ecosystem Encyclopedia. */
export interface BhDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => AstroinformaticsRecord[];
}

const e = engine.astroinformatics;

export const BH_DISCOVERIES: BhDiscovery[] = [
  { slug: "research-software", title: "Research Software", description: "The open-source tools astronomers compute with — the scientific Python ecosystem, Astropy and SunPy, Jupyter notebooks, Astroquery, scientific visualisation, and the discipline of research software engineering.", get: () => e.software() },
  { slug: "research-computing", title: "Research Computing", description: "The machines and platforms that do the heavy lifting — high-performance and GPU computing, cloud and distributed computing, the science platforms that bring analysis to the data, and containerised reproducible environments.", get: () => e.computing() },
  { slug: "astroinformatics-concepts", title: "Data-Intensive Astronomy", description: "The ideas that organise data-intensive astronomy — scientific workflows, data provenance, the astronomical query languages, big-data astronomy in the petabyte era, and the integrated virtual research environment.", get: () => e.concepts() },
];

const BY_SLUG = new Map(BH_DISCOVERIES.map((d) => [d.slug, d]));
export function getBhDiscovery(slug: string): BhDiscovery | undefined {
  return BY_SLUG.get(slug);
}
