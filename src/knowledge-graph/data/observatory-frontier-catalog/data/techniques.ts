import type { FrontierRecord } from "@/knowledge-graph/data/observatory-frontier-catalog/types";

/** Ground observing techniques — ways of beating the atmosphere and the detector to recover sharp,
 *  deep images. Each links to the REUSED methods, detectors, and instruments it depends on. */
const tec = (r: Omit<FrontierRecord, "kind" | "id" | "sources"> & { slug: string; sources?: FrontierRecord["sources"] }): FrontierRecord => ({ sources: ["noirlab"], ...r, kind: "technique", id: `observing_technique:${r.slug}` });

export const techniques: FrontierRecord[] = [
  tec({ slug: "lucky-imaging", name: "Lucky Imaging", relatedKeys: ["detector_technology:cmos", "wavelength_band:visible-light"], description: "Taking a rapid burst of very short exposures and keeping only the few sharpest — the lucky moments when the atmosphere happens to be still — then combining them. A simple way to reach near-diffraction-limited resolution on modest telescopes without full adaptive optics.", sources: ["noirlab"], highlights: ["Keep only the frames the atmosphere left sharp"] }),
  tec({ slug: "speckle-imaging", name: "Speckle Imaging", relatedKeys: ["astronomy_method:adaptive-optics", "detector_technology:cmos"], description: "Recovering fine detail from the fleeting speckle pattern that the atmosphere breaks a star's image into, by taking many very short exposures and reconstructing the true image statistically. It resolves close double stars and fine structure below the atmospheric blur.", sources: ["noirlab"] }),
  tec({ slug: "image-stacking", name: "Image Stacking", relatedKeys: ["astronomy_method:photometry", "detector_technology:ccd"], description: "Combining many exposures of the same field to build up signal and average down noise, reaching far fainter objects than any single frame — the foundation of deep imaging, from amateur astrophotography to the deepest survey fields.", sources: ["noirlab"] }),
  tec({ slug: "fringe-tracking", name: "Fringe Tracking", relatedKeys: ["astronomy_method:interferometry", "interferometry_technique:optical-interferometry"], description: "The real-time control that keeps the interference fringes of an optical interferometer stable against the atmosphere's constantly-changing path lengths, so faint targets can be observed for longer. Without it, the fringes wash out in a fraction of a second.", sources: ["eso"] }),
];
