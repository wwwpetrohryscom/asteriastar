import { cc, type CcRecord } from "@/knowledge-graph/data/exoplanet-science-catalog/types";

/**
 * The two major dedicated exoplanet missions missing from the graph, added as proper space_telescope
 * entities. Both are approved but not yet launched — stated as such. (Roman, HWO, JWST, Spitzer, Kepler,
 * TESS, ELT, GMT and TMT already exist and are reused via relatedKeys across this catalog, not
 * duplicated.)
 */
export const missions: CcRecord[] = [
  cc("mission", {
    slug: "ariel",
    name: "Ariel (exoplanet mission)",
    altNames: ["ARIEL", "Atmospheric Remote-sensing Infrared Exoplanet Large-survey"],
    description:
      "The European Space Agency's Ariel is the first mission dedicated to surveying the atmospheres of a large, diverse sample of known exoplanets — around a thousand — chiefly by transmission and emission spectroscopy at infrared wavelengths. Selected as ESA's fourth medium-class mission and planned for launch in 2029, it aims to link atmospheric composition to how and where planets form.",
    relatedKeys: ["exoplanet_science_concept:transmission-spectroscopy", "exoplanet_science_concept:emission-spectroscopy", "exoplanet_science_concept:atmospheric-metallicity"],
    highlights: ["ESA's dedicated survey of ~1000 exoplanet atmospheres — launch planned 2029"],
  }),
  cc("mission", {
    slug: "plato",
    name: "PLATO (exoplanet mission)",
    altNames: ["PLATO", "PLAnetary Transits and Oscillations of stars"],
    description:
      "PLATO is a European Space Agency mission that will hunt for terrestrial planets in the habitable zones of bright, Sun-like stars using an array of small telescopes to watch for transits, while asteroseismology of the host stars pins down their ages and sizes. Selected as ESA's third medium-class mission, it is planned for launch in 2026.",
    relatedKeys: ["exoplanet_detection_method:transit", "habitable_zone_candidate:habitable-zone", "astronomy_method:asteroseismology", "space_telescope:kepler-space-telescope", "space_telescope:tess"],
    highlights: ["ESA transit hunt for habitable-zone Earths around bright stars — launch planned 2026"],
  }),
];
