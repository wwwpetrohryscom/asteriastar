import {
  INTERSTELLAR_RECORDS,
  INTERSTELLAR_BY_ID,
  OBJECT_BY_SLUG,
  METHOD_BY_SLUG,
  TRAJECTORY_BY_SLUG,
  SURVEY_BY_SLUG,
  entryPathFor,
  objects,
  candidates,
  hyperbolicComets,
  methods,
  trajectoryClasses,
  type InterstellarRecord,
} from "@/knowledge-graph/data/interstellar-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Interstellar Engine — resolver and query surface for the Interstellar & Hyperbolic
 * Objects Encyclopedia (engine.interstellarObjects). Pure, deterministic, framework-free.
 *
 * It resolves the confirmed interstellar objects, the debated candidate, the hyperbolic
 * Solar-System comets, the detection methods and trajectory classes, and the new
 * detection surveys — and REUSES the platform's Pan-STARRS / LSST-Rubin surveys, the
 * comet dynamical class, and NASA/JPL via the graph, creating and fabricating nothing.
 * It NEVER conflates a confirmed object with a candidate: they are resolved through
 * separate queries and always carry an explicit scientific status.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

function catalogRef(r: InterstellarRecord | undefined): Ref | undefined {
  if (!r) return undefined;
  return { id: r.id, name: r.name, slug: r.slug, href: entryPathFor(r) };
}
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: entityGraphPath(e) };
}

const byName = (a: InterstellarRecord, b: InterstellarRecord) => a.name.localeCompare(b.name, "en", { numeric: true });
const byDate = (a: InterstellarRecord, b: InterstellarRecord) => (a.discoveryDate ?? "9999").localeCompare(b.discoveryDate ?? "9999");

/* ----------------------------------------------------------- resolvers */

export interface ResolvedInterstellar {
  record: InterstellarRecord;
  trajectoryClass?: Ref;
  methods: Ref[];
  surveys: Ref[];
  catalogues: Ref[];
  cometClasses: Ref[];
  observed: Ref[];
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveBody(r: InterstellarRecord): ResolvedInterstellar {
  const entity = getEntityById(r.id);
  return {
    record: r,
    trajectoryClass: catalogRef(r.trajectoryClassSlug ? TRAJECTORY_BY_SLUG.get(r.trajectoryClassSlug) : undefined),
    methods: (r.detectionMethodSlugs ?? []).map((m) => catalogRef(METHOD_BY_SLUG.get(m))).filter(Boolean) as Ref[],
    surveys: (r.surveyKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    catalogues: (r.cataloguedByKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    cometClasses: (r.cometClassKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    observed: (r.observedByKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedTrajectoryClass {
  record: InterstellarRecord;
  members: InterstellarRecord[]; // objects/comets on this trajectory class
  relatedClasses: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function membersOfClass(slug: string): InterstellarRecord[] {
  return INTERSTELLAR_RECORDS.filter((r) => r.trajectoryClassSlug === slug).sort(byDate);
}

function resolveTrajectory(r: InterstellarRecord): ResolvedTrajectoryClass {
  const entity = getEntityById(r.id);
  return {
    record: r,
    members: membersOfClass(r.slug),
    relatedClasses: (r.relatedClassSlugs ?? []).map((s) => catalogRef(TRAJECTORY_BY_SLUG.get(s))).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedMethod {
  record: InterstellarRecord;
  usedBy: InterstellarRecord[]; // objects identified with this method
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveMethodRecord(r: InterstellarRecord): ResolvedMethod {
  const entity = getEntityById(r.id);
  return {
    record: r,
    usedBy: INTERSTELLAR_RECORDS.filter((x) => (x.detectionMethodSlugs ?? []).includes(r.slug)).sort(byDate),
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

/* ----------------------------------------------------------- engine surface */

// The detection surveys and cataloguing bodies for the Surveys hub — a curated view over
// the graph that mixes the NEW entities (ATLAS, Catalina, MPC, CNEOS) with the REUSED
// ones (Pan-STARRS, LSST / Vera C. Rubin, NASA/JPL). Resolved through the graph; anything
// not present is simply skipped (never fabricated).
const SURVEY_IDS = [
  "sky_survey:pan-starrs",
  "sky_survey:atlas",
  "sky_survey:catalina-sky-survey",
  "sky_survey:lsst",
  "observatory:vera-rubin-observatory",
  "organization:minor-planet-center",
  "organization:cneos",
  "organization:jpl",
];

export const interstellarEngine = {
  count: objects.length, // confirmed interstellar objects
  recordCount: INTERSTELLAR_RECORDS.length,

  all: (): InterstellarRecord[] => [...objects, ...candidates, ...hyperbolicComets].sort(byDate),
  get: (slug: string): InterstellarRecord | undefined => OBJECT_BY_SLUG.get(slug) ?? INTERSTELLAR_BY_ID.get(slug),

  /* the honest, status-separated query surface */
  confirmedInterstellarObjects: (): InterstellarRecord[] => objects.slice().sort(byDate),
  candidateInterstellarObjects: (): InterstellarRecord[] => candidates.slice().sort(byDate),
  debatedObjects: (): InterstellarRecord[] => candidates.filter((c) => c.status === "debated_origin").sort(byDate),
  hyperbolicComets: (): InterstellarRecord[] => hyperbolicComets.slice().sort(byName),
  detectionMethods: (): InterstellarRecord[] => methods.slice(),
  trajectoryClasses: (): InterstellarRecord[] => trajectoryClasses.slice(),
  detectionSurveys: (): Ref[] => SURVEY_IDS.map((id) => refFromId(id)).filter(Boolean) as Ref[],
  bySlugs: (slugs: string[]): InterstellarRecord[] => slugs.map((s) => OBJECT_BY_SLUG.get(s)).filter((r): r is InterstellarRecord => Boolean(r)),
  membersOfClass,

  /* the named resolve* surface from the mission spec */
  resolveObject: (slug: string): ResolvedInterstellar | null => {
    const r = OBJECT_BY_SLUG.get(slug);
    return r ? resolveBody(r) : null;
  },
  resolveCandidate: (slug: string): ResolvedInterstellar | null => {
    const r = OBJECT_BY_SLUG.get(slug);
    return r && r.kind === "candidate" ? resolveBody(r) : null;
  },
  resolveHyperbolicComet: (slug: string): ResolvedInterstellar | null => {
    const r = OBJECT_BY_SLUG.get(slug);
    return r && r.kind === "hyperbolic-comet" ? resolveBody(r) : null;
  },
  resolveTrajectoryClass: (slug: string): ResolvedTrajectoryClass | null => {
    const r = TRAJECTORY_BY_SLUG.get(slug);
    return r ? resolveTrajectory(r) : null;
  },
  resolveDetectionMethod: (slug: string): ResolvedMethod | null => {
    const r = METHOD_BY_SLUG.get(slug);
    return r ? resolveMethodRecord(r) : null;
  },
  resolveSurvey: (slug: string): Ref | undefined => {
    const r = SURVEY_BY_SLUG.get(slug);
    return r ? refFromId(r.id) : undefined;
  },
};
