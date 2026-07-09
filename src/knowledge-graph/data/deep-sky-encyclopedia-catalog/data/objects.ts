import { ce, type CeRecord } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/types";

/**
 * The two genuinely-missing famous deep-sky objects, added as `nebula` entities (the object layer is
 * otherwise comprehensive and is reused, not duplicated). Both link to their DSO class, their catalogue,
 * their constellation, and the neighbouring objects already in the graph.
 */
export const objects: CeRecord[] = [
  ce("object", {
    slug: "horsehead-nebula",
    name: "The Horsehead Nebula",
    altNames: ["Barnard 33", "B33"],
    constellationLabel: "Orion",
    description:
      "One of the most recognisable dark nebulae in the sky — a column of cold, dusty gas in the Orion molecular cloud, about 1,500 light-years away, shaped by radiation into the silhouette of a horse's head. Catalogued as Barnard 33, it is seen against the soft red glow of the emission nebula IC 434 behind it, in the constellation Orion just south of the belt star Alnitak.",
    relatedKeys: ["astrophysical_object_class:dark-nebula", "catalog:barnard", "nebula:ic-434", "constellation:orion", "interstellar_environment:molecular-cloud"],
    highlights: ["A dark dust column shaped like a horse's head, against IC 434"],
  }),
  ce("object", {
    slug: "cone-nebula",
    name: "The Cone Nebula",
    altNames: ["part of NGC 2264"],
    constellationLabel: "Monoceros",
    description:
      "A tall pillar of cold molecular gas and dust, about seven light-years long, sculpted by the radiation and winds of hot young stars in the NGC 2264 star-forming region in Monoceros. The Cone lies at the southern end of the same complex as the Christmas Tree Cluster, roughly 2,700 light-years away, and is a textbook example of a star-forming pillar.",
    relatedKeys: ["astrophysical_object_class:dark-nebula", "astrophysical_object_class:hii-region", "nebula:ngc-2264", "constellation:monoceros", "interstellar_environment:star-forming-region"],
    highlights: ["A seven-light-year pillar of gas sculpted by young stars"],
  }),
];
