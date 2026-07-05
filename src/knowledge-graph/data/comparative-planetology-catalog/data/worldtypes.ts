import type { PlanetologyRecord } from "@/knowledge-graph/data/comparative-planetology-catalog/types";

/** Exoplanet world-types — created with the EXISTING planetary-class type (which already holds
 *  super-Earths, mini-Neptunes, and hot Jupiters). Each links to the REUSED planetary classes,
 *  moons, habitable zone, and processes it relates to. Hypothetical classes are labelled proposed. */
const wt = (r: Omit<PlanetologyRecord, "kind" | "id" | "sources"> & { slug: string; sources?: PlanetologyRecord["sources"] }): PlanetologyRecord => ({ sources: ["nasa"], ...r, kind: "worldtype", id: `planetary_class:${r.slug}` });

export const worldtypes: PlanetologyRecord[] = [
  wt({ slug: "ocean-world", name: "Ocean World", domainLabel: "Water world", relatedKeys: ["moon:europa", "moon:enceladus", "exploration_theme:ocean-worlds"], description: "A world with a large body of liquid water — most securely the global oceans hidden beneath the ice of moons like Europa and Enceladus, and possibly some water-rich exoplanets. Ocean worlds are among the most promising places to search for life beyond Earth.", sources: ["nasa"], highlights: ["Global oceans beneath ice — the best places to look for life"] }),
  wt({ slug: "lava-world", name: "Lava World", domainLabel: "Molten world", relatedKeys: ["planetary_class:super-earth", "planetary_process:volcanism"], description: "A rocky exoplanet orbiting so close to its star that its day side is hot enough to melt rock, covering it in a global magma ocean. Several known super-Earths, such as 55 Cancri e, are thought to be lava worlds, offering a natural laboratory for molten-rock chemistry.", sources: ["nasa"] }),
  wt({ slug: "hycean-planet", name: "Hycean Planet", domainLabel: "Proposed", relatedKeys: ["planetary_class:mini-neptune", "habitable_zone_candidate:habitable-zone", "astrobiology_topic:ocean-worlds-astrobiology"], description: "A proposed class of exoplanet — a hot world with a hydrogen-rich atmosphere over a planet-wide ocean. If they exist, hycean planets would offer a much wider habitable zone than rocky worlds and be easier to study, but the class is hypothetical and its habitability unconfirmed.", sources: ["nasa"], highlights: ["A proposed, unconfirmed class of potentially habitable ocean world"] }),
];
