import {
  INFRA_RECORDS,
  INFRA_BY_SLUG,
  domains,
  isruTechniques,
  manufacturingProcesses,
  infrastructures,
  type InfraRecord,
  type Maturity,
} from "@/knowledge-graph/data/space-infrastructure-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Space Infrastructure Engine — resolver and query surface for the Space Manufacturing &
 * In-Space Infrastructure Encyclopedia (engine.spaceInfrastructure). Pure, deterministic,
 * framework-free. It resolves the domain, ISRU-technique, manufacturing-process, and
 * infrastructure entities and REUSES the bodies, stations, propellants, and components via
 * the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: InfraRecord, b: InfraRecord) => a.name.localeCompare(b.name);
const ITEMS = [...isruTechniques, ...manufacturingProcesses, ...infrastructures];

export interface ResolvedInfrastructure {
  record: InfraRecord;
  domain?: Ref; // for a non-domain: its domain
  related: Ref[]; // reused entities it concerns
  members: InfraRecord[]; // for a domain: its techniques, processes, and systems
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: InfraRecord): ResolvedInfrastructure {
  const entity = getEntityById(r.id);
  return {
    record: r,
    domain: r.kind === "domain" ? undefined : refFromId(`infrastructure_domain:${r.domainSlug}`),
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "domain" ? ITEMS.filter((x) => x.domainSlug === r.slug).sort(byName) : [],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const spaceInfrastructureEngine = {
  count: INFRA_RECORDS.length,
  itemCount: ITEMS.length,
  all: (): InfraRecord[] => INFRA_RECORDS.slice(),
  get: (slug: string): InfraRecord | undefined => INFRA_BY_SLUG.get(slug),
  domains: (): InfraRecord[] => domains.slice(),
  isru: (): InfraRecord[] => isruTechniques.slice().sort(byName),
  manufacturing: (): InfraRecord[] => manufacturingProcesses.slice().sort(byName),
  infrastructure: (): InfraRecord[] => infrastructures.slice().sort(byName),
  byDomain: (domainSlug: string): InfraRecord[] => ITEMS.filter((x) => x.domainSlug === domainSlug).sort(byName),
  byMaturity: (m: Maturity): InfraRecord[] => ITEMS.filter((x) => x.maturity === m).sort(byName),
  resolveEntry: (slug: string): ResolvedInfrastructure | null => {
    const r = INFRA_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
