import {
  getGraphEntitiesByType,
  type EntityType,
  type GraphEntity,
} from "@/knowledge-graph";
import { DATASET_VERSION, GRAPH_RELEASED } from "@/knowledge-graph/version";
import type { SourceKey } from "@/lib/sources";

/**
 * Public dataset registry.
 *
 * Datasets are VIEWS over the canonical knowledge graph — they are generated
 * from real typed entities, never fabricated, and never duplicate the graph
 * (they reference the same entities). Entity counts are computed live; checksums
 * are placeholders (published at release), not fabricated.
 */

export interface DatasetDef {
  slug: string;
  title: string;
  description: string;
  entityTypes: EntityType[];
  sources: SourceKey[];
}

const DATASET_DEFS: DatasetDef[] = [
  { slug: "stars", title: "Stars", description: "Named stars in the knowledge graph, with their constellations and connections.", entityTypes: ["star"], sources: ["iau", "nasa", "simbad"] },
  { slug: "planets", title: "Planets", description: "The eight planets of the Solar System.", entityTypes: ["planet"], sources: ["nasa", "jpl"] },
  { slug: "dwarf-planets", title: "Dwarf Planets", description: "Recognized dwarf planets.", entityTypes: ["dwarf_planet"], sources: ["nasa", "iau", "jpl"] },
  { slug: "moons", title: "Moons", description: "Natural satellites of the planets and dwarf planets.", entityTypes: ["moon"], sources: ["nasa", "jpl"] },
  { slug: "exoplanets", title: "Exoplanets", description: "Worlds orbiting other stars, and their host systems.", entityTypes: ["exoplanet"], sources: ["nasa", "esa"] },
  { slug: "galaxies", title: "Galaxies", description: "Galaxies in the knowledge graph.", entityTypes: ["galaxy"], sources: ["nasa", "esa", "ned"] },
  { slug: "nebulae", title: "Nebulae", description: "Interstellar clouds — emission, planetary, and supernova remnants.", entityTypes: ["nebula"], sources: ["nasa", "esa"] },
  { slug: "deep-sky-objects", title: "Deep-Sky Objects", description: "Galaxies, nebulae, clusters, and black holes beyond the Solar System.", entityTypes: ["galaxy", "nebula", "star_cluster", "black_hole"], sources: ["nasa", "esa", "noirlab", "ned"] },
  { slug: "constellations", title: "Constellations", description: "Constellations referenced across the graph.", entityTypes: ["constellation"], sources: ["iau"] },
  { slug: "comets", title: "Comets", description: "Comets of the Solar System.", entityTypes: ["comet"], sources: ["nasa", "mpc"] },
  { slug: "asteroids", title: "Asteroids", description: "Notable asteroids and small bodies.", entityTypes: ["asteroid"], sources: ["jpl", "mpc"] },
  { slug: "meteor-showers", title: "Meteor Showers", description: "Annual meteor showers and their radiants.", entityTypes: ["meteor_shower"], sources: ["imo", "nasa"] },
  { slug: "missions", title: "Space Missions", description: "Crewed and robotic missions of exploration.", entityTypes: ["space_mission"], sources: ["nasa", "esa", "jpl"] },
  { slug: "telescopes", title: "Space Telescopes", description: "Orbiting observatories.", entityTypes: ["space_telescope"], sources: ["nasa", "esa"] },
  { slug: "observatories", title: "Observatories", description: "Ground-based observatories.", entityTypes: ["observatory"], sources: ["noirlab", "eso", "nasa"] },
  { slug: "launch-vehicles", title: "Launch Vehicles", description: "Rockets that carry missions to orbit and beyond.", entityTypes: ["launch_vehicle"], sources: ["nasa", "esa"] },
  { slug: "rocket-families", title: "Rocket Families", description: "Multi-generation launch-vehicle lineages — Saturn, Atlas, Delta, Falcon, Ariane, Long March, and more.", entityTypes: ["rocket_family"], sources: ["nasa", "esa"] },
  { slug: "rocket-engines", title: "Rocket Engines", description: "The engines that power the world's rockets, by combustion cycle and propellant.", entityTypes: ["rocket_engine"], sources: ["nasa", "esa"] },
  { slug: "rocket-stages", title: "Rocket Stages", description: "First-class booster, core, and upper stages of flagship launch vehicles.", entityTypes: ["rocket_stage"], sources: ["nasa"] },
  { slug: "propellants", title: "Rocket Propellants", description: "Fuel and oxidizer combinations — kerolox, hydrolox, methalox, hypergolics, and solids.", entityTypes: ["propellant"], sources: ["nasa"] },
  { slug: "launch-pads", title: "Launch Pads", description: "The pads and complexes where rockets lift off, under their launch sites.", entityTypes: ["launch_pad"], sources: ["nasa"] },
  { slug: "space-agencies", title: "Space Agencies", description: "Agencies and institutions of spaceflight and astronomy.", entityTypes: ["organization"], sources: ["nasa", "esa"] },
  { slug: "astronomers", title: "Astronomers", description: "Astronomers whose work shaped our understanding of the sky.", entityTypes: ["astronomer"], sources: ["britannica", "iau"] },
  { slug: "satellites", title: "Satellites", description: "Individual artificial satellites — communications, navigation, Earth-observation, weather, and science.", entityTypes: ["satellite"], sources: ["nasa", "esa", "noaa"] },
  { slug: "satellite-constellations", title: "Satellite Constellations", description: "Multi-satellite systems, from GPS and Galileo to Starlink and OneWeb.", entityTypes: ["satellite_constellation"], sources: ["nasa", "esa", "gunters"] },
  { slug: "orbit-types", title: "Orbit Types", description: "The orbital regimes satellites use — LEO, MEO, GEO, sun-synchronous, polar, and highly elliptical.", entityTypes: ["orbit_type"], sources: ["nasa", "esa"] },
  { slug: "tracking-networks", title: "Tracking Networks", description: "Ground networks that communicate with satellites and deep-space missions.", entityTypes: ["tracking_network"], sources: ["nasa", "esa"] },
  { slug: "asteroid-families", title: "Asteroid Families", description: "Collisional families of asteroids sharing a common parent body.", entityTypes: ["asteroid_family"], sources: ["nasa", "jpl"] },
  { slug: "near-earth-objects", title: "Near-Earth Object Classes", description: "The Apollo, Aten, Amor, and Atira near-Earth orbital classes.", entityTypes: ["near_earth_object"], sources: ["nasa", "jpl"] },
  { slug: "minor-planet-populations", title: "Minor-Planet Populations", description: "Dynamical populations and orbital resonances — main belt, Hilda, Trojans, Kuiper Belt, and more.", entityTypes: ["minor_planet_group", "trojan_group", "orbital_resonance"], sources: ["nasa", "jpl"] },
  { slug: "impact-events", title: "Impact Events", description: "Well-studied terrestrial asteroid and meteoroid impact events.", entityTypes: ["impact_event"], sources: ["nasa"] },
  { slug: "comet-classes", title: "Comet Classes", description: "Dynamical classes of comets — Jupiter-family, Halley-type, long-period, sungrazing, and main-belt.", entityTypes: ["comet_class"], sources: ["nasa", "jpl"] },
  { slug: "comet-families", title: "Comet Families", description: "Genetic comet families, such as the Kreutz sungrazers.", entityTypes: ["comet_family"], sources: ["nasa"] },
  { slug: "small-body-reservoirs", title: "Small-Body Reservoirs", description: "Comet source reservoirs — the Oort cloud and inner Oort cloud.", entityTypes: ["small_body_reservoir"], sources: ["nasa"] },
  { slug: "comet-transition-objects", title: "Comet Transition Objects", description: "Objects blurring the asteroid–comet boundary: active asteroids and dormant comets.", entityTypes: ["active_asteroid", "dormant_comet"], sources: ["nasa", "jpl"] },
  { slug: "meteorites", title: "Meteorites", description: "Individual meteorites — chondrites, achondrites, irons, and stony-irons.", entityTypes: ["meteorite"], sources: ["nasa"] },
  { slug: "meteorite-classes", title: "Meteorite Classes", description: "The classes and groups of meteorites — chondrites, HED, martian, lunar, pallasites, and more.", entityTypes: ["meteorite_class", "meteorite_group"], sources: ["nasa"] },
  { slug: "fireballs", title: "Fireballs", description: "Bright meteors and bolides that entered the atmosphere.", entityTypes: ["fireball"], sources: ["nasa"] },
  { slug: "impact-structures", title: "Impact Structures", description: "Terrestrial impact craters left by past impacts.", entityTypes: ["impact_structure"], sources: ["nasa"] },
  { slug: "recovery-sites", title: "Recovery Sites", description: "Strewn fields where meteorite fragments are recovered.", entityTypes: ["recovery_site"], sources: ["nasa"] },
];

