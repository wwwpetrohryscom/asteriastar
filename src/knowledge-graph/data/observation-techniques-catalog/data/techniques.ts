import { cg, type CgRecord } from "@/knowledge-graph/data/observation-techniques-catalog/types";

/**
 * The capture-to-image observing techniques the graph was missing, added as `observing_technique`
 * entities. Each reuses the frontier techniques, detectors, equipment, and measurement methods already
 * in the graph. Only well-established observing practice is stated; nothing is fabricated.
 */
export const techniques: CgRecord[] = [
  cg("visual", {
    slug: "visual-astronomy",
    name: "Visual Astronomy",
    altNames: ["Visual observing"],
    description:
      "Observing the sky directly with the eye, whether unaided or through binoculars or a telescope. Visual astronomy trains the observer to see faint detail through averted vision and dark adaptation, and remains the most immediate way to experience the Moon, planets, and brighter deep-sky objects — the foundation on which every imaging technique is built.",
    relatedKeys: ["observing_equipment:binoculars", "observing_equipment:dobsonian-telescope", "amateur_activity:backyard-observing"],
    highlights: ["Seeing the sky by eye — averted vision and dark adaptation"],
  }),
  cg("imaging", {
    slug: "astrophotography",
    name: "Astrophotography",
    description:
      "Capturing images of celestial objects with a camera, from wide starfields on a fixed tripod to long, tracked exposures through a telescope. Astrophotography trades the eye's real-time view for the camera's ability to accumulate light over minutes or hours, revealing colour and faint structure the eye can never see. It spans planetary, deep-sky, and narrowband techniques.",
    relatedKeys: ["observing_equipment:camera", "observing_equipment:star-tracker", "detector_technology:ccd", "detector_technology:cmos", "observing_technique:deep-sky-imaging", "observing_technique:planetary-imaging"],
    highlights: ["Accumulating light a camera can gather but the eye cannot"],
  }),
  cg("imaging", {
    slug: "planetary-imaging",
    name: "Planetary Imaging",
    description:
      "High-resolution imaging of the Moon and planets by recording thousands of short-exposure frames and keeping only the sharpest, to beat the blurring of atmospheric turbulence. This 'lucky imaging' approach, usually with a fast CMOS camera, lets modest telescopes resolve cloud belts on Jupiter, the rings of Saturn, and craters on the Moon.",
    relatedKeys: ["observing_technique:lucky-imaging", "observing_technique:speckle-imaging", "astronomy_method:adaptive-optics", "detector_technology:cmos", "observing_technique:image-stacking"],
    highlights: ["Thousands of quick frames, keeping only the sharpest"],
  }),
  cg("imaging", {
    slug: "deep-sky-imaging",
    name: "Deep-Sky Imaging",
    description:
      "Long-exposure imaging of faint, extended objects — galaxies, nebulae, and clusters — that requires accurate tracking of the sky's motion, often over many hours of accumulated exposure. Deep-sky imaging leans on an equatorial mount, autoguiding, and careful calibration to draw out signal from targets far too faint to see by eye.",
    relatedKeys: ["observing_equipment:equatorial-mount", "observing_technique:autoguiding", "observing_technique:calibration-frames", "observing_technique:narrowband-imaging", "astronomy_method:photometry"],
    highlights: ["Hours of tracked exposure on faint galaxies and nebulae"],
  }),
  cg("imaging", {
    slug: "narrowband-imaging",
    name: "Narrowband Imaging",
    description:
      "Imaging through filters that pass only the light of specific emission lines — hydrogen-alpha, oxygen-III, sulphur-II — to isolate the glow of ionised gas and cut through light pollution and moonlight. Narrowband imaging reveals the intricate structure of emission nebulae and is the basis of the popular false-colour 'Hubble palette'.",
    relatedKeys: ["observing_technique:deep-sky-imaging", "observing_equipment:astronomical-filter", "astronomy_method:spectroscopy", "astrophysical_object_class:emission-nebula", "astrophysical_object_class:hii-region"],
    highlights: ["Isolating emission lines to cut light pollution and reveal nebulae"],
  }),
  cg("imaging", {
    slug: "autoguiding",
    name: "Autoguiding",
    description:
      "Keeping a telescope locked precisely on target during a long exposure by continuously imaging a guide star and sending tiny correction commands to the mount to cancel tracking errors. Autoguiding is what makes hours-long deep-sky exposures possible without the stars trailing.",
    relatedKeys: ["observing_equipment:equatorial-mount", "observing_technique:deep-sky-imaging"],
    highlights: ["Locking on a guide star to cancel tracking drift"],
  }),
  cg("processing", {
    slug: "calibration-frames",
    name: "Calibration Frames",
    altNames: ["Bias, dark, and flat frames"],
    description:
      "The reference exposures that remove a camera's own signature from an image: bias frames capture the sensor's read pedestal, dark frames the thermal signal that builds up during an exposure, and flat frames the uneven illumination and dust shadows of the optics. Subtracting and dividing by these calibration frames turns raw data into a faithful record of the sky.",
    relatedKeys: ["astronomy_method:error-analysis-and-calibration", "detector_technology:ccd", "observing_technique:image-processing"],
    highlights: ["Bias, dark, and flat frames — removing the camera's fingerprint"],
  }),
  cg("processing", {
    slug: "image-processing",
    name: "Astronomical Image Processing",
    description:
      "The steps that turn calibrated, stacked exposures into a finished image — stretching the very high dynamic range so faint nebulosity and bright cores both show, balancing colour, reducing noise, and sharpening detail. Done honestly it reveals what the data contain; the goal is to represent real signal, not to invent it.",
    relatedKeys: ["observing_technique:image-stacking", "observing_technique:calibration-frames", "observing_technique:drizzle"],
    highlights: ["Stretching, colour-balancing, and sharpening real signal"],
  }),
  cg("processing", {
    slug: "drizzle",
    name: "Drizzle",
    altNames: ["Drizzling", "Variable-pixel linear reconstruction"],
    description:
      "A technique for combining many dithered exposures that recovers resolution lost to undersampling, by mapping each input pixel onto a finer output grid. Developed for the Hubble Space Telescope's deep fields, drizzling is now widely used in both professional and amateur imaging to sharpen stacks of slightly shifted frames.",
    relatedKeys: ["observing_technique:image-stacking", "space_telescope:hubble-space-telescope", "observing_technique:image-processing"],
    highlights: ["Recovering resolution from many dithered, undersampled frames"],
  }),
  cg("processing", {
    slug: "plate-solving",
    name: "Plate Solving",
    altNames: ["Astrometric solving"],
    description:
      "Identifying exactly where an image points by matching the pattern of stars it contains against a reference catalogue, and so assigning precise celestial coordinates to every pixel. Plate solving lets software centre a target automatically, sync a mount's pointing, and stamp images with an accurate coordinate solution.",
    relatedKeys: ["astronomy_method:space-astrometry", "catalog:gaia-catalogue", "observing_technique:deep-sky-imaging"],
    highlights: ["Matching star patterns to a catalogue to fix where an image points"],
  }),
  cg("workflow", {
    slug: "imaging-workflow",
    name: "The Imaging Workflow",
    altNames: ["Acquisition-to-image pipeline", "Equipment chain"],
    description:
      "The end-to-end chain that turns a night at the telescope into a finished picture: mount, optics, and camera acquire tracked, autoguided exposures of the target and matching calibration frames; the frames are calibrated, aligned, and stacked; and the result is stretched and processed. Understanding the whole chain — where signal is gained and where it is lost — is what separates a snapshot from a scientific-grade image.",
    relatedKeys: ["observing_technique:astrophotography", "observing_technique:calibration-frames", "observing_technique:image-stacking", "observing_technique:image-processing", "observing_planner:astrophotography-planner"],
    highlights: ["Acquire → calibrate → stack → process — the whole chain"],
  }),
];
