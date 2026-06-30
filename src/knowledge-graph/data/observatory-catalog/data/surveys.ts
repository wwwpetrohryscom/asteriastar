import type { ObsRecord } from "@/knowledge-graph/data/observatory-catalog/types";

/** Sky surveys. Each observes one or more bands and, where known, is conducted by a telescope. */
type V = { slug: string; name: string; alt?: string[]; conductedBy?: string; bands: string[]; firstLight?: string; description: string; sources?: ObsRecord["sources"] };
const mk = (v: V): ObsRecord => ({
  id: `sky_survey:${v.slug}`, slug: v.slug, name: v.name, kind: "survey", altNames: v.alt,
  conductedBySlug: v.conductedBy, bandSlugs: v.bands, operationalPeriod: v.firstLight, description: v.description, sources: v.sources ?? ["noirlab"],
});

export const surveys: ObsRecord[] = [
  mk({ slug: "sloan-digital-sky-survey", name: "Sloan Digital Sky Survey", alt: ["SDSS"], bands: ["visible-light", "near-infrared"], firstLight: "2000–present", description: "The Sloan Digital Sky Survey has mapped more than a third of the sky and the spectra of millions of galaxies, quasars, and stars, building a 3D map of the universe.", sources: ["nasa"] }),
  mk({ slug: "two-mass", name: "2MASS", alt: ["Two Micron All Sky Survey"], bands: ["near-infrared"], firstLight: "1997–2001", description: "The Two Micron All Sky Survey imaged the entire sky in three near-infrared bands, cataloguing hundreds of millions of stars and galaxies.", sources: ["nasa"] }),
  mk({ slug: "wise-survey", name: "WISE All-Sky Survey", conductedBy: "wise", bands: ["infrared"], firstLight: "2010", description: "WISE surveyed the whole sky in infrared light, producing a catalogue of more than 500 million objects.", sources: ["nasa"] }),
  mk({ slug: "gaia-dr3", name: "Gaia Data Release 3", alt: ["Gaia DR3"], conductedBy: "gaia", bands: ["visible-light"], firstLight: "2022", description: "Gaia Data Release 3 provides positions, distances, motions, and physical properties for nearly two billion stars — the most detailed map of the Milky Way to date.", sources: ["esa"] }),
  mk({ slug: "pan-starrs", name: "Pan-STARRS", alt: ["Panoramic Survey Telescope and Rapid Response System"], bands: ["visible-light", "near-infrared"], firstLight: "2010–present", description: "Pan-STARRS in Hawaii repeatedly images the sky to discover asteroids, comets, and transient events, including the first interstellar object, ʻOumuamua.", sources: ["nasa"] }),
  mk({ slug: "dark-energy-survey", name: "Dark Energy Survey", alt: ["DES"], conductedBy: "cerro-tololo", bands: ["visible-light", "near-infrared"], firstLight: "2013–2019", description: "The Dark Energy Survey mapped hundreds of millions of galaxies from Cerro Tololo to probe the nature of cosmic acceleration.", sources: ["noirlab"] }),
  mk({ slug: "lsst", name: "Legacy Survey of Space and Time", alt: ["LSST"], conductedBy: "vera-rubin-observatory", bands: ["visible-light"], firstLight: "2025", description: "The Legacy Survey of Space and Time, conducted by the Vera C. Rubin Observatory, will image the entire southern sky every few nights for a decade.", sources: ["noirlab"] }),
  mk({ slug: "digitized-sky-survey", name: "Digitized Sky Survey", alt: ["DSS"], bands: ["visible-light"], description: "The Digitized Sky Survey is a digital scan of historical photographic sky surveys, a foundational all-sky reference for astronomy.", sources: ["noirlab"] }),
  mk({ slug: "hubble-deep-field", name: "Hubble Deep Field", conductedBy: "hubble-space-telescope", bands: ["visible-light", "near-infrared"], firstLight: "1995", description: "The Hubble Deep Field was a long exposure of a tiny, apparently empty patch of sky that revealed thousands of distant galaxies.", sources: ["nasa"] }),
  mk({ slug: "hubble-ultra-deep-field", name: "Hubble Ultra Deep Field", conductedBy: "hubble-space-telescope", bands: ["visible-light", "near-infrared"], firstLight: "2004", description: "The Hubble Ultra Deep Field went deeper still, capturing some of the most distant galaxies ever seen in visible and near-infrared light.", sources: ["nasa"] }),
];
