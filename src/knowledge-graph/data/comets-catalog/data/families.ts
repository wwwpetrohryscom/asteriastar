import type { CometRecord } from "@/knowledge-graph/data/comets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Genetic comet families — groups of comets sharing a common origin, typically the
 * fragments of a single progenitor. Distinct from the dynamical classes: a family is
 * about ancestry, a class about present-day orbit. Each family has ≥1 modelled member
 * linking via member_of_family.
 */
type F = { slug: string; name: string; sources?: SourceKey[]; description: string };
const mk = (f: F): CometRecord => ({
  id: `comet_family:${f.slug}`,
  slug: f.slug,
  name: f.name,
  kind: "family",
  description: f.description,
  sources: f.sources ?? ["nasa", "jpl"],
});

export const families: CometRecord[] = [
  mk({ slug: "kreutz-sungrazers", name: "Kreutz Sungrazers", sources: ["nasa"], description: "A family of sungrazing comets on very similar orbits, thought to be the fragments of a single giant comet that broke apart many centuries ago. They include some of the brightest comets in history and are discovered in large numbers by solar spacecraft." }),
];
