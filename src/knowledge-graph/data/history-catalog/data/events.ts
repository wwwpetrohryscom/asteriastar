import type { EventRecord } from "@/knowledge-graph/data/history-catalog/types";

/** Pivotal events and institutions in the history of astronomy. */
export const EVENTS: EventRecord[] = [
  {
    slug: "invention-of-the-telescope",
    name: "The Invention of the Telescope",
    year: 1608,
    eraSlug: "scientific-revolution",
    description:
      "The refracting telescope appeared in the Netherlands in 1608, with the spectacle-maker Hans Lippershey filing the first known patent application. Within a year Galileo had built his own and turned it to the sky, opening the telescopic era of astronomy.",
    sources: ["britannica"],
  },
  {
    slug: "founding-of-greenwich-observatory",
    name: "Founding of the Royal Observatory, Greenwich",
    year: 1675,
    eraSlug: "scientific-revolution",
    description:
      "King Charles II founded the Royal Observatory at Greenwich in 1675 to improve navigation by mapping the stars and the Moon. It gave its name to the Greenwich Meridian and Greenwich Mean Time and shaped positional astronomy for centuries.",
    sources: ["britannica"],
  },
  {
    slug: "founding-of-the-iau",
    name: "Founding of the International Astronomical Union",
    year: 1919,
    eraSlug: "modern-astronomy",
    description:
      "The International Astronomical Union was founded in 1919 to coordinate astronomy worldwide. It is the authority that defines constellation boundaries, names celestial bodies and surface features, and — in 2006 — set the definition of a planet.",
    sources: ["iau"],
  },
  {
    slug: "the-great-debate",
    name: "The Great Debate",
    year: 1920,
    eraSlug: "modern-astronomy",
    relatedEntityIds: ["galaxy:andromeda-galaxy", "galaxy:milky-way"],
    description:
      "In 1920 Harlow Shapley and Heber Curtis debated the scale of the universe: whether the spiral nebulae lie within the Milky Way or are separate 'island universes'. Edwin Hubble settled the question a few years later by measuring the distance to Andromeda.",
    sources: ["nasa", "britannica"],
  },
];
