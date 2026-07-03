import type { MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Recovery sites — strewn fields where multiple fragments of a single fall are found.
 * Each is connected by the meteorites recovered there (located_at). Individual
 * ground coordinates are described rather than modelled, a stated scope limit.
 */
type R = { slug: string; name: string; location?: string; country?: string; sources?: SourceKey[]; description: string };
const mk = (r: R): MeteoriteRecord => ({
  id: `recovery_site:${r.slug}`,
  slug: r.slug,
  name: r.name,
  kind: "recovery-site",
  description: r.description,
  sources: r.sources ?? ["nasa"],
  location: r.location,
  country: r.country,
});

export const sites: MeteoriteRecord[] = [
  mk({ slug: "sikhote-alin-field", name: "Sikhote-Alin Strewn Field", location: "Primorsky Krai", country: "Russia", sources: ["nasa"], description: "The strewn field left by the 1947 Sikhote-Alin iron meteorite fall, where thousands of fragments and impact pits were scattered across the taiga of the Russian Far East." }),
  mk({ slug: "campo-del-cielo-field", name: "Campo del Cielo Field", location: "Chaco / Santiago del Estero", country: "Argentina", sources: ["nasa"], description: "A field of craters and large iron masses in northern Argentina, formed by an ancient fall and known to local peoples for thousands of years — the source of some of the heaviest meteorite masses on Earth." }),
];
