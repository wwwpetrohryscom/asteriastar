import {
  MED_RECORDS,
  MED_BY_SLUG,
  topics,
  effects,
  technologies,
  countermeasures,
  type MedRecord,
} from "@/knowledge-graph/data/space-medicine-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Space Medicine Engine — resolver and query surface for the Life Support, Space Biology &
 * Space Medicine Encyclopedia (engine.spaceMedicine). Pure, deterministic, framework-free. It
 * resolves the discipline, effect, technology, and countermeasure entities and REUSES the
 * ECLSS system, radiation environments, stations, and astronauts via the graph, creating and
 * fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: MedRecord, b: MedRecord) => a.name.localeCompare(b.name);
const NON_TOPIC = [...effects, ...technologies, ...countermeasures];

export interface ResolvedMed {
  record: MedRecord;
  topic?: Ref; // for a non-topic: the discipline it belongs to
  eclss?: Ref; // for a technology: the reused ECLSS system it is part of
  mitigates: Ref[]; // for a countermeasure: the effects it mitigates
  mitigatedBy: Ref[]; // for an effect: the countermeasures that mitigate it
  related: Ref[]; // reused entities it concerns
  members: MedRecord[]; // for a discipline: its effects, technologies, and countermeasures
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: MedRecord): ResolvedMed {
  const entity = getEntityById(r.id);
  const mitigates = r.kind === "countermeasure"
    ? (r.mitigatesSlugs ?? []).map((s) => refFromId(`physiological_effect:${s}`)).filter(Boolean) as Ref[]
    : [];
  const mitigatedBy = r.kind === "effect"
    ? countermeasures.filter((c) => (c.mitigatesSlugs ?? []).includes(r.slug)).map((c) => refFromId(c.id)).filter(Boolean) as Ref[]
    : [];
  return {
    record: r,
    topic: r.kind === "topic" ? undefined : refFromId(`space_biology_topic:${r.topicSlug}`),
    eclss: r.kind === "technology" && r.partOfEclss ? refFromId("life_support_system:eclss") : undefined,
    mitigates,
    mitigatedBy,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "topic" ? NON_TOPIC.filter((x) => x.topicSlug === r.slug).sort(byName) : [],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const spaceMedicineEngine = {
  count: MED_RECORDS.length,
  effectCount: effects.length,
  all: (): MedRecord[] => MED_RECORDS.slice(),
  get: (slug: string): MedRecord | undefined => MED_BY_SLUG.get(slug),
  topics: (): MedRecord[] => topics.slice(),
  effects: (): MedRecord[] => effects.slice().sort(byName),
  technologies: (): MedRecord[] => technologies.slice().sort(byName),
  countermeasuresList: (): MedRecord[] => countermeasures.slice().sort(byName),
  byTopic: (topicSlug: string): MedRecord[] => NON_TOPIC.filter((x) => x.topicSlug === topicSlug).sort(byName),
  resolveEntry: (slug: string): ResolvedMed | null => {
    const r = MED_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
