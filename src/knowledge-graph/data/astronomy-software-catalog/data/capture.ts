import { ch, type ChRecord } from "@/knowledge-graph/data/astronomy-software-catalog/types";

/** Imaging (processing) and acquisition/control software (astronomy_software). */
export const capture: ChRecord[] = [
  ch("imaging", {
    slug: "pixinsight",
    name: "PixInsight",
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Commercial",
    description:
      "A professional-grade image-processing platform built specifically for astrophotography, with a full pipeline from calibration and registration to advanced noise reduction, deconvolution, and colour work. Its scriptable, high-precision tools make it the standard choice for serious deep-sky imagers.",
    relatedKeys: ["observing_technique:image-processing", "observing_technique:calibration-frames", "observing_technique:drizzle"],
    highlights: ["The professional pipeline for deep-sky image processing"],
  }),
  ch("imaging", {
    slug: "siril",
    name: "Siril",
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "A free, open-source image-processing program for astrophotography that calibrates, registers, and stacks sequences of exposures and then processes the result, with plate solving and scripting built in. It is a capable free alternative for the full path from raw frames to a finished image.",
    relatedKeys: ["observing_technique:image-stacking", "observing_technique:image-processing", "observing_technique:plate-solving"],
    highlights: ["Free calibration, stacking, and processing in one tool"],
  }),
  ch("imaging", {
    slug: "deepskystacker",
    name: "DeepSkyStacker",
    platforms: ["Windows"],
    licenseLabel: "Freeware",
    description:
      "A free program that automates the registration and stacking of deep-sky exposures together with their calibration frames, producing a single high-signal image ready for final processing. Its simplicity has made it a popular first step in many deep-sky imaging workflows.",
    relatedKeys: ["observing_technique:image-stacking", "observing_technique:calibration-frames"],
    highlights: ["Automated registration and stacking of deep-sky frames"],
  }),
  ch("acquisition", {
    slug: "nina",
    name: "N.I.N.A.",
    altNames: ["NINA", "Nighttime Imaging 'N' Astronomy"],
    platforms: ["Windows"],
    licenseLabel: "Open source",
    description:
      "A free, open-source imaging-suite application that sequences and automates a night of astrophotography — slewing, plate solving, focusing, guiding, and capturing calibrated exposures — through connected mounts, cameras, and accessories. It orchestrates the whole acquisition side of the imaging chain.",
    relatedKeys: ["observing_technique:autoguiding", "observing_technique:plate-solving", "astronomy_software:phd2", "astronomy_software:ascom"],
    highlights: ["Automating a whole night of image acquisition"],
  }),
  ch("acquisition", {
    slug: "phd2",
    name: "PHD2 Guiding",
    altNames: ["PHD2", "PHD Guiding"],
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "A free, open-source autoguiding application — the name stands for 'Push Here Dummy' — that images a guide star and issues corrections to the mount to hold a target steady through long exposures. PHD2 is the de-facto standard guider, used on its own or driven by imaging suites like N.I.N.A. and Ekos.",
    relatedKeys: ["observing_technique:autoguiding", "astronomy_software:nina"],
    highlights: ["The de-facto standard autoguider for long exposures"],
  }),
  ch("acquisition", {
    slug: "ascom",
    name: "ASCOM Platform",
    altNames: ["ASCOM"],
    platforms: ["Windows"],
    licenseLabel: "Open source",
    description:
      "A widely adopted standard and driver platform on Windows that lets astronomy software talk to mounts, cameras, focusers, and other devices through a common interface, so any compliant application can control any compliant device. ASCOM is the interoperability glue of the Windows astrophotography ecosystem.",
    relatedKeys: ["astronomy_software:indi", "observing_equipment:equatorial-mount"],
    highlights: ["The common device-control interface on Windows"],
  }),
  ch("acquisition", {
    slug: "indi",
    name: "INDI",
    altNames: ["Instrument-Neutral Distributed Interface"],
    platforms: ["Linux", "macOS"],
    licenseLabel: "Open source",
    description:
      "A free, open-source, cross-platform protocol and driver framework — the Instrument-Neutral Distributed Interface — that controls astronomical instruments over a network, independent of any single application. INDI is the device layer beneath Ekos and much of the Linux and cross-platform imaging ecosystem.",
    relatedKeys: ["astronomy_software:ekos", "astronomy_software:ascom", "observing_equipment:equatorial-mount"],
    highlights: ["Network device control for the cross-platform ecosystem"],
  }),
  ch("acquisition", {
    slug: "ekos",
    name: "Ekos",
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "A complete astrophotography suite built into KStars and driven by INDI, handling alignment and plate solving, focusing, guiding, and fully scheduled imaging sequences. Ekos brings professional-style automated acquisition to a free, cross-platform stack.",
    relatedKeys: ["astronomy_software:kstars", "astronomy_software:indi", "astronomy_software:phd2", "observing_technique:plate-solving"],
    highlights: ["Scheduled, automated imaging built into KStars"],
  }),
];
