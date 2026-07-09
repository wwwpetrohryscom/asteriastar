import { engine } from "@/platform/data-engine";
import type { CeRecord } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/types";

/** Engine-driven discovery hubs for the Deep Sky Objects Encyclopedia. */
export interface CeDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => CeRecord[];
}

const e = engine.deepSkyEncyclopedia;

export const CE_DISCOVERIES: CeDiscovery[] = [
  { slug: "object-classes", title: "Deep-Sky Object Classes", description: "The taxonomy of the deep sky — open and globular clusters and stellar associations, the emission, reflection, and dark nebulae, HII regions and Bok globules, planetary nebulae, and supernova remnants.", get: () => e.classes() },
  { slug: "featured-objects", title: "Featured Objects", description: "Iconic deep-sky objects added to the encyclopedia — the Horsehead and Cone nebulae.", get: () => e.objects() },
];

const BY_SLUG = new Map(CE_DISCOVERIES.map((d) => [d.slug, d]));
export function getCeDiscovery(slug: string): CeDiscovery | undefined {
  return BY_SLUG.get(slug);
}
