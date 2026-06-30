import {
  HSF_RECORDS,
  HSF_BY_ID,
  HSF_BY_SLUG,
  HSF_BY_KIND,
} from "@/knowledge-graph/data/human-spaceflight-catalog";
import { KIND_LABEL, KIND_PLURAL, type HsfKind, type HsfRecord } from "@/knowledge-graph/data/human-spaceflight-catalog/types";
import { getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Human Spaceflight Engine — resolver and query surface for the space-stations
 * and human-spaceflight encyclopedia. Pure, deterministic, framework-independent.
 */

const EXTERNAL_NAMES: Record<string, string> = {
  "organization:nasa": "NASA", "organization:roscosmos": "Roscosmos", "organization:esa": "ESA",
  "organization:jaxa": "JAXA", "organization:csa": "CSA", "organization:cnsa": "CNSA",
  "organization:uk-space-agency": "UK Space Agency", "organization:asi": "ASI", "organization:spacex": "SpaceX",
  "launch_vehicle:soyuz": "Soyuz", "mission_program:soyuz-program": "Soyuz program",
};

function resolveSlug(slug: string | undefined): { id: string; name: string; slug?: string } | undefined {
  if (!slug) return undefined;
  const r = HSF_BY_SLUG.get(slug);
  if (r) return { id: r.id, name: r.name, slug: r.slug };
  // external (existing graph entity referenced by slug)
  for (const prefix of ["organization", "launch_vehicle", "mission_program", "astronaut", "space_mission"]) {
    const id = `${prefix}:${slug}`;
    const name = EXTERNAL_NAMES[id] ?? getEntityById(id)?.name;
    if (name) return { id, name };
  }
  return undefined;
}

type Ref = { id: string; name: string; slug?: string };

// Modules grouped by their station slug.
const MODULES_BY_STATION = new Map<string, HsfRecord[]>();
for (const r of HSF_RECORDS) {
  if (r.kind !== "module" || !r.stationSlug) continue;
  (MODULES_BY_STATION.get(r.stationSlug) ?? MODULES_BY_STATION.set(r.stationSlug, []).get(r.stationSlug)!).push(r);
}

export interface ResolvedHsf {
  record: HsfRecord;
  kindLabel: string;
  agency?: { id: string; name: string; slug?: string };
  partnerAgencies: { id: string; name: string; slug?: string }[];
  program?: { id: string; name: string; slug?: string };
  station?: { id: string; name: string; slug?: string };
  launchVehicle?: { id: string; name: string; slug?: string };
  commander?: { id: string; name: string; slug?: string };
  modules: HsfRecord[];
  crew: Ref[];
  participants: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolve(slugOrId: string): ResolvedHsf | null {
  const record = HSF_BY_SLUG.get(slugOrId) ?? HSF_BY_ID.get(slugOrId);
  if (!record) return null;
  const entity = getEntityById(record.id);
  return {
    record,
    kindLabel: KIND_LABEL[record.kind],
    agency: resolveSlug(record.agencySlug),
    partnerAgencies: (record.partnerAgencySlugs ?? []).map(resolveSlug).filter((x): x is { id: string; name: string; slug?: string } => Boolean(x)),
    program: resolveSlug(record.programSlug),
    station: resolveSlug(record.stationSlug),
    launchVehicle: resolveSlug(record.launchVehicleSlug),
    commander: resolveSlug(record.commanderSlug),
    modules: record.kind === "station" ? MODULES_BY_STATION.get(record.slug) ?? [] : [],
    crew: (record.crewSlugs ?? []).map(resolveSlug).filter((x): x is Ref => Boolean(x)),
    participants: (record.participantSlugs ?? []).map(resolveSlug).filter((x): x is Ref => Boolean(x)),
    connections: getConnectionsByDomain(record.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(record.id),
  };
}

const byLaunch = (a: HsfRecord, b: HsfRecord) => (a.launchDate ?? "9999").localeCompare(b.launchDate ?? "9999");
const byNumber = (a: HsfRecord, b: HsfRecord) => (a.expeditionNumber ?? 0) - (b.expeditionNumber ?? 0);

export const humanSpaceflightEngine = {
  count: HSF_RECORDS.length,
  all: (): HsfRecord[] => HSF_RECORDS,
  get: (slugOrId: string): HsfRecord | undefined => HSF_BY_SLUG.get(slugOrId) ?? HSF_BY_ID.get(slugOrId),
  resolve,
  byKind: (kind: HsfKind): HsfRecord[] => HSF_BY_KIND.get(kind) ?? [],
  stationsByStatus: (pred: (s: string) => boolean): HsfRecord[] => (HSF_BY_KIND.get("station") ?? []).filter((s) => s.status && pred(s.status)),
  modulesOf: (stationSlug: string): HsfRecord[] => MODULES_BY_STATION.get(stationSlug) ?? [],
  expeditions: (): HsfRecord[] => (HSF_BY_KIND.get("expedition") ?? []).slice().sort(byNumber),
  evas: (): HsfRecord[] => (HSF_BY_KIND.get("eva") ?? []).slice().sort(byLaunch),
  astronautsByNationality: (pred: (n: string) => boolean): HsfRecord[] => (HSF_BY_KIND.get("astronaut") ?? []).filter((a) => a.nationality && pred(a.nationality)),
  kinds: (): { kind: HsfKind; label: string; plural: string; count: number }[] =>
    (Object.keys(KIND_LABEL) as HsfKind[])
      .map((kind) => ({ kind, label: KIND_LABEL[kind], plural: KIND_PLURAL[kind], count: (HSF_BY_KIND.get(kind) ?? []).length }))
      .filter((k) => k.count > 0),
};
