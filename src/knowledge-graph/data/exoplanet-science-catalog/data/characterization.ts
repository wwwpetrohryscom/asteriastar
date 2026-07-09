import { cc, type CcRecord } from "@/knowledge-graph/data/exoplanet-science-catalog/types";

/** Atmospheric-characterization methods (exoplanet_science_concept), reusing the detection methods & spectroscopy. */
export const characterization: CcRecord[] = [
  cc("characterization", {
    slug: "transmission-spectroscopy",
    name: "Transmission Spectroscopy",
    description:
      "The workhorse of exoplanet atmospheres: as a planet transits its star, a sliver of starlight filters through the ring of atmosphere at its edge, and the gases there imprint absorption features that vary with wavelength. Comparing the planet's apparent size across a spectrum reveals which molecules — water, carbon dioxide, methane — are present. JWST has made this a routine, high-precision technique.",
    relatedKeys: ["exoplanet_detection_method:transit", "astronomy_method:spectroscopy", "space_telescope:james-webb-space-telescope", "exoplanet_science_concept:atmospheric-retrieval"],
    highlights: ["Reads an atmosphere from starlight filtered through it during transit"],
  }),
  cc("characterization", {
    slug: "emission-spectroscopy",
    name: "Emission Spectroscopy",
    description:
      "Measuring the light a planet itself emits — usually its thermal glow — to probe the temperature structure and composition of its dayside. Because the planet's emission is measured against the star, it is easiest for hot planets, and it reveals whether temperature rises or falls with altitude in ways transmission spectra cannot.",
    relatedKeys: ["exoplanet_science_concept:secondary-eclipse", "astronomy_method:spectroscopy", "space_telescope:james-webb-space-telescope", "exoplanet_science_concept:thermal-inversion"],
    highlights: ["Probes a planet's dayside from the light it emits"],
  }),
  cc("characterization", {
    slug: "secondary-eclipse",
    name: "The Secondary Eclipse",
    altNames: ["Occultation"],
    description:
      "The moment a planet passes behind its star. The dip in the system's combined light equals the light the planet was contributing, so subtracting the two isolates the planet's thermal emission and reflected light — the basis of emission spectroscopy and dayside temperature measurements.",
    relatedKeys: ["exoplanet_detection_method:transit", "exoplanet_science_concept:emission-spectroscopy", "exoplanet_science_concept:phase-curve"],
    highlights: ["Planet hides behind its star, isolating its own light"],
  }),
  cc("characterization", {
    slug: "phase-curve",
    name: "Phase Curves",
    description:
      "Tracking a planet's brightness through its whole orbit as its illuminated fraction changes, like the phases of the Moon. The shape of the curve reveals the temperature difference between day and night sides and how efficiently winds carry heat around the planet — a direct window onto atmospheric circulation.",
    relatedKeys: ["planetary_process:atmospheric-circulation", "space_telescope:spitzer-space-telescope", "space_telescope:james-webb-space-telescope", "planetary_class:hot-jupiter"],
    highlights: ["Day–night temperatures and winds from orbital brightness"],
  }),
  cc("characterization", {
    slug: "atmospheric-retrieval",
    name: "Atmospheric Retrieval",
    description:
      "The statistical machinery that turns a spectrum into numbers: models of an atmosphere are compared against the data, usually with Bayesian inference, to find the mix of gases, temperatures, and clouds that best explains it — along with honest uncertainties. Retrieval is how a wiggly spectrum becomes a measured abundance.",
    relatedKeys: ["exoplanet_science_concept:transmission-spectroscopy", "exoplanet_science_concept:emission-spectroscopy", "exoplanet_science_concept:atmospheric-metallicity", "space_telescope:nancy-grace-roman", "mission_concept:habitable-worlds-observatory"],
    highlights: ["Bayesian inference from spectrum to composition, with error bars"],
  }),
  cc("characterization", {
    slug: "high-resolution-cross-correlation-spectroscopy",
    name: "High-Resolution Cross-Correlation Spectroscopy",
    altNames: ["HRCCS"],
    description:
      "A ground-based technique that resolves thousands of individual spectral lines and uses the planet's changing Doppler shift along its orbit to separate its light from the star's and the Earth's atmosphere. Cross-correlating against molecular templates detects specific gases and even measures atmospheric winds; it is a headline science case for the coming extremely large telescopes.",
    relatedKeys: ["exoplanet_detection_method:radial-velocity", "astronomy_method:spectroscopy", "telescope:extremely-large-telescope", "telescope:giant-magellan-telescope", "telescope:thirty-meter-telescope"],
    highlights: ["Doppler-tracks molecular lines to isolate the planet's light"],
  }),
  cc("characterization", {
    slug: "rossiter-mclaughlin-effect",
    name: "The Rossiter–McLaughlin Effect",
    description:
      "A spectroscopic signature seen during transit: as the planet crosses the face of its rotating star, it blocks first the approaching then the receding limb, distorting the star's measured velocity. The shape of that distortion reveals whether the planet's orbit is aligned with the star's spin — a key clue to how the system formed and migrated.",
    relatedKeys: ["exoplanet_detection_method:transit", "exoplanet_detection_method:radial-velocity", "exoplanet_science_concept:planetary-migration"],
    highlights: ["Reveals whether an orbit is aligned with its star's spin"],
  }),
];
