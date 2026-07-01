import type { PublicationRecord } from "@/knowledge-graph/data/history-catalog/types";

/** Landmark publications in the history of astronomy. */
export const PUBLICATIONS: PublicationRecord[] = [
  {
    slug: "almagest",
    name: "Almagest",
    year: 150,
    yearApprox: true,
    authors: ["ptolemy"],
    language: "Greek",
    eraSlug: "roman-astronomy",
    introducesTheories: ["geocentrism"],
    description:
      "Ptolemy's comprehensive treatise on astronomy, presenting the geocentric model with epicycles and a catalogue of more than a thousand stars. It remained the standard astronomical reference in Europe and the Islamic world for over fourteen centuries.",
    sources: ["britannica"],
  },
  {
    slug: "aryabhatiya",
    name: "Aryabhatiya",
    year: 499,
    authors: ["aryabhata"],
    language: "Sanskrit",
    eraSlug: "indian-astronomy",
    description:
      "Aryabhata's concise verse treatise on mathematics and astronomy, giving methods for planetary positions and eclipses, a sine table, and the idea that the Earth rotates on its axis.",
    sources: ["britannica"],
  },
  {
    slug: "book-of-fixed-stars",
    name: "Book of Fixed Stars",
    year: 964,
    authors: ["al-sufi"],
    language: "Arabic",
    eraSlug: "islamic-golden-age",
    description:
      "Al-Sufi's revision of Ptolemy's star catalogue against his own observations, with constellation drawings and corrected magnitudes. It contains the earliest known record of the Andromeda Galaxy and preserves many traditional Arabic star names.",
    sources: ["britannica", "iau"],
  },
  {
    slug: "de-revolutionibus",
    name: "De revolutionibus orbium coelestium",
    year: 1543,
    authors: ["nicolaus-copernicus"],
    language: "Latin",
    eraSlug: "renaissance-astronomy",
    introducesTheories: ["heliocentrism"],
    description:
      "Copernicus's masterwork, 'On the Revolutions of the Heavenly Spheres', setting out the heliocentric system in full. Published in the year of his death, it began the displacement of the Earth from the centre of the cosmos.",
    sources: ["britannica", "iau"],
  },
  {
    slug: "astronomia-nova",
    name: "Astronomia nova",
    year: 1609,
    authors: ["johannes-kepler"],
    language: "Latin",
    eraSlug: "scientific-revolution",
    introducesTheories: ["keplers-laws"],
    description:
      "Kepler's 'New Astronomy', in which his struggle with the orbit of Mars led him to the first two laws of planetary motion: elliptical orbits and the equal-area law.",
    sources: ["britannica"],
  },
  {
    slug: "sidereus-nuncius",
    name: "Sidereus Nuncius",
    year: 1610,
    authors: ["galileo-galilei"],
    language: "Latin",
    eraSlug: "scientific-revolution",
    introducesDiscoveries: ["moons-of-jupiter"],
    description:
      "Galileo's 'Starry Messenger', the first published account of telescopic astronomy: the four moons of Jupiter, the mountains of the Moon, and the countless stars of the Milky Way.",
    sources: ["britannica", "nasa"],
  },
  {
    slug: "harmonices-mundi",
    name: "Harmonices Mundi",
    year: 1619,
    authors: ["johannes-kepler"],
    language: "Latin",
    eraSlug: "scientific-revolution",
    introducesTheories: ["keplers-laws"],
    description:
      "Kepler's 'Harmony of the World', which presents his third law of planetary motion — relating a planet's orbital period to its distance from the Sun.",
    sources: ["britannica"],
  },
  {
    slug: "dialogue-two-chief-world-systems",
    name: "Dialogue Concerning the Two Chief World Systems",
    year: 1632,
    authors: ["galileo-galilei"],
    language: "Italian",
    eraSlug: "scientific-revolution",
    description:
      "Galileo's spirited comparison of the Copernican and Ptolemaic systems, written in Italian for a wide audience. Its defence of heliocentrism led to his trial and condemnation by the Inquisition in 1633.",
    sources: ["britannica"],
  },
  {
    slug: "principia",
    name: "Philosophiæ Naturalis Principia Mathematica",
    year: 1687,
    authors: ["isaac-newton"],
    language: "Latin",
    eraSlug: "scientific-revolution",
    introducesTheories: ["universal-gravitation"],
    description:
      "Newton's 'Mathematical Principles of Natural Philosophy', perhaps the most important scientific book ever written. It sets out the laws of motion and universal gravitation, deriving Kepler's laws and the motions of the heavens from first principles.",
    sources: ["britannica"],
  },
  {
    slug: "cosmos",
    name: "Cosmos",
    year: 1980,
    authors: ["carl-sagan"],
    language: "English",
    eraSlug: "space-age-astronomy",
    description:
      "Carl Sagan's book and accompanying television series, which traced the history of science and the scale of the universe for a global audience and became one of the most influential works of science communication ever made.",
    sources: ["nasa", "britannica"],
  },
  {
    slug: "a-brief-history-of-time",
    name: "A Brief History of Time",
    year: 1988,
    authors: ["stephen-hawking"],
    language: "English",
    eraSlug: "contemporary-astronomy",
    description:
      "Stephen Hawking's best-selling account of cosmology — from the Big Bang to black holes and the nature of time — which brought the deepest questions of the universe to millions of readers.",
    sources: ["britannica", "nasa"],
  },
];
