import {
  TIMELINE_RECORDS,
  TIMELINE_BY_SLUG,
  eras,
  events,
  milestones,
  records,
  type TimelineRecord,
  type TimelineCategory,
} from "@/knowledge-graph/data/spaceflight-history-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Spaceflight History Engine — resolver and query surface for the Space Missions Timeline &
 * Historical Events Encyclopedia (engine.spaceflightHistory). Pure, deterministic,
 * framework-free. It resolves the era, event, milestone, and record entities and REUSES the
 * missions, programs, astronauts, organizations, stations, telescopes, and bodies via the
 * graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byYear = (a: TimelineRecord, b: TimelineRecord) => (a.year ?? 0) - (b.year ?? 0) || a.name.localeCompare(b.name);
const DATED = [...events, ...milestones];

export interface ResolvedTimeline {
  record: TimelineRecord;
  era?: Ref; // for an event/milestone/record: the era it is part_of
  related: Ref[]; // reused entities it concerns
  members: TimelineRecord[]; // for an era: the events & milestones within it, chronological
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: TimelineRecord): ResolvedTimeline {
  const entity = getEntityById(r.id);
  const relatedIds = [...(r.relatedKeys ?? []), ...(r.bodyKey ? [r.bodyKey] : [])];
  return {
    record: r,
    era: r.kind === "era" ? undefined : refFromId(r.eraSlug ? `historic_space_event:${r.eraSlug}` : undefined),
    related: relatedIds.map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "era" ? DATED.filter((x) => x.eraSlug === r.slug).sort(byYear) : [],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const spaceflightHistoryEngine = {
  count: TIMELINE_RECORDS.length,
  eventCount: events.length,
  all: (): TimelineRecord[] => TIMELINE_RECORDS.slice(),
  get: (slug: string): TimelineRecord | undefined => TIMELINE_BY_SLUG.get(slug),
  eras: (): TimelineRecord[] => eras.slice().sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
  events: (): TimelineRecord[] => events.slice().sort(byYear),
  milestones: (): TimelineRecord[] => milestones.slice().sort(byYear),
  recordsList: (): TimelineRecord[] => records.slice(),
  /** All dated events and milestones, chronological — the master timeline. */
  timeline: (): TimelineRecord[] => DATED.slice().sort(byYear),
  byEra: (eraSlug: string): TimelineRecord[] => DATED.filter((x) => x.eraSlug === eraSlug).sort(byYear),
  byCategory: (c: TimelineCategory): TimelineRecord[] => DATED.filter((x) => x.category === c).sort(byYear),
  resolveEntry: (slug: string): ResolvedTimeline | null => {
    const r = TIMELINE_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
