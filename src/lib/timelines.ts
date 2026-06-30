import type { SourceKey } from "@/lib/sources";
import type { AccentToken } from "@/lib/content/types";

/**
 * Timeline Engine — curated, well-documented chronologies. Every date is a
 * established historical fact; events link into the knowledge graph where an
 * entity/entry exists. No fabricated dates.
 *
 * TimelineEvent lives here (the Knowledge layer), and the presentation
 * component imports it — never the reverse.
 */
export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  /** Optional link to an entity/entry page. */
  href?: string;
}

export interface Timeline {
  slug: string;
  title: string;
  description: string;
  accent: AccentToken;
  sources: SourceKey[];
  events: TimelineEvent[];
}

export const TIMELINES: Timeline[] = [
  {
    slug: "space-missions",
    title: "Space Missions",
    description: "Landmark crewed and robotic missions of the space age.",
    accent: "halo",
    sources: ["nasa", "esa", "jpl"],
    events: [
      { date: "1969", title: "Apollo 11 lands on the Moon", description: "The first crewed lunar landing.", href: "/astronomy/space-missions/apollo-11" },
      { date: "1977", title: "Voyager 1 & 2 launch", description: "Grand tour of the outer planets; both now in interstellar space.", href: "/astronomy/space-missions/voyager-1" },
      { date: "1990", title: "Hubble Space Telescope launched", description: "Carried to orbit aboard Space Shuttle Discovery.", href: "/astronomy/space-telescopes/hubble-space-telescope" },
      { date: "1997", title: "Cassini–Huygens launched", description: "An international mission to Saturn and Titan.", href: "/astronomy/space-missions/cassini-huygens" },
      { date: "2006", title: "New Horizons launched", description: "Bound for the first close flyby of Pluto.", href: "/astronomy/space-missions/new-horizons" },
      { date: "2012", title: "Curiosity lands on Mars", description: "Mars Science Laboratory touches down in Gale Crater.", href: "/astronomy/space-missions/mars-science-laboratory" },
      { date: "2015", title: "New Horizons flies past Pluto", description: "The first close-up of the dwarf planet.", href: "/astronomy/dwarf-planets/pluto" },
      { date: "2021", title: "James Webb Space Telescope launched", description: "An international infrared observatory.", href: "/astronomy/space-missions/james-webb-space-telescope" },
    ],
  },
  {
    slug: "telescope-launches",
    title: "Space Telescope Launches",
    description: "The orbiting observatories that opened new windows on the universe.",
    accent: "halo",
    sources: ["nasa", "esa"],
    events: [
      { date: "1990", title: "Hubble Space Telescope", description: "Visible, ultraviolet, and near-infrared from low Earth orbit.", href: "/astronomy/space-telescopes/hubble-space-telescope" },
      { date: "2003", title: "Spitzer Space Telescope", description: "An infrared observatory; retired in 2020.", href: "/astronomy/space-telescopes/spitzer-space-telescope" },
      { date: "2009", title: "Kepler Space Telescope", description: "Discovered thousands of exoplanets by the transit method.", href: "/astronomy/space-telescopes/kepler-space-telescope" },
      { date: "2018", title: "TESS", description: "An all-sky survey for transiting exoplanets.", href: "/astronomy/space-telescopes/tess" },
      { date: "2021", title: "James Webb Space Telescope", description: "The great infrared observatory at L2.", href: "/astronomy/space-telescopes/james-webb-space-telescope" },
    ],
  },
  {
    slug: "planet-discoveries",
    title: "Planet & Dwarf-Planet Discoveries",
    description: "When the outer worlds of the Solar System were found.",
    accent: "nebula",
    sources: ["nasa", "iau"],
    events: [
      { date: "1781", title: "Uranus discovered", description: "Found by William Herschel — the first planet discovered with a telescope.", href: "/astronomy/planets/uranus" },
      { date: "1846", title: "Neptune discovered", description: "The first planet found through mathematical prediction.", href: "/astronomy/planets/neptune" },
      { date: "1930", title: "Pluto discovered", description: "Found by Clyde Tombaugh; long counted as the ninth planet.", href: "/astronomy/dwarf-planets/pluto" },
      { date: "2006", title: "Pluto reclassified as a dwarf planet", description: "Following the IAU's formal definition of 'planet'.", href: "/astronomy/dwarf-planets/pluto" },
    ],
  },
  {
    slug: "history-of-astronomy",
    title: "History of Astronomy",
    description: "Milestones from ancient sky-watching to the space age.",
    accent: "stone",
    sources: ["britannica", "nasa"],
    events: [
      { date: "c. 150 CE", title: "Ptolemy's Almagest", description: "A comprehensive geocentric model that endured for centuries." },
      { date: "1543", title: "Copernicus proposes heliocentrism", description: "Placing the Sun, not Earth, at the center." },
      { date: "1609–1610", title: "Galileo turns a telescope to the sky", description: "Discovers Jupiter's four large moons and more." },
      { date: "1687", title: "Newton's Principia", description: "Universal gravitation explains planetary motion." },
      { date: "1929", title: "The expanding universe", description: "Observations show galaxies receding — evidence for cosmic expansion." },
      { date: "1957", title: "The space age begins", description: "The first artificial satellite reaches orbit." },
      { date: "1990", title: "Hubble Space Telescope launched", description: "A new era of space-based observation.", href: "/astronomy/space-telescopes/hubble-space-telescope" },
      { date: "2021", title: "James Webb Space Telescope launched", description: "Infrared views of the early universe.", href: "/astronomy/space-telescopes/james-webb-space-telescope" },
    ],
  },
];

const BY_SLUG = new Map(TIMELINES.map((t) => [t.slug, t]));
export function getTimeline(slug: string): Timeline | undefined {
  return BY_SLUG.get(slug);
}
