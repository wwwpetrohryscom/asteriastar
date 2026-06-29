import type { AccentToken } from "@/lib/content/types";
import {
  getAllGraphEntities,
  getConnections,
  getGraphEntitiesByType,
  type EntityType,
  type GraphEntity,
  type RelationType,
} from "@/knowledge-graph";

/**
 * Static discovery configuration.
 *
 * Topics and relationship pages are graph-powered: their contents are derived
 * from the knowledge graph at build time, so they can never contain fabricated
 * or stale data. Adding entities/relations enriches these pages automatically.
 */

export interface Topic {
  slug: string;
  title: string;
  description: string;
  /** Entity types that populate this topic. */
  types: EntityType[];
  accent: AccentToken;
}

export const TOPICS: Topic[] = [
  { slug: "stars", title: "Stars", description: "Suns near and far — from the brightest in our sky to the Sun's nearest neighbors.", types: ["star"], accent: "nebula" },
  { slug: "planets", title: "Planets", description: "The eight planets of the Solar System.", types: ["planet"], accent: "halo" },
  { slug: "dwarf-planets", title: "Dwarf Planets", description: "Rounded worlds that share their orbit, from Pluto to Makemake.", types: ["dwarf_planet"], accent: "halo" },
  { slug: "moons", title: "Moons", description: "Natural satellites orbiting the planets.", types: ["moon"], accent: "halo" },
  { slug: "galaxies", title: "Galaxies", description: "Island universes of stars, gas, and dark matter.", types: ["galaxy"], accent: "nebula" },
  { slug: "nebulae", title: "Nebulae", description: "Interstellar clouds where stars are born and where they end.", types: ["nebula"], accent: "nebula" },
  { slug: "constellations", title: "Constellations", description: "The patterns and official regions of the sky.", types: ["constellation"], accent: "aurora" },
  { slug: "star-clusters", title: "Star Clusters", description: "Groups of stars born from the same cloud.", types: ["star_cluster"], accent: "nebula" },
  { slug: "black-holes", title: "Black Holes", description: "Regions where gravity overwhelms even light.", types: ["black_hole"], accent: "nebula" },
  { slug: "comets", title: "Comets", description: "Icy visitors that grow tails near the Sun.", types: ["comet"], accent: "aurora" },
  { slug: "meteor-showers", title: "Meteor Showers", description: "When Earth sweeps through cometary debris.", types: ["meteor_shower"], accent: "aurora" },
  { slug: "missions", title: "Space Missions", description: "Humanity's journeys of exploration beyond Earth.", types: ["space_mission"], accent: "halo" },
  { slug: "telescopes", title: "Space Telescopes", description: "Observatories in orbit, above the atmosphere.", types: ["space_telescope"], accent: "halo" },
  { slug: "observatories", title: "Observatories", description: "Ground-based facilities that study the sky.", types: ["observatory"], accent: "halo" },
  { slug: "astronomers", title: "Astronomers", description: "The people who changed how we see the cosmos.", types: ["astronomer"], accent: "stone" },
  { slug: "space-agencies", title: "Space Agencies", description: "The agencies and institutions of spaceflight and astronomy.", types: ["organization"], accent: "stone" },
  { slug: "launch-vehicles", title: "Launch Vehicles", description: "The rockets that carry missions beyond Earth.", types: ["launch_vehicle"], accent: "halo" },
  { slug: "satellites", title: "Satellites & Stations", description: "Spacecraft and stations in orbit around Earth.", types: ["satellite"], accent: "halo" },
  { slug: "exoplanets", title: "Exoplanets", description: "Worlds orbiting other stars, and the systems that host them.", types: ["exoplanet"], accent: "nebula" },
  { slug: "deep-sky", title: "Deep Sky", description: "Galaxies, nebulae, clusters, and black holes beyond the Solar System.", types: ["galaxy", "nebula", "star_cluster", "black_hole"], accent: "nebula" },
  { slug: "catalogs", title: "Catalogs", description: "The great catalogues of the sky — Messier, NGC, and more.", types: ["catalog"], accent: "stone" },
  { slug: "mythology", title: "Sky Mythology", description: "The myths and figures behind the names in the sky.", types: ["mythology_figure", "mythology_story"], accent: "ember" },
  { slug: "night-sky", title: "Night Sky", description: "Events and objects to watch for overhead — showers, comets, and bright constellations.", types: ["meteor_shower", "comet", "constellation"], accent: "aurora" },
];

const TOPIC_BY_SLUG = new Map(TOPICS.map((t) => [t.slug, t]));
export function getTopic(slug: string): Topic | undefined {
  return TOPIC_BY_SLUG.get(slug);
}

