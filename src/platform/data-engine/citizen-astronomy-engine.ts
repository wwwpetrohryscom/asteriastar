import {
  AY_RECORDS,
  AY_BY_SLUG,
  projects,
  activities,
  equipment,
  outreach,
  organizations,
  type CitizenRecord,
} from "@/knowledge-graph/data/citizen-astronomy-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Citizen Astronomy Engine — resolver and query surface for the Citizen Science, Amateur Astronomy
 * & Public Observing Encyclopedia (engine.citizenAstronomy). Pure, deterministic, framework-free.
 * It resolves the citizen-science-project, amateur-activity, observing-equipment, outreach-activity,
 * and amateur-organisation entities and REUSES the aurora, the occultation and photometry methods,
 * the meteor showers and constellations, the eruptive-variable-star class, the Stardust mission,
 * the transit method, the galaxy-morphology-classification application, the Rubin Observatory, and
 * the MAST archive via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: CitizenRecord, b: CitizenRecord) => a.name.localeCompare(b.name);

export interface ResolvedCitizen {
  record: CitizenRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other AY entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: CitizenRecord): ResolvedCitizen {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: AY_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const citizenAstronomyEngine = {
  count: AY_RECORDS.length,
  projectCount: projects.length,
  all: (): CitizenRecord[] => AY_RECORDS.slice(),
  get: (slug: string): CitizenRecord | undefined => AY_BY_SLUG.get(slug),
  projects: (): CitizenRecord[] => projects.slice().sort(byName),
  activities: (): CitizenRecord[] => activities.slice().sort(byName),
  equipment: (): CitizenRecord[] => equipment.slice().sort(byName),
  outreach: (): CitizenRecord[] => outreach.slice().sort(byName),
  organizations: (): CitizenRecord[] => organizations.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedCitizen | null => {
    const r = AY_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
