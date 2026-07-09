import { cd, type CdRecord } from "@/knowledge-graph/data/sky-catalogs-catalog/types";

/**
 * Catalog families — groupings that organise the professional catalogues by what they catalogue. Each
 * family links to both its NEW member catalogues and the EXISTING ones already in the graph (Messier,
 * NGC, IC, Henry Draper, Hipparcos, Gaia), reusing them rather than duplicating.
 */
export const families: CdRecord[] = [
  cd("family", {
    slug: "deep-sky-visual-catalogs",
    name: "Deep-Sky Visual Catalogues",
    description:
      "The catalogues of bright deep-sky showpieces made for the eye and the small telescope — Charles Messier's eighteenth-century list of 'objects to avoid' when comet-hunting, and Patrick Moore's later Caldwell Catalogue that gathers the bright objects Messier passed over.",
    relatedKeys: ["catalog:messier", "catalog:caldwell", "astronomer:charles-messier"],
    highlights: ["Messier and Caldwell — the showpieces of the deep sky"],
  }),
  cd("family", {
    slug: "dreyer-general-catalogs",
    name: "Dreyer's General Catalogues",
    description:
      "The New General Catalogue and its two Index Catalogue supplements, compiled by J. L. E. Dreyer from the visual discoveries of the Herschels and their successors. Together the NGC and IC number nearly 13,000 galaxies, clusters, and nebulae and remain the most widely used designations for deep-sky objects.",
    relatedKeys: ["catalog:ngc", "catalog:index-catalogue", "astronomer:william-herschel"],
    highlights: ["NGC + IC — the backbone of deep-sky designations"],
  }),
  cd("family", {
    slug: "nebula-catalogs",
    name: "Nebula Catalogues",
    description:
      "The specialist catalogues of interstellar clouds — Sharpless's HII regions glowing around young stars, Barnard's dark dust clouds silhouetted against the Milky Way, and Abell's large, faint planetary nebulae. Together they map the gas and dust between the stars.",
    relatedKeys: ["catalog:sharpless", "catalog:barnard", "catalog:abell"],
    highlights: ["Emission, dark, and planetary nebulae — the interstellar medium catalogued"],
  }),
  cd("family", {
    slug: "galaxy-catalogs",
    name: "Galaxy Catalogues",
    description:
      "The great reference catalogues of galaxies — the Uppsala General Catalogue's size-selected northern galaxies and the Principal Galaxies Catalogue that underpins the HyperLEDA database, providing standard identifiers for galaxies far beyond those with common names.",
    relatedKeys: ["catalog:ugc-catalogue", "catalog:pgc-catalogue", "data_archive:ned"],
    highlights: ["UGC and PGC — standard identifiers for galaxies"],
  }),
  cd("family", {
    slug: "astrometric-star-catalogs",
    name: "Astrometric Star Catalogues",
    description:
      "The positional catalogues that pin down where the stars are — from Argelander's pre-photographic Bonner Durchmusterung and the Smithsonian's SAO catalogue to the space-based precision of Hipparcos, Tycho-2, and Gaia.",
    relatedKeys: ["catalog:hipparcos-catalogue", "catalog:gaia-catalogue", "catalog:tycho-catalogue", "catalog:sao-catalogue", "catalog:bonner-durchmusterung", "space_telescope:gaia"],
    highlights: ["From the Durchmusterung to Gaia — where the stars are"],
  }),
  cd("family", {
    slug: "nearby-star-catalogs",
    name: "Nearby-Star Catalogues",
    description:
      "The catalogues that map the Sun's immediate neighbourhood — Gliese's census of stars within about 25 parsecs, and the high-proper-motion catalogues of Luyten (LHS) and Max Wolf, whose fast-moving stars are usually the closest ones.",
    relatedKeys: ["catalog:gliese-catalogue", "catalog:lhs-catalogue", "catalog:wolf-catalogue"],
    highlights: ["Gliese, LHS, and Wolf — the solar neighbourhood"],
  }),
  cd("family", {
    slug: "variable-and-double-star-catalogs",
    name: "Variable & Double Star Catalogues",
    description:
      "The catalogues of stars that change and stars that come in pairs — the General Catalogue of Variable Stars, which names and classifies variables, and the Washington Double Star Catalog, the master reference for binary and multiple systems.",
    relatedKeys: ["catalog:gcvs", "catalog:wds", "designation_system:variable-star-designation"],
    highlights: ["GCVS and WDS — variable and multiple stars"],
  }),
];