export function getTopicEntities(topic: Topic): GraphEntity[] {
  return topic.types
    .flatMap((t) => getGraphEntitiesByType(t))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* --------------------------------------------------- relationship pages */

export interface RelationshipPage {
  slug: string;
  title: string;
  description: string;
  /** Optional note shown beneath the heading (e.g. sourcing/scope). */
  note?: string;
  /** Derived from the graph at build time. */
  resolve: () => GraphEntity[];
}

/** Entities on the *other* end of an anchor's connections of a given type. */
function connected(
  anchorId: string,
  type: RelationType,
  direction: "in" | "out" | "any" = "any",
): GraphEntity[] {
  return getConnections(anchorId)
    .filter((c) => c.relation.type === type)
    .filter((c) =>
      direction === "any" ? true : direction === "out" ? c.outgoing : !c.outgoing,
    )
    .map((c) => c.other)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const RELATIONSHIP_PAGES: RelationshipPage[] = [
  {
    slug: "stars-in-orion",
    title: "Stars in Orion",
    description: "The bright stars that make up the constellation Orion, the Hunter.",
    resolve: () => connected("constellation:orion", "belongs_to", "in"),
  },
  {
    slug: "moons-of-jupiter",
    title: "Moons of Jupiter",
    description: "Jupiter's major moons, including the four Galilean moons discovered by Galileo.",
    resolve: () => connected("planet:jupiter", "child_of", "in"),
  },
  {
    slug: "moons-of-saturn",
    title: "Moons of Saturn",
    description: "Major moons of Saturn, including Titan and Enceladus.",
    resolve: () => connected("planet:saturn", "child_of", "in"),
  },
  {
    slug: "nasa-missions",
    title: "NASA Missions",
    description: "Spacecraft and observatories operated by NASA in the knowledge graph.",
    resolve: () => connected("organization:nasa", "operated_by", "in"),
  },
  {
    slug: "missions-to-mars",
    title: "Missions to Mars",
    description: "Spacecraft whose mission target is the planet Mars.",
    resolve: () => connected("planet:mars", "mission_target", "in"),
  },
  {
    slug: "space-telescopes",
    title: "Space Telescopes",
    description: "Orbiting observatories that study the universe from above the atmosphere.",
    resolve: () => getGraphEntitiesByType("space_telescope").sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    slug: "galaxies-observed-by-james-webb",
    title: "Observed by James Webb",
    description: "Deep-sky objects the James Webb Space Telescope has studied.",
    resolve: () => connected("space_telescope:james-webb-space-telescope", "studies", "out"),
  },
  {
    slug: "the-solar-system",
    title: "The Solar System",
    description: "The Sun, planets, and dwarf planets bound by the Sun's gravity.",
    resolve: () => connected("location:solar-system", "part_of", "in"),
  },
  {
    slug: "greek-mythology-of-the-sky",
    title: "Greek Mythology of the Sky",
    description: "Mythological figures linked to the constellations and the night sky.",
    resolve: () =>
      getAllGraphEntities()
        .filter((e) => e.type === "mythology_figure" || e.type === "mythology_story")
        .sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    slug: "deep-sky-objects",
    title: "Deep-Sky Objects",
    description: "Galaxies, nebulae, star clusters, and black holes beyond the Solar System.",
    resolve: () =>
      getAllGraphEntities()
        .filter((e) => ["galaxy", "nebula", "star_cluster", "black_hole"].includes(e.type))
        .sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    slug: "messier-objects",
    title: "Messier Objects",
    description: "The deep-sky objects of Charles Messier's catalogue.",
    resolve: () => connected("catalog:messier", "part_of", "in"),
  },
  {
    slug: "ngc-objects",
    title: "NGC Objects",
    description: "Selected objects from the New General Catalogue.",
    resolve: () => connected("catalog:ngc", "part_of", "in"),
  },
  {
    slug: "moons-of-uranus",
    title: "Moons of Uranus",
    description: "The major moons of Uranus, named for literary characters.",
    resolve: () => connected("planet:uranus", "child_of", "in"),
  },
  {
    slug: "launch-vehicles",
    title: "Launch Vehicles",
    description: "Rockets that carry missions to orbit and beyond.",
    resolve: () => getGraphEntitiesByType("launch_vehicle").sort((a, b) => a.name.localeCompare(b.name)),
  },
];

const RELATIONSHIP_BY_SLUG = new Map(RELATIONSHIP_PAGES.map((p) => [p.slug, p]));
export function getRelationshipPage(slug: string): RelationshipPage | undefined {
  return RELATIONSHIP_BY_SLUG.get(slug);
}

/* ---------------------------------------------------------- A–Z grouping */

export interface AlphaGroup {
  letter: string;
  entities: GraphEntity[];
}

/** Group entities alphabetically by first letter (non-letters under "#"). */
export function groupByInitial(entities: GraphEntity[]): AlphaGroup[] {
  const map = new Map<string, GraphEntity[]>();
  for (const e of [...entities].sort((a, b) => a.name.localeCompare(b.name))) {
    const first = e.name.replace(/^the\s+/i, "").charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(first) ? first : "#";
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(e);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, entities]) => ({ letter, entities }));
}
