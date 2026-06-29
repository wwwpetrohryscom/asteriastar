import {
  getEntityById,
  getGraphEntityByTypeSlug,
  getConnections,
  getConnectionsByDomain,
  getRelatedEntities,
  getRecommendations,
  getRelationsForEntity,
  entityGraphPath,
  ENTITY_TYPE_LABELS,
  DOMAIN_LABELS,
  GRAPH_VERSION_INFO,
  type GraphEntity,
  type EntityType,
  type EntityDomain,
  type Connection,
  type Recommendation,
} from "@/knowledge-graph";
import { getSources, type Source } from "@/lib/sources";
import { getImagesForEntity } from "@/lib/media/registry";
import type { ImageAsset } from "@/lib/media/types";
import { DATASETS, type Dataset } from "@/lib/datasets";
import { getEntriesForEntity } from "@/content/entries";
import type { Entry } from "@/lib/content/entry-types";
import { LEARNING_PATHS, type LearningPath } from "@/lib/learn";
import { TIMELINES, type Timeline } from "@/lib/timelines";
import { TOPICS, getTopicEntities, type Topic } from "@/lib/discovery";
import {
  getLocalizedEntity,
  DEFAULT_LOCALE,
  type LocaleCode,
  type LocalizedEntity,
} from "@/platform/localization";

/**
 * Entity Runtime — the platform's single abstraction for "everything about an
 * entity". Every client (website, future mobile/desktop/API/AI) resolves an
 * entity through this runtime instead of re-querying each subsystem. The website
 * is just one view; the runtime is the reality behind it.
 *
 * Membership across subsystems (datasets, timelines, learning paths, topics) is
 * indexed once at module load, so resolving an entity is O(1) lookups.
 */

// ----------------------------------------------------------- membership indexes

const TIMELINES_BY_PATH = new Map<string, Timeline[]>();
for (const t of TIMELINES) {
  for (const ev of t.events) {
    if (!ev.href) continue;
    const list = TIMELINES_BY_PATH.get(ev.href) ?? [];
    if (!list.includes(t)) list.push(t);
    TIMELINES_BY_PATH.set(ev.href, list);
  }
}

const LEARNING_BY_PATH = new Map<string, LearningPath[]>();
for (const p of LEARNING_PATHS) {
  for (const stage of p.stages) {
    for (const step of stage.steps) {
      const list = LEARNING_BY_PATH.get(step.href) ?? [];
      if (!list.includes(p)) list.push(p);
      LEARNING_BY_PATH.set(step.href, list);
    }
  }
}

const TOPICS_BY_ENTITY = new Map<string, Topic[]>();
for (const topic of TOPICS) {
  for (const e of getTopicEntities(topic)) {
    const list = TOPICS_BY_ENTITY.get(e.id) ?? [];
    list.push(topic);
    TOPICS_BY_ENTITY.set(e.id, list);
  }
}

// ------------------------------------------------------------------- the runtime

export type EntityStatus = "documented" | "graph";

export interface RuntimeEntity {
  // Identity (stable, language-independent)
  id: string;
  type: EntityType;
  typeLabel: string;
  domain: EntityDomain;
  domainLabel: string;
  status: EntityStatus;
  name: string;
  aliases: string[];
  description?: string;
  scientificName?: string;
  catalogNumbers: string[];
  importance?: number;
  // Access
  canonicalPath: string;
  // Relationships
  relationCount: number;
  connections: Connection[];
  connectionsByDomain: ReturnType<typeof getConnectionsByDomain>;
  related: GraphEntity[];
  recommendations: Recommendation[];
  // Provenance & media
  sources: Source[];
  images: ImageAsset[];
  // Knowledge & discovery
  entries: Entry[];
  primaryEntry?: Entry;
  datasets: Dataset[];
  timelines: Timeline[];
  learningPaths: LearningPath[];
  topics: Topic[];
  // Versioning & localization
  version: typeof GRAPH_VERSION_INFO;
  locale: LocaleCode;
  localized: LocalizedEntity;
}

export interface ResolveOptions {
  locale?: LocaleCode;
}

/** Resolve a stable entity id into the unified runtime view. */
export function resolveEntity(id: string, opts: ResolveOptions = {}): RuntimeEntity | null {
  const entity = getEntityById(id);
  if (!entity) return null;
  return assemble(entity, opts.locale ?? DEFAULT_LOCALE);
}

/** Resolve by split id segments (the route shape `type:slug`). */
export function resolveEntityByTypeSlug(
  type: string,
  slug: string,
  opts: ResolveOptions = {},
): RuntimeEntity | null {
  const entity = getGraphEntityByTypeSlug(type, slug);
  if (!entity) return null;
  return assemble(entity, opts.locale ?? DEFAULT_LOCALE);
}

function assemble(entity: GraphEntity, locale: LocaleCode): RuntimeEntity {
  const canonicalPath = entityGraphPath(entity);
  const entries = getEntriesForEntity(entity.id);
  const datasets = DATASETS.filter((d) => d.entityTypes.includes(entity.type));
  const timelines = [
    ...new Set([
      ...(TIMELINES_BY_PATH.get(canonicalPath) ?? []),
      ...(entity.entryPath ? TIMELINES_BY_PATH.get(entity.entryPath) ?? [] : []),
    ]),
  ];
  const learningPaths = [
    ...new Set([
      ...(LEARNING_BY_PATH.get(canonicalPath) ?? []),
      ...(entity.entryPath ? LEARNING_BY_PATH.get(entity.entryPath) ?? [] : []),
    ]),
  ];

  return {
    id: entity.id,
    type: entity.type,
    typeLabel: ENTITY_TYPE_LABELS[entity.type],
    domain: entity.domain,
    domainLabel: DOMAIN_LABELS[entity.domain] ?? entity.domain,
    status: entries.length > 0 ? "documented" : "graph",
    name: entity.name,
    aliases: entity.aliases ?? [],
    description: entity.description,
    scientificName: entity.scientificName,
    catalogNumbers: entity.catalogNumbers ?? [],
    importance: entity.importance,
    canonicalPath,
    relationCount: getRelationsForEntity(entity.id).length,
    connections: getConnections(entity.id),
    connectionsByDomain: getConnectionsByDomain(entity.id),
    related: getRelatedEntities(entity.id),
    recommendations: getRecommendations(entity.id),
    sources: entity.sources ? getSources(entity.sources) : [],
    images: getImagesForEntity(entity.id),
    entries,
    primaryEntry: entries[0],
    datasets,
    timelines,
    learningPaths,
    topics: TOPICS_BY_ENTITY.get(entity.id) ?? [],
    version: GRAPH_VERSION_INFO,
    locale,
    localized: getLocalizedEntity(entity, locale),
  };
}
