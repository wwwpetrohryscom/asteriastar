import type { TheoryRecord } from "@/knowledge-graph/data/history-catalog/types";

/** Major theories and models in the history of astronomy. */
export const THEORIES: TheoryRecord[] = [
  {
    slug: "geocentrism",
    name: "The Geocentric Model",
    year: 150,
    yearApprox: true,
    by: ["ptolemy"],
    status: "superseded",
    eraSlug: "greek-astronomy",
    description:
      "The model, codified by Ptolemy, in which the Earth sits motionless at the centre of the cosmos while the Sun, Moon, planets, and stars revolve around it on a system of circles and epicycles. It explained the observed motions well enough to dominate astronomy for over 1,400 years before being overturned by heliocentrism.",
    sources: ["britannica"],
  },
  {
    slug: "heliocentrism",
    name: "The Heliocentric Model",
    year: 1543,
    by: ["nicolaus-copernicus"],
    attributedTo: "Nicolaus Copernicus, anticipated in antiquity by Aristarchus of Samos",
    status: "established",
    eraSlug: "renaissance-astronomy",
    description:
      "The model placing the Sun at the centre of the planetary system, with the Earth a planet that both spins on its axis and orbits the Sun. Proposed in antiquity by Aristarchus and revived by Copernicus in 1543, it was supported by Galileo's and Kepler's work and is the foundation of our modern understanding of the Solar System.",
    sources: ["britannica", "iau"],
  },
  {
    slug: "keplers-laws",
    name: "Kepler's Laws of Planetary Motion",
    year: 1619,
    by: ["johannes-kepler"],
    status: "established",
    eraSlug: "scientific-revolution",
    description:
      "Three laws describing how planets move: orbits are ellipses with the Sun at one focus; a line from the Sun to a planet sweeps out equal areas in equal times; and the square of a planet's orbital period is proportional to the cube of its average distance. Derived from Tycho's observations between 1609 and 1619, they replaced circles with ellipses and made planetary motion exactly predictable.",
    sources: ["britannica"],
  },
  {
    slug: "universal-gravitation",
    name: "Universal Gravitation",
    year: 1687,
    by: ["isaac-newton"],
    status: "established",
    eraSlug: "scientific-revolution",
    description:
      "Newton's law that every mass attracts every other with a force proportional to their masses and inversely proportional to the square of the distance between them. Published in the Principia, it explained Kepler's laws, the tides, and the motion of comets from a single principle, uniting terrestrial and celestial physics.",
    sources: ["britannica"],
  },
  {
    slug: "general-relativity",
    name: "General Relativity",
    year: 1915,
    by: [],
    attributedTo: "Albert Einstein",
    status: "established",
    eraSlug: "modern-astronomy",
    description:
      "Einstein's theory of gravity as the curvature of spacetime by mass and energy. Published in 1915, it predicted the bending of starlight, the precession of Mercury's orbit, black holes, an expanding universe, and gravitational waves — predictions confirmed across the following century and underpinning modern cosmology.",
    sources: ["nasa", "britannica"],
  },
  {
    slug: "big-bang-theory",
    name: "The Big Bang",
    year: 1931,
    by: ["georges-lemaitre"],
    status: "established",
    eraSlug: "modern-astronomy",
    description:
      "The theory that the universe expanded from an extremely hot, dense early state, first proposed by Georges Lemaître as the 'primeval atom'. The expansion of the universe and, decisively, the discovery of the cosmic microwave background in 1965 established it as the leading account of cosmic history.",
    sources: ["nasa", "britannica"],
  },
];
