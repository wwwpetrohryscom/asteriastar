import {
  relations,
  getEntityById,
  getGraphEntitiesByType,
  type GraphEntity,
  type EntityType,
  type RelationType,
} from "@/knowledge-graph";

/**
 * Scientific Query Engine — reusable, graph-derived queries. Every query reads
 * the live graph (no hardcoded lists, no fabricated data). Where a useful query
 * would require measurement data the graph does not yet hold (brightness,
 * distance, size), it is declared UNSUPPORTED rather than faked.
 */

export interface ScientificQuery {
  id: string;
  label: string;
  description: string;
  /** Honest explanation of how results are derived. */
  derivedFrom: string;
  run: () => GraphEntity[];
}

export interface QueryResult {
  id: string;
  label: string;
  description: string;
  derivedFrom: string;
  entities: GraphEntity[];
  count: number;
}

const byName = (a: GraphEntity, b: GraphEntity) => a.name.localeCompare(b.name);

function byType(...types: EntityType[]): GraphEntity[] {
  return types.flatMap((t) => getGraphEntitiesByType(t)).sort(byName);
}

/** Entities that are the SOURCE of `type` relations pointing at `targetId`. */
function sourcesOf(type: RelationType, targetId: string): GraphEntity[] {
  return relations
    .filter((r) => r.type === type && r.to === targetId)
    .map((r) => getEntityById(r.from))
    .filter((e): e is GraphEntity => Boolean(e))
    .sort(byName);
}

/** Entities that are the TARGET of `type` relations originating at `sourceId`. */
function targetsOf(type: RelationType, sourceId: string): GraphEntity[] {
  return relations
    .filter((r) => r.type === type && r.from === sourceId)
    .map((r) => getEntityById(r.to))
    .filter((e): e is GraphEntity => Boolean(e))
    .sort(byName);
}

/** Entities that appear as the SOURCE of any relation of a given type. */
function anySourceOf(type: RelationType): GraphEntity[] {
  const ids = new Set(relations.filter((r) => r.type === type).map((r) => r.from));
  return [...ids].map((id) => getEntityById(id)).filter((e): e is GraphEntity => Boolean(e)).sort(byName);
}

export const QUERIES: ScientificQuery[] = [
  { id: "planets", label: "Planets", description: "The planets of the Solar System.", derivedFrom: "entity type = planet", run: () => byType("planet") },
  { id: "moons", label: "Moons", description: "Natural satellites in the graph.", derivedFrom: "entity type = moon", run: () => byType("moon") },
  { id: "moons-of-jupiter", label: "Moons of Jupiter", description: "Natural satellites of Jupiter.", derivedFrom: "child_of → planet:jupiter", run: () => sourcesOf("child_of", "planet:jupiter") },
  { id: "moons-of-saturn", label: "Moons of Saturn", description: "Natural satellites of Saturn.", derivedFrom: "child_of → planet:saturn", run: () => sourcesOf("child_of", "planet:saturn") },
  { id: "galaxies", label: "Galaxies", description: "Galaxies in the graph.", derivedFrom: "entity type = galaxy", run: () => byType("galaxy") },
  { id: "nebulae", label: "Nebulae", description: "Interstellar clouds.", derivedFrom: "entity type = nebula", run: () => byType("nebula") },
  { id: "deep-sky-objects", label: "Deep-sky objects", description: "Galaxies, nebulae, clusters, and black holes.", derivedFrom: "entity types = galaxy, nebula, star_cluster, black_hole", run: () => byType("galaxy", "nebula", "star_cluster", "black_hole") },
  { id: "constellations", label: "Constellations", description: "Constellations referenced in the graph.", derivedFrom: "entity type = constellation", run: () => byType("constellation") },
  { id: "studied-by-jwst", label: "Objects studied by JWST", description: "Objects the James Webb Space Telescope studies.", derivedFrom: "studies ← space_telescope:james-webb-space-telescope", run: () => targetsOf("studies", "space_telescope:james-webb-space-telescope") },
  { id: "studied-by-hubble", label: "Objects studied by Hubble", description: "Objects the Hubble Space Telescope studies.", derivedFrom: "studies ← space_telescope:hubble-space-telescope", run: () => targetsOf("studies", "space_telescope:hubble-space-telescope") },
  { id: "space-telescopes", label: "Space telescopes", description: "Orbiting observatories.", derivedFrom: "entity type = space_telescope", run: () => byType("space_telescope") },
  { id: "observatories", label: "Observatories", description: "Ground-based observatories.", derivedFrom: "entity type = observatory", run: () => byType("observatory") },
  { id: "space-missions", label: "Space missions", description: "Crewed and robotic missions.", derivedFrom: "entity type = space_mission", run: () => byType("space_mission") },
  { id: "missions-to-mars", label: "Missions to Mars", description: "Missions that targeted Mars.", derivedFrom: "mission_target → planet:mars", run: () => sourcesOf("mission_target", "planet:mars") },
  { id: "astronomers", label: "Astronomers", description: "Astronomers in the graph.", derivedFrom: "entity type = astronomer", run: () => byType("astronomer") },
  { id: "discovered-objects", label: "Objects with a known discoverer", description: "Objects linked to who discovered them.", derivedFrom: "any discovered_by relation (source)", run: () => anySourceOf("discovered_by") },
];

/** Queries that are intentionally NOT implemented because they need measurement
 * data the graph does not yet hold — declared rather than fabricated. */
export const UNSUPPORTED_QUERIES = [
  { id: "brightest-stars", label: "Brightest stars", requires: "apparent/absolute magnitude" },
  { id: "nearest-stars", label: "Nearest stars", requires: "parallax / distance" },
  { id: "largest-galaxies", label: "Largest galaxies", requires: "angular/physical size" },
  { id: "planets-with-rings", label: "Planets with rings", requires: "a ring-system attribute or relation" },
  { id: "astronomers-from-italy", label: "Astronomers from Italy", requires: "a nationality attribute" },
];

const BY_ID = new Map(QUERIES.map((q) => [q.id, q]));

export const queryEngine = {
  all: (): ScientificQuery[] => QUERIES,
  get: (id: string): ScientificQuery | undefined => BY_ID.get(id),
  run(id: string): QueryResult | null {
    const q = BY_ID.get(id);
    if (!q) return null;
    const entities = q.run();
    return { id: q.id, label: q.label, description: q.description, derivedFrom: q.derivedFrom, entities, count: entities.length };
  },
  unsupported: () => UNSUPPORTED_QUERIES,
};
