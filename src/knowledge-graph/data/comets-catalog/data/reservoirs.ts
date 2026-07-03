import type { CometRecord } from "@/knowledge-graph/data/comets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Small-body source reservoirs created by this program: the Oort cloud and inner Oort
 * cloud. The Kuiper Belt, scattered disc, and Centaurs — the reservoirs of the
 * short-period comets — are REUSED from Program Y's minor_planet_group entities (via
 * belongs_to_reservoir), never duplicated here.
 */
type R = { slug: string; name: string; region?: string; definition?: string; related?: string[]; partOf?: string; sources?: SourceKey[]; description: string };
const mk = (r: R): CometRecord => ({
  id: `small_body_reservoir:${r.slug}`,
  slug: r.slug,
  name: r.name,
  kind: "reservoir",
  description: r.description,
  sources: r.sources ?? ["nasa"],
  category: "reservoir",
  regionLabel: r.region,
  definition: r.definition,
  relatedKeys: r.related,
  // partOf carried via reservoirSlugs for the inner cloud → outer cloud link
  reservoirSlugs: r.partOf ? [r.partOf] : undefined,
});

export const reservoirs: CometRecord[] = [
  mk({ slug: "oort-cloud", name: "Oort Cloud", region: "≈ 2,000–100,000 AU", definition: "A vast spherical shell of icy bodies surrounding the Solar System, the source of the long-period comets.", sources: ["nasa"], description: "A hypothesised spherical cloud of trillions of icy bodies at the outermost edge of the Sun's gravitational influence — the reservoir from which long-period and Halley-type comets are nudged inward." }),
  mk({ slug: "inner-oort-cloud", name: "Inner Oort Cloud", region: "≈ 2,000–20,000 AU", definition: "The inner, more tightly bound region of the Oort cloud, populated by detached objects such as Sedna.", partOf: "oort-cloud", related: ["asteroid:sedna"], sources: ["nasa"], description: "The dense inner region of the Oort cloud, whose existence is inferred from detached objects like Sedna whose orbits are too distant to be shaped by Neptune." }),
];
