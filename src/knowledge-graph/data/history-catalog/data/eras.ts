import type { EraRecord } from "@/knowledge-graph/data/history-catalog/types";

/**
 * Eras and traditions in the history of astronomy. Date ranges are broad,
 * conventional scholarly boundaries (never precise claims); each is a period
 * (chronological) or a tradition (a civilization's astronomy).
 */
export const ERAS: EraRecord[] = [
  {
    slug: "ancient-astronomy",
    name: "Ancient Astronomy",
    kind: "period",
    startYear: -3000,
    endYear: -500,
    description:
      "The earliest systematic sky-watching, when farming and religious calendars were tied to the motions of the Sun, Moon, and stars. Across Mesopotamia, Egypt, China, and Mesoamerica, observers tracked solstices, eclipses, and planetary cycles long before the idea of a physical cosmos.",
    sources: ["britannica"],
  },
  {
    slug: "babylonian-astronomy",
    name: "Babylonian Astronomy",
    kind: "tradition",
    region: "Mesopotamia",
    startYear: -1800,
    endYear: -100,
    description:
      "The astronomers of Mesopotamia kept centuries of meticulous observational records on clay tablets, developed arithmetical methods to predict lunar and planetary positions, and bequeathed the sexagesimal (base-60) system that still divides our circles and hours.",
    sources: ["britannica"],
  },
  {
    slug: "egyptian-astronomy",
    name: "Egyptian Astronomy",
    kind: "tradition",
    region: "Egypt",
    startYear: -3000,
    endYear: -300,
    description:
      "Ancient Egyptian sky-watchers used the heliacal rising of Sirius to anticipate the Nile flood, organised a 365-day civil calendar, and aligned temples and pyramids to the stars and cardinal directions.",
    sources: ["britannica"],
  },
  {
    slug: "greek-astronomy",
    name: "Greek Astronomy",
    kind: "tradition",
    region: "Ancient Greece",
    startYear: -600,
    endYear: 400,
    description:
      "Greek thinkers transformed astronomy into a geometric science, seeking physical and mathematical models of the heavens. From Pythagoras and Aristotle to Hipparchus and Ptolemy, they measured the cosmos, catalogued the stars, and built the geocentric system that endured for over a thousand years.",
    sources: ["britannica", "iau"],
  },
  {
    slug: "roman-astronomy",
    name: "Roman Astronomy",
    kind: "tradition",
    region: "Roman world",
    startYear: -100,
    endYear: 400,
    description:
      "Under Roman rule, astronomy flourished above all at Alexandria, where Ptolemy compiled the Almagest. The Romans reformed the calendar into the Julian system and preserved and transmitted Greek astronomical learning.",
    sources: ["britannica"],
  },
  {
    slug: "islamic-golden-age",
    name: "Islamic Golden Age Astronomy",
    kind: "tradition",
    region: "Islamic world",
    startYear: 800,
    endYear: 1500,
    description:
      "Astronomers across the medieval Islamic world preserved, corrected, and extended Greek and Indian astronomy. They built great observatories, refined observational instruments, compiled precise star catalogues and tables (zij), and gave us much of our star nomenclature.",
    sources: ["britannica", "iau"],
  },
  {
    slug: "chinese-astronomy",
    name: "Chinese Astronomy",
    kind: "tradition",
    region: "China",
    startYear: -1300,
    endYear: 1600,
    description:
      "Chinese court astronomers kept among the longest continuous observational records in history, documenting eclipses, comets, and 'guest stars' — including the supernova of 1054 that formed the Crab Nebula — for calendrical and imperial purposes.",
    sources: ["britannica"],
  },
  {
    slug: "indian-astronomy",
    name: "Indian Astronomy",
    kind: "tradition",
    region: "Indian subcontinent",
    startYear: -500,
    endYear: 1500,
    description:
      "The Indian astronomical tradition produced sophisticated mathematical astronomy in Sanskrit treatises (siddhantas). Aryabhata and his successors modelled planetary motion, computed eclipses, and proposed that the Earth rotates on its axis.",
    sources: ["britannica"],
  },
  {
    slug: "mayan-astronomy",
    name: "Mayan Astronomy",
    kind: "tradition",
    region: "Mesoamerica",
    startYear: 250,
    endYear: 900,
    description:
      "Maya astronomers tracked the Sun, Moon, and especially Venus with remarkable precision, encoding their cycles in the Dresden Codex and in calendars that governed ritual and agriculture across the Classic period.",
    sources: ["britannica"],
  },
  {
    slug: "renaissance-astronomy",
    name: "Renaissance Astronomy",
    kind: "period",
    startYear: 1450,
    endYear: 1600,
    description:
      "The European Renaissance reopened astronomy to bold reform. Copernicus placed the Sun at the centre of the planetary system, and Tycho Brahe's unprecedentedly accurate measurements set the stage for a new physics of the heavens.",
    sources: ["britannica"],
  },
  {
    slug: "scientific-revolution",
    name: "The Scientific Revolution",
    kind: "period",
    startYear: 1543,
    endYear: 1700,
    description:
      "In little more than a century, astronomy was remade. The telescope opened the sky, Kepler found that planets move in ellipses, Galileo turned observation into evidence, and Newton's universal gravitation united the heavens and the Earth under one law.",
    sources: ["britannica"],
  },
  {
    slug: "modern-astronomy",
    name: "Modern Astronomy",
    kind: "period",
    startYear: 1800,
    endYear: 1955,
    description:
      "Spectroscopy and photography turned telescopes into instruments of astrophysics, revealing what stars are made of. Astronomers measured the distances of galaxies, discovered the expansion of the universe, and began to understand how stars live and die.",
    sources: ["britannica", "nasa"],
  },
  {
    slug: "space-age-astronomy",
    name: "Space Age Astronomy",
    kind: "period",
    startYear: 1957,
    endYear: 2000,
    description:
      "The launch of Sputnik opened astronomy to the whole electromagnetic spectrum from above the atmosphere. Space telescopes, radio astronomy, and new detectors revealed the cosmic microwave background, pulsars, quasars, and the first worlds beyond the Sun.",
    sources: ["nasa", "esa"],
  },
  {
    slug: "contemporary-astronomy",
    name: "Contemporary Astronomy",
    kind: "period",
    startYear: 2000,
    description:
      "Twenty-first-century astronomy works in many messengers at once — light, gravitational waves, and particles. Thousands of exoplanets, the first images of black holes, and observatories like JWST are reshaping our picture of the universe and the search for life.",
    sources: ["nasa", "esa", "eso"],
  },
];
