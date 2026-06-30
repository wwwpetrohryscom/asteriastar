import type { ObsRecord } from "@/knowledge-graph/data/observatory-catalog/types";

/**
 * Astronomical instruments, each hosted by a telescope or space telescope.
 * The four existing JWST/Hubble instruments are enriched with observing bands.
 */
type I = { slug: string; name: string; existing?: boolean; alt?: string[]; host: string; type: string; bands: string[]; description: string; sources?: ObsRecord["sources"] };
const mk = (i: I): ObsRecord => ({
  id: `scientific_instrument:${i.slug}`, slug: i.slug, name: i.name, kind: "instrument", existing: i.existing, altNames: i.alt,
  hostSlug: i.host, observatoryType: i.type, bandSlugs: i.bands, description: i.description, sources: i.sources ?? ["nasa"],
});

export const instruments: ObsRecord[] = [
  // ----------------------------------------------------------------- existing (enriched with bands)
  mk({ slug: "nircam", name: "NIRCam", existing: true, host: "james-webb-space-telescope", type: "Near-infrared camera", bands: ["near-infrared"], description: "NIRCam is the primary near-infrared imager of the James Webb Space Telescope and its wavefront-sensing instrument." }),
  mk({ slug: "miri", name: "MIRI", existing: true, host: "james-webb-space-telescope", type: "Mid-infrared instrument", bands: ["infrared"], description: "MIRI, the Mid-Infrared Instrument on JWST, images and takes spectra of cool, dusty, and very distant objects.", sources: ["nasa", "esa"] }),
  mk({ slug: "nirspec", name: "NIRSpec", existing: true, host: "james-webb-space-telescope", type: "Near-infrared spectrograph", bands: ["near-infrared"], description: "NIRSpec is JWST's near-infrared spectrograph, able to record spectra of hundreds of objects at once.", sources: ["esa"] }),
  mk({ slug: "wfc3", name: "Wide Field Camera 3", existing: true, alt: ["WFC3"], host: "hubble-space-telescope", type: "Camera", bands: ["ultraviolet", "visible-light", "near-infrared"], description: "Wide Field Camera 3 is Hubble's versatile camera, imaging from the ultraviolet to the near-infrared." }),

  // ----------------------------------------------------------------- new
  mk({ slug: "acs", name: "Advanced Camera for Surveys", alt: ["ACS"], host: "hubble-space-telescope", type: "Camera", bands: ["ultraviolet", "visible-light"], description: "The Advanced Camera for Surveys is a wide-field Hubble camera that produced many of the telescope's deepest survey images." }),
  mk({ slug: "cos", name: "Cosmic Origins Spectrograph", alt: ["COS"], host: "hubble-space-telescope", type: "Ultraviolet spectrograph", bands: ["ultraviolet"], description: "The Cosmic Origins Spectrograph studies the ultraviolet light of faint sources to probe the gas between galaxies." }),
  mk({ slug: "stis", name: "Space Telescope Imaging Spectrograph", alt: ["STIS"], host: "hubble-space-telescope", type: "Spectrograph", bands: ["ultraviolet", "visible-light", "near-infrared"], description: "STIS is a versatile Hubble spectrograph used for everything from exoplanet atmospheres to black-hole masses." }),
  mk({ slug: "niriss", name: "NIRISS", alt: ["FGS/NIRISS"], host: "james-webb-space-telescope", type: "Near-infrared imager and spectrograph", bands: ["near-infrared"], description: "NIRISS, contributed by the Canadian Space Agency, provides JWST with slitless spectroscopy and high-contrast imaging.", sources: ["csa"] }),
  mk({ slug: "hires", name: "HIRES", alt: ["High Resolution Echelle Spectrometer"], host: "keck-i", type: "Optical echelle spectrograph", bands: ["visible-light"], description: "HIRES on Keck I is a high-resolution optical spectrograph used in many exoplanet discoveries and studies of distant galaxies." }),
  mk({ slug: "muse", name: "MUSE", alt: ["Multi Unit Spectroscopic Explorer"], host: "very-large-telescope", type: "Optical integral-field spectrograph", bands: ["visible-light"], description: "MUSE on the VLT records a spectrum at every point in its field of view, mapping the motions and composition of galaxies.", sources: ["eso"] }),
  mk({ slug: "sphere", name: "SPHERE", alt: ["Spectro-Polarimetric High-contrast Exoplanet REsearch"], host: "very-large-telescope", type: "Exoplanet imager", bands: ["near-infrared", "visible-light"], description: "SPHERE on the VLT is an extreme adaptive-optics instrument that directly images exoplanets and circumstellar discs.", sources: ["eso"] }),
];
