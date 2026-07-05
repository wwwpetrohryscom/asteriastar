import { engine } from "@/platform/data-engine";
import type { AstrobiologyRecord } from "@/knowledge-graph/data/astrobiology-catalog/types";

/** Engine-driven discovery hubs for the Astrobiology, Biosignatures & Search for Life Encyclopedia. */
export interface AbDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => AstrobiologyRecord[];
}

const e = engine.astrobiology;

export const AB_DISCOVERIES: AbDiscovery[] = [
  { slug: "disciplines", title: "Disciplines", description: "The fields of astrobiology — origins of life, planetary habitability, biosignatures, technosignatures, ocean worlds, and planetary protection.", get: () => e.topics() },
  { slug: "biosignatures", title: "Biosignatures", description: "The potential signs of life — atmospheric, surface, chemical, and geological — and the false positives that must be ruled out.", get: () => e.biosignatures() },
  { slug: "habitability", title: "Habitability Factors", description: "What a world needs to host life — liquid water, energy, chemical building blocks, and the extremophiles that widen the possibilities.", get: () => e.factors() },
  { slug: "planetary-protection", title: "Planetary Protection", description: "Preventing contamination in both directions — protecting other worlds from Earth life, and Earth from returned samples.", get: () => e.protection() },
];

const BY_SLUG = new Map(AB_DISCOVERIES.map((d) => [d.slug, d]));
export function getAbDiscovery(slug: string): AbDiscovery | undefined {
  return BY_SLUG.get(slug);
}
