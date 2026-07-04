import {
  INST_RECORDS,
  INST_BY_SLUG,
  classes,
  instruments,
  type InstCategory,
  type InstRecord,
} from "@/knowledge-graph/data/instruments-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Instruments Engine — resolver and query surface for the Scientific Instruments & Payloads
 * Encyclopedia (engine.instruments). Pure, deterministic, framework-free. It resolves the
 * instrument-class and new-instrument entities and REUSES the host missions and the existing
 * scientific_instrument entities via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: InstRecord, b: InstRecord) => a.name.localeCompare(b.name, "en", { numeric: true });

export interface ResolvedInstrument {
  record: InstRecord;
  instrumentClass?: Ref;
  hosts: Ref[];
  members: InstRecord[]; // for a class: the new instruments in it
  reusedMembers: Ref[]; // for a class: the existing instruments linked to it (via the graph)
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: InstRecord): ResolvedInstrument {
  const entity = getEntityById(r.id);
  const conns = getConnectionsByDomain(r.id);
  // For a class: existing instruments linked in via member_of_group (incoming) that are not
  // in this catalog's new-instrument set.
  const newSlugs = new Set(instruments.map((i) => i.slug));
  const reusedMembers = r.kind === "class"
    ? conns.science.filter((c) => !c.outgoing && c.relation.type === "member_of_group" && !newSlugs.has(c.other.id.split(":")[1]))
        .map((c) => ({ id: c.other.id, name: c.other.name, href: entityGraphPath(c.other) }))
    : [];
  return {
    record: r,
    instrumentClass: r.kind === "instrument" ? refFromId(`instrument_class:${r.classSlug}`) : undefined,
    hosts: (r.hostKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "class" ? instruments.filter((i) => i.classSlug === r.slug).sort(byName) : [],
    reusedMembers,
    connections: conns,
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const instrumentsEngine = {
  count: INST_RECORDS.length,
  newInstrumentCount: instruments.length,
  all: (): InstRecord[] => INST_RECORDS.slice(),
  get: (slug: string): InstRecord | undefined => INST_BY_SLUG.get(slug),
  classes: (): InstRecord[] => classes.slice(),
  instruments: (): InstRecord[] => instruments.slice().sort(byName),
  byClass: (classSlug: string): InstRecord[] => instruments.filter((i) => i.classSlug === classSlug).sort(byName),
  byCategory: (c: InstCategory): InstRecord[] => INST_RECORDS.filter((r) => r.category === c).sort(byName),
  resolveEntry: (slug: string): ResolvedInstrument | null => {
    const r = INST_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
