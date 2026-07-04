import {
  INST_RECORDS,
  INST_BY_SLUG,
  institutionTypes,
  institutions,
  membersOfTypes,
  type InstRecord,
} from "@/knowledge-graph/data/institutions-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Institutions Engine — resolver and query surface for the Space Agencies, Institutions &
 * Laboratories Encyclopedia (engine.institutions). Pure, deterministic, framework-free. It
 * resolves the institution-type and new field-center/laboratory entities and REUSES the
 * existing agencies, commercial companies, and observatory operators via the graph, creating
 * and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: Ref, b: Ref) => a.name.localeCompare(b.name, "en", { numeric: true });

export interface ResolvedInstitution {
  record: InstRecord;
  instType?: Ref; // for an org: its institution type
  parent?: Ref; // for an org: the agency it is part_of
  children: Ref[]; // for an org: the centers/labs part_of it
  related: Ref[];
  members: InstRecord[]; // for a type: the new field centers/labs of it
  reusedMembers: Ref[]; // for a type: the existing orgs linked to it
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

const NEW_ORG_IDS = new Set(institutions.map((o) => o.id));

function resolveRecord(r: InstRecord): ResolvedInstitution {
  const entity = getEntityById(r.id);
  const conns = getConnectionsByDomain(r.id);
  const reusedMembers = r.kind === "type"
    ? conns.science
        .filter((c) => !c.outgoing && c.relation.type === "member_of_group" && !NEW_ORG_IDS.has(c.other.id))
        .map((c) => ({ id: c.other.id, name: c.other.name, href: entityGraphPath(c.other) }))
        .sort(byName)
    : [];
  const children = r.kind === "org"
    ? conns.science
        .filter((c) => !c.outgoing && c.relation.type === "part_of")
        .map((c) => ({ id: c.other.id, name: c.other.name, href: entityGraphPath(c.other) }))
        .sort(byName)
    : [];
  return {
    record: r,
    instType: r.kind === "org" ? refFromId(`institution_type:${r.typeSlug}`) : undefined,
    parent: r.kind === "org" ? refFromId(r.parentKey) : undefined,
    children,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "type" ? institutions.filter((o) => o.typeSlug === r.slug).sort((a, b) => a.name.localeCompare(b.name)) : [],
    reusedMembers,
    connections: conns,
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const institutionsEngine = {
  count: INST_RECORDS.length,
  orgCount: institutions.length,
  all: (): InstRecord[] => INST_RECORDS.slice(),
  get: (slug: string): InstRecord | undefined => INST_BY_SLUG.get(slug),
  types: (): InstRecord[] => institutionTypes.slice(),
  orgs: (): InstRecord[] => institutions.slice().sort((a, b) => a.name.localeCompare(b.name)),
  byType: (typeSlug: string): InstRecord[] => institutions.filter((o) => o.typeSlug === typeSlug).sort((a, b) => a.name.localeCompare(b.name)),
  /** The full membership of a set of types — new field centers/labs plus the reused orgs. */
  memberSet: (typeSlugs: string[]): { records: InstRecord[]; reused: Ref[]; count: number } => {
    const { records, reusedIds } = membersOfTypes(typeSlugs);
    const reused = (reusedIds.map((id) => refFromId(id)).filter(Boolean) as Ref[]).sort(byName);
    return { records, reused, count: records.length + reused.length };
  },
  resolveEntry: (slug: string): ResolvedInstitution | null => {
    const r = INST_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