export interface Dataset extends DatasetDef {
  entityCount: number;
  version: string;
  lastGenerated: string;
  license: string;
  /** Placeholder — checksums are published at release, never fabricated. */
  checksum: string;
  formats: { format: string; href?: string; status: "available" | "planned" }[];
}

function build(def: DatasetDef): Dataset {
  return {
    ...def,
    entityCount: getDatasetEntities(def).length,
    version: DATASET_VERSION,
    lastGenerated: GRAPH_RELEASED,
    license: "CC BY-SA 4.0",
    checksum: "—", // placeholder; published at release
    formats: [
      { format: "JSON", href: `/datasets/${def.slug}/json`, status: "available" },
      { format: "CSV", href: `/datasets/${def.slug}/csv`, status: "available" },
      { format: "JSON-LD", href: `/data/graph.jsonld`, status: "available" },
      { format: "RDF / Turtle", status: "planned" },
      { format: "GraphQL", status: "planned" },
    ],
  };
}

export const DATASETS: Dataset[] = DATASET_DEFS.map(build);

const BY_SLUG = new Map(DATASETS.map((d) => [d.slug, d]));
export function getDataset(slug: string): Dataset | undefined {
  return BY_SLUG.get(slug);
}

export function getDatasetEntities(def: DatasetDef): GraphEntity[] {
  return def.entityTypes
    .flatMap((t) => getGraphEntitiesByType(t))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Plain-object rows for export (no graph data duplicated beyond this view). */
export function datasetRows(def: DatasetDef) {
  return getDatasetEntities(def).map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    domain: e.domain,
    description: e.description ?? "",
    entryPath: e.entryPath ?? "",
  }));
}

/** Serialize dataset rows to CSV (RFC-4180-ish escaping). */
export function datasetToCsv(def: DatasetDef): string {
  const rows = datasetRows(def);
  const headers = ["id", "name", "type", "domain", "description", "entryPath"];
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => escape((r as Record<string, string>)[h])).join(","));
  }
  return lines.join("\n");
}
