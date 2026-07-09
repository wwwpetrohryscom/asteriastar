import { cd, type CdRecord } from "@/knowledge-graph/data/sky-catalogs-catalog/types";

/**
 * Stellar designation systems — the naming schemes by which stars are labelled, as opposed to the
 * catalogues that list them. These were previously carried only as fields; CD promotes the three most
 * important schemes to first-class entities and links them to the catalogues that record the same stars.
 */
export const designations: CdRecord[] = [
  cd("designation", {
    slug: "bayer-designation",
    name: "Bayer Designation",
    abbrev: "α",
    epochLabel: "1603",
    altNames: ["Bayer letters"],
    description:
      "The system introduced by Johann Bayer in his 1603 atlas Uranometria, labelling the bright stars of each constellation with a Greek letter followed by the Latin genitive of the constellation's name — so α Orionis is Betelgeuse, even though Rigel (β Orionis) is usually the brighter of the two, a reminder that the ordering is only approximate. Roughly in order of brightness, Bayer letters remain the most familiar designations for naked-eye stars.",
    relatedKeys: ["designation_system:flamsteed-designation", "catalog:henry-draper-catalogue"],
    highlights: ["Greek letter + constellation — e.g. α Orionis"],
  }),
  cd("designation", {
    slug: "flamsteed-designation",
    name: "Flamsteed Designation",
    abbrev: "61",
    epochLabel: "1725",
    altNames: ["Flamsteed numbers"],
    description:
      "A numbering scheme drawn from John Flamsteed's star catalogue, published posthumously in 1725, that labels the stars of each constellation with a number in order of increasing right ascension — so 61 Cygni is the sixty-first Flamsteed star of Cygnus. Flamsteed numbers name many stars that have no Bayer letter.",
    relatedKeys: ["designation_system:bayer-designation", "catalog:hipparcos-catalogue"],
    highlights: ["Number + constellation, by right ascension — e.g. 61 Cygni"],
  }),
  cd("designation", {
    slug: "variable-star-designation",
    name: "Variable-Star Designation",
    abbrev: "R",
    altNames: ["Variable-star naming"],
    description:
      "The scheme for naming variable stars, formalised in the General Catalogue of Variable Stars. Within each constellation the first variables take the letters R through Z, then two-letter combinations RR through ZZ and AA through QZ, and thereafter V335, V336, and so on — a system that grew from a handful of early discoveries into a labelling scheme for tens of thousands of variables.",
    relatedKeys: ["catalog:gcvs", "designation_system:bayer-designation"],
    highlights: ["R, S, T… then RR… then V335 onward, per constellation"],
  }),
];
