import { engine } from "@/platform/data-engine";
import type { CdRecord } from "@/knowledge-graph/data/sky-catalogs-catalog/types";

/** Engine-driven discovery hubs for the Astronomical Catalogs & Professional Sky Databases Encyclopedia. */
export interface CdDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => CdRecord[];
}

const e = engine.skyCatalogs;

export const CD_DISCOVERIES: CdDiscovery[] = [
  { slug: "professional-catalogues", title: "Professional Catalogues", description: "The catalogues that name the sky's objects — Caldwell, Barnard, Sharpless, Abell, PGC, UGC, Gliese, Tycho-2, SAO, GCVS, WDS, LHS, Wolf, and the Bonner Durchmusterung.", get: () => e.catalogs() },
  { slug: "catalog-families", title: "Catalog Families", description: "How the catalogues group by what they catalogue — deep-sky visual, the Dreyer general catalogues, nebulae, galaxies, astrometric star catalogues, nearby stars, and variable & double stars.", get: () => e.families() },
  { slug: "designation-systems", title: "Designation Systems", description: "The naming schemes that label the stars themselves — Bayer letters, Flamsteed numbers, and variable-star designations.", get: () => e.designations() },
];

const BY_SLUG = new Map(CD_DISCOVERIES.map((d) => [d.slug, d]));
export function getCdDiscovery(slug: string): CdDiscovery | undefined {
  return BY_SLUG.get(slug);
}
