import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Collisional asteroid families — clusters of fragments sharing similar orbits,
 * thought to originate from the break-up of a parent body. Each family here has at
 * least one modelled member (existing or new) that links to it via member_of_family;
 * the parent body is the family's largest member.
 */
type F = { slug: string; name: string; parentBody?: string; spectral?: string; sources?: SourceKey[]; description: string };
const mk = (f: F): MinorBodyRecord => ({
  id: `asteroid_family:${f.slug}`,
  slug: f.slug,
  name: f.name,
  kind: "family",
  description: f.description,
  sources: f.sources ?? ["nasa", "jpl"],
  parentBodySlug: f.parentBody,
  spectralType: f.spectral,
});

export const families: MinorBodyRecord[] = [
  mk({ slug: "vesta", name: "Vesta family (Vestoids)", parentBody: "vesta", spectral: "V", description: "Basaltic fragments blasted from the giant south-polar impact basin of 4 Vesta — the source of the HED meteorites found on Earth." }),
  mk({ slug: "hygiea", name: "Hygiea family", parentBody: "hygiea", spectral: "C", description: "A large family of dark, carbonaceous asteroids in the outer main belt, named for its largest member, 10 Hygiea." }),
  mk({ slug: "koronis", name: "Koronis family", parentBody: "ida", spectral: "S", description: "A family of stony asteroids in the outer main belt, one of whose members, 243 Ida, was imaged by the Galileo spacecraft." }),
  mk({ slug: "eunomia", name: "Eunomia family", parentBody: "eunomia", spectral: "S", description: "A prominent family of stony asteroids in the intermediate main belt, dominated by its largest member, 15 Eunomia." }),
  mk({ slug: "themis", name: "Themis family", parentBody: "themis", spectral: "C", description: "An old family of carbonaceous asteroids in the outer main belt, some of whose members show signs of water ice and cometary activity." }),
  mk({ slug: "eos", name: "Eos family", parentBody: "eos", spectral: "K", description: "A large family of K-type asteroids in the outer main belt, named for its parent body, 221 Eos." }),
  mk({ slug: "flora", name: "Flora family", parentBody: "flora", spectral: "S", description: "A very large, ancient family of stony asteroids in the inner main belt, a candidate source of some ordinary-chondrite meteorites." }),
];
