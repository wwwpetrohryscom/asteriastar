import { cc, type CcRecord } from "@/knowledge-graph/data/exoplanet-science-catalog/types";

/** Exoplanet-atmosphere concepts (exoplanet_science_concept), reusing existing atmospheric processes & classes. */
export const atmospheres: CcRecord[] = [
  cc("atmosphere", {
    slug: "clouds-and-hazes",
    name: "Clouds & Hazes",
    altNames: ["Aerosols"],
    description:
      "Condensate clouds and photochemically produced hazes are common in exoplanet atmospheres, and they matter for observers: high-altitude aerosols mute or flatten the features in a transmission spectrum, masking the gases below. Distinguishing a genuinely cloudy atmosphere from a clear one is a central challenge of characterization.",
    relatedKeys: ["exoplanet_science_concept:transmission-spectroscopy", "astrochemical_process:photochemistry", "planetary_class:hycean-planet"],
    highlights: ["Aerosols that flatten transmission spectra and hide the gases below"],
  }),
  cc("atmosphere", {
    slug: "thermal-inversion",
    name: "Thermal Inversion",
    altNames: ["Stratosphere"],
    description:
      "A layer in which temperature rises with altitude rather than falling, created when high-altitude absorbers soak up starlight — the exoplanet analogue of Earth's ozone stratosphere. On the hottest giant planets, absorbers such as titanium oxide or metals can drive inversions, which flip molecular features in an emission spectrum from absorption to emission.",
    relatedKeys: ["exoplanet_science_concept:emission-spectroscopy", "planetary_class:hot-jupiter", "planetary_class:lava-world"],
    highlights: ["Temperature rising with altitude — flips emission features"],
  }),
  cc("atmosphere", {
    slug: "equilibrium-temperature",
    name: "Equilibrium Temperature",
    description:
      "The temperature a planet would settle at if it simply balanced the starlight it absorbs against the heat it radiates, set by the star's output, the orbital distance, and the planet's reflectivity. It is a first estimate — real atmospheres shift it through greenhouse warming and heat redistribution — but it frames where a world sits relative to the habitable zone.",
    relatedKeys: ["scientific_calculator:equilibrium-temperature", "planetary_process:the-greenhouse-effect", "habitable_zone_candidate:habitable-zone"],
    highlights: ["The starlight-balance temperature before any atmosphere"],
  }),
  cc("atmosphere", {
    slug: "atmospheric-metallicity",
    name: "Atmospheric Metallicity & C/O Ratio",
    description:
      "The enrichment of an atmosphere in elements heavier than hydrogen and helium, and the ratio of carbon to oxygen within it. These quantities are more than bookkeeping: because different ices and gases condense at different distances in the disk, a planet's measured metallicity and C/O ratio carry a fingerprint of where and how it formed.",
    relatedKeys: ["exoplanet_science_concept:atmospheric-retrieval", "exoplanet_science_concept:snow-line", "stellar_physics_concept:stellar-metallicity"],
    highlights: ["A composition fingerprint of where a planet formed"],
  }),
];
