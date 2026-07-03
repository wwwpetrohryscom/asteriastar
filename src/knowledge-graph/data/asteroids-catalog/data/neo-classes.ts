import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Near-Earth object (NEO) orbital classes — the dynamical categories of asteroids
 * whose orbits bring them close to Earth's, defined by objective perihelion/aphelion
 * and semi-major-axis criteria (NASA/JPL CNEOS). Each class is named after its
 * prototype asteroid and has at least one modelled member.
 */
type N = { slug: string; name: string; definition: string; sources?: SourceKey[]; description: string };
const mk = (n: N): MinorBodyRecord => ({
  id: `near_earth_object:${n.slug}`,
  slug: n.slug,
  name: n.name,
  kind: "neo-class",
  description: n.description,
  sources: n.sources ?? ["nasa", "jpl"],
  category: "near-earth",
  definition: n.definition,
});

export const neoClasses: MinorBodyRecord[] = [
  mk({ slug: "apollo", name: "Apollo asteroids", definition: "Earth-crossing NEOs with a semi-major axis larger than Earth's (a > 1 AU) and perihelion inside Earth's aphelion (q < 1.017 AU).", description: "The largest class of near-Earth asteroids — Earth-crossers with orbits mostly larger than Earth's, named after 1862 Apollo." }),
  mk({ slug: "aten", name: "Aten asteroids", definition: "Earth-crossing NEOs with a semi-major axis smaller than Earth's (a < 1 AU) and aphelion beyond Earth's perihelion (Q > 0.983 AU).", description: "Near-Earth asteroids with orbits mostly inside Earth's but reaching out to cross it, named after 2062 Aten." }),
  mk({ slug: "amor", name: "Amor asteroids", definition: "NEOs that approach Earth's orbit from outside but do not cross it (1.017 AU < q < 1.3 AU).", description: "Near-Earth asteroids that approach Earth's orbit from the outside without crossing it, often crossing the orbit of Mars — named after 1221 Amor." }),
  mk({ slug: "atira", name: "Atira asteroids", definition: "NEOs whose orbits lie entirely inside Earth's orbit (aphelion Q < 0.983 AU).", description: "The rarest near-Earth class, with orbits contained entirely within Earth's — hard to detect because they never appear far from the Sun. Named after 163693 Atira." }),
];
