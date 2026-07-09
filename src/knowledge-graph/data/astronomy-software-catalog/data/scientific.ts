import { ch, type ChRecord } from "@/knowledge-graph/data/astronomy-software-catalog/types";

/**
 * Professional scientific tools and programming libraries, added as `research_software` (the existing
 * type, beside the already-present Astropy/Astroquery/SunPy). SPICE and JPL Horizons remain
 * `ephemeris_system` entities and are reused via relatedKeys, not duplicated.
 */
export const scientific: ChRecord[] = [
  ch("scientific", {
    slug: "iraf",
    name: "IRAF",
    altNames: ["Image Reduction and Analysis Facility"],
    platforms: ["Linux", "macOS"],
    licenseLabel: "Open source",
    description:
      "The Image Reduction and Analysis Facility, a classic suite for the reduction and analysis of astronomical images and spectra developed at the US national optical observatory. Once ubiquitous in professional astronomy, it is no longer actively developed by the observatory but is maintained by the community, and much of its role has passed to the Python ecosystem.",
    relatedKeys: ["data_standard:fits", "research_software:astropy"],
    highlights: ["The classic image- and spectrum-reduction suite"],
  }),
  ch("scientific", {
    slug: "casa",
    name: "CASA",
    altNames: ["Common Astronomy Software Applications"],
    platforms: ["Linux", "macOS"],
    licenseLabel: "Open source",
    description:
      "The Common Astronomy Software Applications package, the primary tool for calibrating and imaging data from radio interferometers, developed for ALMA and the Very Large Array. CASA turns the raw visibilities of an interferometer into scientific images and cubes.",
    relatedKeys: ["observatory:alma", "observatory:very-large-array", "interferometry_technique:radio-interferometry", "data_standard:fits"],
    highlights: ["Calibrating and imaging radio-interferometer data (ALMA, VLA)"],
  }),
  ch("scientific", {
    slug: "topcat",
    name: "TOPCAT",
    altNames: ["Tool for OPerations on Catalogues And Tables"],
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "An interactive desktop tool for viewing, cross-matching, plotting, and manipulating large astronomical tables and catalogues, with deep support for Virtual Observatory table formats and services. TOPCAT is a workhorse for exploring catalogue data from surveys and archives.",
    relatedKeys: ["data_standard:votable", "vo_framework:the-virtual-observatory", "data_archive:vizier", "research_software:astroquery"],
    highlights: ["Interactive exploration and cross-matching of big tables"],
  }),
  ch("scientific", {
    slug: "ds9",
    name: "SAOImage DS9",
    altNames: ["DS9"],
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "A widely used astronomical imaging and data-visualisation application for displaying FITS images, with support for multiple frames, colour scales, region analysis, and coordinate overlays. DS9 is a standard viewer for inspecting professional image data.",
    relatedKeys: ["data_standard:fits", "data_archive:mast"],
    highlights: ["The standard FITS image viewer and analyser"],
  }),
  ch("scientific", {
    slug: "aladin",
    name: "Aladin",
    altNames: ["Aladin Sky Atlas"],
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "An interactive sky-atlas application from the Strasbourg astronomical data centre that lets the user overlay images, surveys, and catalogues on the same patch of sky and query Virtual Observatory services directly. Aladin is a central tool for cross-identifying objects across archives.",
    relatedKeys: ["data_archive:cds", "vo_framework:the-virtual-observatory", "data_archive:simbad", "catalog:messier"],
    highlights: ["Overlaying images and catalogues across the sky"],
  }),
  ch("scientific", {
    slug: "astroimagej",
    name: "AstroImageJ",
    altNames: ["AIJ"],
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "An astronomy-focused build of the ImageJ image-analysis program, adding precise astronomical image display, calibration, and differential photometry. AstroImageJ is especially popular for measuring exoplanet transit light curves from amateur and small-professional telescopes.",
    relatedKeys: ["observing_technique:image-processing", "astronomy_method:photometry", "exoplanet_detection_method:transit"],
    highlights: ["Differential photometry and exoplanet transit light curves"],
  }),
  ch("scientific", {
    slug: "montage",
    name: "Montage",
    platforms: ["Linux", "macOS"],
    licenseLabel: "Open source",
    description:
      "A toolkit for assembling astronomical images into custom mosaics, reprojecting many overlapping FITS images onto a common grid and matching their backgrounds to make a seamless whole. Montage is used to build large image mosaics from survey data while preserving flux.",
    relatedKeys: ["data_standard:fits", "research_software:astropy"],
    highlights: ["Stitching survey images into seamless mosaics"],
  }),
  ch("library", {
    slug: "skyfield",
    name: "Skyfield",
    platforms: ["Cross-platform (Python)"],
    licenseLabel: "Open source",
    description:
      "A Python library for computing precise positions of stars, planets, and satellites as seen from any point on the Earth or in space, using the same JPL ephemerides and reference frames as professional astronomy. Skyfield is a popular modern tool for accurate, easy positional astronomy.",
    relatedKeys: ["ephemeris_system:jpl-development-ephemeris", "ephemeris_system:jpl-horizons", "research_software:astropy"],
    highlights: ["Precise positions of Solar-System and celestial bodies in Python"],
  }),
  ch("library", {
    slug: "poliastro",
    name: "poliastro",
    platforms: ["Cross-platform (Python)"],
    licenseLabel: "Open source",
    description:
      "A Python library for interactive astrodynamics and orbital mechanics — defining orbits, propagating them, and planning maneuvers — built on Astropy's units and time handling. Its active development is now archived, with the work continuing in a successor library, but it remains a well-known tool for orbit computations.",
    relatedKeys: ["research_software:astropy", "orbital_mechanics_concept:orbital-elements", "ephemeris_system:spice-toolkit"],
    highlights: ["Interactive orbit definition and propagation in Python"],
  }),
  ch("library", {
    slug: "orekit",
    name: "Orekit",
    platforms: ["Cross-platform (Java)"],
    licenseLabel: "Open source",
    description:
      "A mature, low-level space-flight-dynamics library in Java (with Python bindings) providing high-precision orbit propagation, attitude modelling, time and frame transformations, and maneuver planning. Orekit is used in professional mission analysis and operations for its accuracy and breadth.",
    relatedKeys: ["ephemeris_system:spice-toolkit", "space_engineering_concept:station-keeping", "orbital_mechanics_concept:orbital-elements"],
    highlights: ["Professional-grade flight dynamics and orbit propagation"],
  }),
];
