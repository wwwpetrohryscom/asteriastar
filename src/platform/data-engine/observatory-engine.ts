import {
  OBS_RECORDS,
  OBS_BY_ID,
  OBS_BY_SLUG,
  OBS_BY_KIND,
} from "@/knowledge-graph/data/observatory-catalog";
import { KIND_LABEL, KIND_PLURAL, type ObsKind, type ObsRecord } from "@/knowledge-graph/data/observatory-catalog/types";
import { getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Observatory Engine — resolver and query surface for the observatories &
 * telescopes encyclopedia. Pure, deterministic, framework-independent.
 */

const EXTERNAL_NAMES: Record<string, string> = {
  "organization:nasa": "NASA", "organization:esa": "ESA", "organization:jaxa": "JAXA",
  "organization:cnsa": "CNSA", "organization:csa": "CSA",
};

function refName(id: string | undefined): string | undefined {
  if (!id) return undefined;
  return OBS_BY_ID.get(id)?.name ?? getEntityById(id)?.name ?? EXTERNAL_NAMES[id];
}

type Ref = { id: string; name: string; slug?: string };
function resolveSlug(slug: string | undefined): Ref | undefined {
  if (!slug) return undefined;
  const r = OBS_BY_SLUG.get(slug);
  if (r) return { id: r.id, name: r.name, slug: r.slug };
  const ext = `organization:${slug}`;
  const name = EXTERNAL_NAMES[ext] ?? getEntityById(ext)?.name;
  return name ? { id: ext, name } : undefined;
}

const recs = (slugs: string[] | undefined): ObsRecord[] =>
  (slugs ?? []).map((s) => OBS_BY_SLUG.get(s)).filter((x): x is ObsRecord => Boolean(x));

// Telescopes grouped by the observatory they belong to.
const TELESCOPES_BY_OBS = new Map<string, ObsRecord[]>();
for (const r of OBS_RECORDS) {
  if (r.kind !== "telescope" || !r.observatorySlug) continue;
  (TELESCOPES_BY_OBS.get(r.observatorySlug) ?? TELESCOPES_BY_OBS.set(r.observatorySlug, []).get(r.observatorySlug)!).push(r);
}
// Instruments grouped by host slug.
const INSTRUMENTS_BY_HOST = new Map<string, ObsRecord[]>();
for (const r of OBS_RECORDS) {
  if (r.kind !== "instrument" || !r.hostSlug) continue;
  (INSTRUMENTS_BY_HOST.get(r.hostSlug) ?? INSTRUMENTS_BY_HOST.set(r.hostSlug, []).get(r.hostSlug)!).push(r);
}

export interface ResolvedObs {
  record: ObsRecord;
  kindLabel: string;
  operator?: Ref;
  partnerOperators: Ref[];
  observatory?: Ref;
  site?: Ref;
  bands: ObsRecord[];
  instruments: ObsRecord[];
  telescopes: ObsRecord[];
  surveys: ObsRecord[];
  observedObjects: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolve(slugOrId: string): ResolvedObs | null {
  const record = OBS_BY_SLUG.get(slugOrId) ?? OBS_BY_ID.get(slugOrId);
  if (!record) return null;
  const entity = getEntityById(record.id);
  return {
    record,
    kindLabel: KIND_LABEL[record.kind],
    operator: resolveSlug(record.operatorSlug),
    partnerOperators: (record.partnerOperatorSlugs ?? []).map(resolveSlug).filter((x): x is Ref => Boolean(x)),
    observatory: resolveSlug(record.observatorySlug),
    site: resolveSlug(record.siteSlug),
    bands: recs(record.bandSlugs),
    instruments: [...(INSTRUMENTS_BY_HOST.get(record.slug) ?? []), ...recs(record.instrumentSlugs)].filter((v, i, a) => a.indexOf(v) === i),
    telescopes: [...(TELESCOPES_BY_OBS.get(record.slug) ?? []), ...recs(record.telescopeSlugs)].filter((v, i, a) => a.indexOf(v) === i),
    surveys: recs(record.surveySlugs),
    observedObjects: (record.relatedKeys ?? []).map((id) => ({ id, name: refName(id) ?? id })),
    connections: getConnectionsByDomain(record.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(record.id),
  };
}

const FACILITY = new Set<ObsKind>(["observatory", "telescope", "space-telescope"]);

export const observatoryEngine = {
  count: OBS_RECORDS.length,
  all: (): ObsRecord[] => OBS_RECORDS,
  get: (slugOrId: string): ObsRecord | undefined => OBS_BY_SLUG.get(slugOrId) ?? OBS_BY_ID.get(slugOrId),
  resolve,
  byKind: (kind: ObsKind): ObsRecord[] => OBS_BY_KIND.get(kind) ?? [],
  /** Facilities (observatories + ground + space telescopes) matching a band slug. */
  byBand: (bandSlug: string): ObsRecord[] => OBS_RECORDS.filter((r) => FACILITY.has(r.kind) && r.bandSlugs?.includes(bandSlug)),
  byType: (pred: (t: string) => boolean): ObsRecord[] => OBS_RECORDS.filter((r) => r.observatoryType && pred(r.observatoryType)),
  largestTelescopes: (limit = 20): ObsRecord[] =>
    OBS_RECORDS.filter((r) => (r.kind === "telescope" || r.kind === "space-telescope") && r.apertureM != null)
      .slice().sort((a, b) => (b.apertureM ?? 0) - (a.apertureM ?? 0)).slice(0, limit),
  planned: (): ObsRecord[] => OBS_RECORDS.filter((r) => FACILITY.has(r.kind) && /planned/i.test(r.status ?? "")),
  kinds: (): { kind: ObsKind; label: string; plural: string; count: number }[] =>
    (Object.keys(KIND_LABEL) as ObsKind[])
      .map((kind) => ({ kind, label: KIND_LABEL[kind], plural: KIND_PLURAL[kind], count: (OBS_BY_KIND.get(kind) ?? []).length }))
      .filter((k) => k.count > 0),
};
