import { ch, type ChRecord } from "@/knowledge-graph/data/astronomy-software-catalog/types";

/** Desktop planetarium & sky-visualisation software (astronomy_software). */
export const desktop: ChRecord[] = [
  ch("desktop", {
    slug: "stellarium",
    name: "Stellarium",
    platforms: ["Windows", "macOS", "Linux", "Web", "Mobile"],
    licenseLabel: "Open source",
    description:
      "A free, open-source planetarium that renders a photorealistic sky in real time, showing the stars, planets, constellations, and deep-sky objects as they appear from any location and time. Widely used for planning observing sessions and for teaching, Stellarium can also control telescopes and simulate the view through different eyepieces.",
    relatedKeys: ["astronomy_software:cartes-du-ciel", "catalog:messier", "data_archive:simbad"],
    highlights: ["A photorealistic real-time sky for any place and time"],
  }),
  ch("desktop", {
    slug: "kstars",
    name: "KStars",
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "A free, open-source desktop planetarium and observation planner from the KDE project, showing the sky for any date and location with millions of stars and thousands of deep-sky objects. KStars integrates the Ekos astrophotography suite, making it a complete free platform for both planning and capturing images.",
    relatedKeys: ["astronomy_software:ekos", "astronomy_software:indi", "observing_technique:plate-solving"],
    highlights: ["Planetarium, planner, and imaging suite in one"],
  }),
  ch("desktop", {
    slug: "celestia",
    name: "Celestia",
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "A free, open-source real-time 3D space simulator that lets the user fly beyond the Earth's sky to visit the planets, moons, stars, and galaxies, viewing the Solar System and beyond from any vantage point. Unlike a planetarium fixed to the ground, Celestia treats space itself as the stage.",
    relatedKeys: ["astronomy_software:stellarium"],
    highlights: ["Fly through a 3D universe from any vantage point"],
  }),
  ch("desktop", {
    slug: "cartes-du-ciel",
    name: "Cartes du Ciel",
    altNames: ["SkyChart"],
    platforms: ["Windows", "macOS", "Linux"],
    licenseLabel: "Open source",
    description:
      "A free, open-source sky-charting program (also known as SkyChart) that draws detailed star charts from a choice of catalogues for any time and place, with strong support for telescope control and finder charts. It is a long-standing favourite for planning deep-sky observing.",
    relatedKeys: ["astronomy_software:stellarium", "catalog:ngc"],
    highlights: ["Detailed, catalogue-driven star charts and finder charts"],
  }),
  ch("desktop", {
    slug: "skysafari",
    name: "SkySafari",
    platforms: ["iOS", "Android", "macOS"],
    licenseLabel: "Commercial",
    description:
      "A widely used mobile and desktop planetarium app that shows the sky in the observer's hand and can point a computerised telescope at any object with a tap. SkySafari combines a large object database with real-time sky simulation and telescope control for use at the eyepiece.",
    relatedKeys: ["astronomy_software:stellarium", "observing_equipment:dobsonian-telescope"],
    highlights: ["A planetarium and telescope controller in your pocket"],
  }),
];
