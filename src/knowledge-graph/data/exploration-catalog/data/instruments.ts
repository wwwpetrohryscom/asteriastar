import type { ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";

/**
 * Scientific instruments, each hosted by a spacecraft or observatory
 * (contains_instrument). hostSlug is carried in spacecraftSlugs for resolution.
 */
type I = { slug: string; name: string; instrumentType: string; host: string; measures: string; description: string; sources?: ExplorationRecord["sources"] };
const mk = (i: I): ExplorationRecord => ({
  id: `scientific_instrument:${i.slug}`, slug: i.slug, name: i.name, kind: "instrument",
  instrumentType: i.instrumentType, spacecraftSlugs: [i.host], measures: i.measures, description: i.description, sources: i.sources ?? ["nasa"],
});

export const instruments: ExplorationRecord[] = [
  mk({ slug: "mastcam-z", name: "Mastcam-Z", instrumentType: "Camera", host: "perseverance", measures: "Multispectral, stereoscopic, zoomable images of the Martian surface", description: "A mast-mounted, zoomable stereo camera system on the Perseverance rover.", sources: ["jpl"] }),
  mk({ slug: "supercam", name: "SuperCam", instrumentType: "Spectrometer / laser", host: "perseverance", measures: "Rock and soil chemistry and mineralogy by remote laser analysis", description: "An instrument on Perseverance that vaporises rock at a distance with a laser to analyse its composition.", sources: ["jpl"] }),
  mk({ slug: "moxie", name: "MOXIE", instrumentType: "Technology demonstration", host: "perseverance", measures: "Production of oxygen from the Martian carbon-dioxide atmosphere", description: "An experiment on Perseverance that demonstrated making oxygen from the Martian atmosphere.", sources: ["jpl"] }),
  mk({ slug: "chemcam", name: "ChemCam", instrumentType: "Spectrometer / laser", host: "curiosity", measures: "Elemental composition of rocks via laser-induced breakdown spectroscopy", description: "The laser spectrometer on Curiosity that analyses Martian rock chemistry from a distance.", sources: ["jpl"] }),
  mk({ slug: "sam", name: "Sample Analysis at Mars (SAM)", instrumentType: "Spectrometer suite", host: "curiosity", measures: "Organic molecules and atmospheric and isotopic composition", description: "Curiosity's onboard chemistry laboratory, which detected organic molecules and methane on Mars.", sources: ["jpl"] }),
  mk({ slug: "nircam", name: "NIRCam", instrumentType: "Infrared camera", host: "james-webb-space-telescope", measures: "Near-infrared imaging of the distant and early universe", description: "The primary near-infrared imager of the James Webb Space Telescope.", sources: ["nasa"] }),
  mk({ slug: "miri", name: "MIRI", instrumentType: "Infrared instrument", host: "james-webb-space-telescope", measures: "Mid-infrared imaging and spectroscopy", description: "The Mid-Infrared Instrument on JWST, sensitive to cool, dusty, and distant objects.", sources: ["nasa", "esa"] }),
  mk({ slug: "nirspec", name: "NIRSpec", instrumentType: "Spectrograph", host: "james-webb-space-telescope", measures: "Near-infrared spectra of hundreds of objects at once", description: "The near-infrared spectrograph on JWST, used to probe exoplanet atmospheres and early galaxies.", sources: ["esa"] }),
  mk({ slug: "wfc3", name: "Wide Field Camera 3", instrumentType: "Camera", host: "hubble-space-telescope", measures: "Ultraviolet, visible, and near-infrared imaging", description: "A versatile camera installed on the Hubble Space Telescope during its final servicing mission.", sources: ["nasa"] }),
  mk({ slug: "juno-microwave-radiometer", name: "Juno Microwave Radiometer (MWR)", instrumentType: "Radiometer", host: "juno", measures: "Microwave emission from deep within Jupiter's atmosphere", description: "The instrument on Juno that peers beneath Jupiter's cloud tops to map its deep atmosphere.", sources: ["jpl"] }),
];
