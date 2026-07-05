import {
  AB_RECORDS,
  AB_BY_SLUG,
  topics,
  biosignatures,
  factors,
  protection,
  type AstrobiologyRecord,
} from "@/knowledge-graph/data/astrobiology-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Astrobiology Engine — resolver and query surface for the Astrobiology, Biosignatures & Search
 * for Life Encyclopedia (engine.astrobiology). Pure, deterministic, framework-free. It resolves
 * the discipline, biosignature, habitability-factor, and planetary-protection entities and REUSES
 * the ocean-world moons, Mars, the habitable-zone concept, SETI, and the life-search missions via
 * the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: AstrobiologyRecord, b: AstrobiologyRecord) => a.name.localeCompare(b.name);
const NON_TOPIC = [...biosignatures, ...factors, ...protection];

export interface ResolvedAstrobiology {
  record: AstrobiologyRecord;
  topic?: Ref; // for a non-topic: its discipline
  related: Ref[]; // reused entities it concerns
  members: AstrobiologyRecord[]; // for a discipline: its biosignatures, factors, and measures
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: AstrobiologyRecord): ResolvedAstrobiology {
  const entity = getEntityById(r.id);
  return {
    record: r,
    topic: r.kind === "topic" ? undefined : refFromId(`astrobiology_topic:${r.topicSlug}`),
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "topic" ? NON_TOPIC.filter((x) => x.topicSlug === r.slug).sort(byName) : [],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const astrobiologyEngine = {
  count: AB_RECORDS.length,
  biosignatureCount: biosignatures.length,
  all: (): AstrobiologyRecord[] => AB_RECORDS.slice(),
  get: (slug: string): AstrobiologyRecord | undefined => AB_BY_SLUG.get(slug),
  topics: (): AstrobiologyRecord[] => topics.slice(),
  biosignatures: (): AstrobiologyRecord[] => biosignatures.slice().sort(byName),
  factors: (): AstrobiologyRecord[] => factors.slice().sort(byName),
  protection: (): AstrobiologyRecord[] => protection.slice().sort(byName),
  byTopic: (topicSlug: string): AstrobiologyRecord[] => NON_TOPIC.filter((x) => x.topicSlug === topicSlug).sort(byName),
  resolveEntry: (slug: string): ResolvedAstrobiology | null => {
    const r = AB_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
