import {
  EXPLORATION_RECORDS,
  EXPLORATION_BY_ID,
  EXPLORATION_BY_SLUG,
  EXPLORATION_BY_KIND,
  EXPLORATION_BY_AGENCY,
  EXPLORATION_BY_PROGRAM,
} from "@/knowledge-graph/data/exploration-catalog";
import { KIND_LABEL, KIND_PLURAL, type ExplorationKind, type ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";
import { getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Exploration Engine — resolver and query surface for the space-exploration
 * encyclopedia. Pure, deterministic, framework-independent: it joins the typed
 * catalog with lightweight graph lookups.
 */

const EXTERNAL_NAMES: Record<string, string> = {
  "organization:spacex": "SpaceX",
  "organization:arianespace": "Arianespace",
  "organization:ula": "United Launch Alliance",
  "organization:jpl": "NASA JPL",
};

function refName(id: string | undefined): string | undefined {
  if (!id) return undefined;
  return EXPLORATION_BY_ID.get(id)?.name ?? getEntityById(id)?.name ?? EXTERNAL_NAMES[id];
}

function resolveSlug(slug: string | undefined): { id: string; name: string; slug?: string } | undefined {
  if (!slug) return undefined;
  const r = EXPLORATION_BY_SLUG.get(slug);
  if (r) return { id: r.id, name: r.name, slug: r.slug };
  const ext = `organization:${slug}`;
  const name = EXTERNAL_NAMES[ext] ?? getEntityById(ext)?.name;
  return name ? { id: ext, name } : undefined;
}

const yearOf = (d?: string) => (d ? Number(d.slice(0, 4)) : undefined);

// Instruments grouped by the slug of their host (spacecraft / telescope / mission).
const INSTRUMENTS_BY_HOST = new Map<string, ExplorationRecord[]>();
for (const r of EXPLORATION_RECORDS) {
  if (r.kind !== "instrument") continue;
  const host = r.spacecraftSlugs?.[0];
  if (!host) continue;
  (INSTRUMENTS_BY_HOST.get(host) ?? INSTRUMENTS_BY_HOST.set(host, []).get(host)!).push(r);
}

export interface ResolvedExploration {
  record: ExplorationRecord;
  kindLabel: string;
  agency?: { id: string; name: string; slug?: string };
  partnerAgencies: { id: string; name: string; slug?: string }[];
  program?: { id: string; name: string; slug?: string };
  vehicle?: { id: string; name: string; slug?: string };
  site?: { id: string; name: string; slug?: string };
  operator?: { id: string; name: string; slug?: string };
  spacecraft: ExplorationRecord[];
  crew: ExplorationRecord[];
  instruments: ExplorationRecord[];
  targets: { id: string; name: string }[];
  relatedMissions: ExplorationRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolve(slugOrId: string): ResolvedExploration | null {
  const record = EXPLORATION_BY_SLUG.get(slugOrId) ?? EXPLORATION_BY_ID.get(slugOrId);
  if (!record) return null;
  const entity = getEntityById(record.id);

  const spacecraft = (record.spacecraftSlugs ?? []).map((s) => EXPLORATION_BY_SLUG.get(s)).filter((x): x is ExplorationRecord => Boolean(x));
  const crew = (record.crewSlugs ?? []).map((s) => EXPLORATION_BY_SLUG.get(s)).filter((x): x is ExplorationRecord => Boolean(x));

  const instruments = [
    ...(INSTRUMENTS_BY_HOST.get(record.slug) ?? []),
    ...spacecraft.flatMap((s) => INSTRUMENTS_BY_HOST.get(s.slug) ?? []),
  ];

  const targets = (record.targetKeys ?? [])
    .map((id) => ({ id, name: refName(id) }))
    .filter((t): t is { id: string; name: string } => Boolean(t.name));

  let related: ExplorationRecord[] = [];
  if (record.kind === "mission") {
    const pool = record.programSlug ? EXPLORATION_BY_PROGRAM.get(record.programSlug) ?? [] : EXPLORATION_BY_AGENCY.get(record.agencySlug ?? "") ?? [];
    related = pool.filter((m) => m.kind === "mission" && m.id !== record.id).slice(0, 6);
  }

  return {
    record,
    kindLabel: KIND_LABEL[record.kind],
    agency: resolveSlug(record.agencySlug),
    partnerAgencies: (record.partnerAgencySlugs ?? []).map(resolveSlug).filter((x): x is { id: string; name: string; slug?: string } => Boolean(x)),
    program: resolveSlug(record.programSlug),
    vehicle: resolveSlug(record.vehicleSlug),
    site: resolveSlug(record.siteSlug),
    operator: resolveSlug(record.operatorSlug),
    spacecraft,
    crew,
    instruments,
    targets,
    relatedMissions: related,
    connections: getConnectionsByDomain(record.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(record.id),
  };
}

const MISSIONS = EXPLORATION_BY_KIND.get("mission") ?? [];
const byLaunch = (a: ExplorationRecord, b: ExplorationRecord) => (a.launchDate ?? "9999").localeCompare(b.launchDate ?? "9999");

export const explorationEngine = {
  count: EXPLORATION_RECORDS.length,
  missionCount: MISSIONS.length,
  all: (): ExplorationRecord[] => EXPLORATION_RECORDS,
  get: (slugOrId: string): ExplorationRecord | undefined => EXPLORATION_BY_SLUG.get(slugOrId) ?? EXPLORATION_BY_ID.get(slugOrId),
  resolve,
  byKind: (kind: ExplorationKind): ExplorationRecord[] => EXPLORATION_BY_KIND.get(kind) ?? [],
  byAgency: (slug: string): ExplorationRecord[] => EXPLORATION_BY_AGENCY.get(slug) ?? [],
  byProgram: (slug: string): ExplorationRecord[] => EXPLORATION_BY_PROGRAM.get(slug) ?? [],
  missionsByTarget: (targetId: string): ExplorationRecord[] => MISSIONS.filter((m) => m.targetKeys?.includes(targetId)).slice().sort(byLaunch),
  missionsByType: (pred: (t: string) => boolean): ExplorationRecord[] => MISSIONS.filter((m) => m.missionType && pred(m.missionType)).slice().sort(byLaunch),
  crewedMissions: (): ExplorationRecord[] => MISSIONS.filter((m) => (m.crewSlugs?.length ?? 0) > 0 || /crewed/i.test(m.missionType ?? "")).slice().sort(byLaunch),
  missionTimeline: (): ExplorationRecord[] => MISSIONS.filter((m) => m.launchDate).slice().sort(byLaunch),
  kinds: (): { kind: ExplorationKind; label: string; plural: string; count: number }[] =>
    (Object.keys(KIND_LABEL) as ExplorationKind[])
      .map((kind) => ({ kind, label: KIND_LABEL[kind], plural: KIND_PLURAL[kind], count: (EXPLORATION_BY_KIND.get(kind) ?? []).length }))
      .filter((k) => k.count > 0),
  agencies: (): { record: ExplorationRecord; missionCount: number }[] =>
    (EXPLORATION_BY_KIND.get("agency") ?? [])
      .map((a) => ({ record: a, missionCount: MISSIONS.filter((m) => m.agencySlug === a.slug || m.partnerAgencySlugs?.includes(a.slug)).length }))
      .sort((x, y) => y.missionCount - x.missionCount),
  yearOf,
};
