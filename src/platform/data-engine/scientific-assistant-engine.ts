import {
  BS_RECORDS,
  BS_BY_SLUG,
  capabilities,
  type AssistantRecord,
} from "@/knowledge-graph/data/scientific-assistant-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";
import { explainEntity, evidenceChain, compareConcepts, relatedConcepts, scientificSearch } from "@/lib/assistant/retrieval";

/**
 * Scientific Assistant Engine — resolver and grounded-retrieval surface for the Scientific AI
 * Research Assistant (engine.scientificAssistant). It resolves the assistant-capability entities AND
 * exposes the real, grounded retrieval — search, explanation, comparison, evidence chains, related
 * concepts — that runs over the actual knowledge graph. It surfaces only facts already in the graph,
 * with their provenance; there is no language model here and nothing is generated or invented.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: AssistantRecord, b: AssistantRecord) => a.name.localeCompare(b.name);

export interface ResolvedAssistant {
  record: AssistantRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: AssistantRecord): ResolvedAssistant {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BS_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const scientificAssistantEngine = {
  count: BS_RECORDS.length,
  groundedCount: capabilities.filter((c) => c.grounding === "grounded").length,
  all: (): AssistantRecord[] => BS_RECORDS.slice().sort(byName),
  get: (slug: string): AssistantRecord | undefined => BS_BY_SLUG.get(slug),
  grounded: (): AssistantRecord[] => BS_RECORDS.filter((r) => r.grounding === "grounded").sort(byName),
  architecture: (): AssistantRecord[] => BS_RECORDS.filter((r) => r.grounding === "architecture").sort(byName),
  resolveEntry: (slug: string): ResolvedAssistant | null => {
    const r = BS_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
  // Real grounded retrieval over the actual graph — surfaces only real facts.
  explain: explainEntity,
  evidenceChain,
  compare: compareConcepts,
  related: relatedConcepts,
  search: scientificSearch,
};
