import type { ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";

/** Spacecraft, distinct from the missions that carry them (part_of_mission). */
type C = { slug: string; name: string; existing?: boolean; craftType: string; agencySlug?: string; status: string; description: string; sources?: ExplorationRecord["sources"] };
const mk = (c: C): ExplorationRecord => ({
  id: `spacecraft:${c.slug}`, slug: c.slug, name: c.name, kind: "spacecraft", existing: c.existing,
  craftType: c.craftType, agencySlug: c.agencySlug, status: c.status, description: c.description, sources: c.sources ?? ["nasa"],
});

export const spacecraft: ExplorationRecord[] = [
  mk({ slug: "curiosity", name: "Curiosity", existing: true, craftType: "Rover", agencySlug: "nasa", status: "Active", description: "The car-sized nuclear-powered rover of the Mars Science Laboratory mission, exploring Gale crater since 2012.", sources: ["jpl"] }),
  mk({ slug: "perseverance", name: "Perseverance", existing: true, craftType: "Rover", agencySlug: "nasa", status: "Active", description: "NASA's Mars 2020 rover, seeking signs of ancient life and caching rock cores in Jezero crater.", sources: ["jpl"] }),
  mk({ slug: "ingenuity", name: "Ingenuity", existing: true, craftType: "Helicopter", agencySlug: "nasa", status: "Completed", description: "A small helicopter that achieved the first powered, controlled flight on another planet, scouting ahead of Perseverance.", sources: ["jpl"] }),
  mk({ slug: "opportunity", name: "Opportunity", existing: true, craftType: "Rover", agencySlug: "nasa", status: "Completed", description: "A Mars Exploration Rover that operated for nearly 15 years in Meridiani Planum.", sources: ["jpl"] }),
  mk({ slug: "spirit", name: "Spirit", existing: true, craftType: "Rover", agencySlug: "nasa", status: "Completed", description: "A Mars Exploration Rover that explored Gusev crater and found evidence of past water.", sources: ["jpl"] }),
  mk({ slug: "huygens", name: "Huygens", existing: true, craftType: "Lander / atmospheric probe", agencySlug: "esa", status: "Completed", description: "The ESA probe that descended through Titan's atmosphere and landed on its surface in 2005, the first landing in the outer solar system.", sources: ["esa"] }),
  mk({ slug: "sojourner", name: "Sojourner", craftType: "Rover", agencySlug: "nasa", status: "Completed", description: "The microwave-oven-sized rover of Mars Pathfinder, the first wheeled vehicle to operate on Mars.", sources: ["jpl"] }),
  mk({ slug: "philae", name: "Philae", craftType: "Lander", agencySlug: "esa", status: "Completed", description: "The Rosetta mission's lander, the first spacecraft to make a soft landing on a comet, in 2014.", sources: ["esa"] }),
  mk({ slug: "lunokhod-1", name: "Lunokhod 1", craftType: "Rover", agencySlug: "roscosmos", status: "Completed", description: "The first robotic rover to operate on the surface of another world, delivered to the Moon by Luna 17.", sources: ["roscosmos"] }),
  mk({ slug: "zhurong", name: "Zhurong", craftType: "Rover", agencySlug: "cnsa", status: "Completed", description: "China's first Mars rover, delivered by the Tianwen-1 mission to Utopia Planitia.", sources: ["nasa"] }),
];
