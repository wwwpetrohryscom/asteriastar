import {
  CONCEPT_RECORDS,
  CONCEPT_BY_SLUG,
  REUSED_CONCEPTS,
  themes,
  concepts,
  type ConceptRecord,
  type ConceptStatus,
} from "@/knowledge-graph/data/future-missions-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Future Missions Engine — resolver and query surface for the Future Space Exploration &
 * Mission Concepts Encyclopedia (engine.futureMissions). Pure, deterministic, framework-free.
 * It resolves the theme and mission-concept entities and REUSES the in-development missions,
 * agencies, and target bodies via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: ConceptRecord, b: ConceptRecord) => a.name.localeCompare(b.name);

export interface ResolvedConcept {
  record: ConceptRecord;
  theme?: Ref; // for a concept: its theme
  agency?: Ref; // for a concept: the reused agency
  target?: Ref; // for a concept: the reused target body
  related: Ref[]; // other reused entities it concerns
  members: ConceptRecord[]; // for a theme: its new mission concepts
  reusedMembers: Ref[]; // for a theme: the reused in-development missions in it
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: ConceptRecord): ResolvedConcept {
  const entity = getEntityById(r.id);
  const reusedMembers = r.kind === "theme"
    ? REUSED_CONCEPTS.filter((rc) => rc.themeSlug === r.slug).map((rc) => refFromId(rc.id)).filter(Boolean) as Ref[]
    : [];
  return {
    record: r,
    theme: r.kind === "concept" ? refFromId(`exploration_theme:${r.themeSlug}`) : undefined,
    agency: refFromId(r.agencyKey),
    target: refFromId(r.targetKey),
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "theme" ? concepts.filter((x) => x.themeSlug === r.slug).sort(byName) : [],
    reusedMembers,
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const futureMissionsEngine = {
  count: CONCEPT_RECORDS.length,
  conceptCount: concepts.length,
  all: (): ConceptRecord[] => CONCEPT_RECORDS.slice(),
  get: (slug: string): ConceptRecord | undefined => CONCEPT_BY_SLUG.get(slug),
  themes: (): ConceptRecord[] => themes.slice(),
  conceptsList: (): ConceptRecord[] => concepts.slice().sort(byName),
  byTheme: (themeSlug: string): ConceptRecord[] => concepts.filter((x) => x.themeSlug === themeSlug).sort(byName),
  byStatus: (s: ConceptStatus): ConceptRecord[] => concepts.filter((x) => x.status === s).sort(byName),
  /** The full membership of a theme — new concepts plus the reused in-development missions. */
  memberSet: (themeSlug: string): { records: ConceptRecord[]; reused: Ref[]; count: number } => {
    const records = concepts.filter((x) => x.themeSlug === themeSlug).sort(byName);
    const reused = REUSED_CONCEPTS.filter((rc) => rc.themeSlug === themeSlug).map((rc) => refFromId(rc.id)).filter(Boolean) as Ref[];
    return { records, reused, count: records.length + reused.length };
  },
  resolveEntry: (slug: string): ResolvedConcept | null => {
    const r = CONCEPT_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
