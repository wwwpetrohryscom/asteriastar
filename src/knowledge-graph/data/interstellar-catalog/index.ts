import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/interstellar-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type InterstellarKind, type InterstellarRecord, type InterstellarStatus } from "@/knowledge-graph/data/interstellar-catalog/types";
import { objects } from "@/knowledge-graph/data/interstellar-catalog/data/objects";
import { candidates } from "@/knowledge-graph/data/interstellar-catalog/data/candidates";
import { hyperbolicComets } from "@/knowledge-graph/data/interstellar-catalog/data/hyperbolic-comets";
import { methods } from "@/knowledge-graph/data/interstellar-catalog/data/methods";
import { trajectoryClasses } from "@/knowledge-graph/data/interstellar-catalog/data/trajectory-classes";
import { surveys } from "@/knowledge-graph/data/interstellar-catalog/data/surveys";

/**
 * Interstellar & Hyperbolic Objects catalog (Program AB) — the coda to the small-body
 * arc. A COMPACT catalogue: it CREATES the confirmed interstellar objects, the debated
 * candidate, the hyperbolic Solar-System comets, the detection methods and trajectory
 * classes, and the four new detection surveys / cataloguing bodies (ATLAS, Catalina, the
 * Minor Planet Center, CNEOS). It REUSES existing entities via relation targets — the
 * comet dynamical class (Program Z), Pan-STARRS, and NASA/JPL — duplicating none of them.
 *
 * The governing rule is honest status: confirmed interstellar objects, candidates, and
 * Solar-System comets on hyperbolic orbits are typed and related separately, and an
 * interstellar origin is asserted (via has_trajectory_class → interstellar-hyperbolic)
 * ONLY for the confirmed objects. Cross-references resolve against the map for the target
 * kind; relations that duplicate an existing graph edge or whose endpoints don't resolve
 * are dropped. Nothing is fabricated — unknown values are omitted.
 */
export const INTERSTELLAR_RECORDS: InterstellarRecord[] = [
  ...objects, ...candidates, ...hyperbolicComets, ...methods, ...trajectoryClasses, ...surveys,
];

export const INTERSTELLAR_BY_ID = new Map(INTERSTELLAR_RECORDS.map((r) => [r.id, r]));

const byKind = (k: InterstellarKind | InterstellarKind[]) => {
  const kinds = Array.isArray(k) ? k : [k];
  return new Map(INTERSTELLAR_RECORDS.filter((r) => kinds.includes(r.kind)).map((r) => [r.slug, r]));
};
// object + candidate + hyperbolic-comet share the /interstellar-objects/{slug} route, so
// they live in ONE slug namespace and their slugs must be unique across the three kinds.
export const OBJECT_BY_SLUG = byKind(["object", "candidate", "hyperbolic-comet"]);
export const METHOD_BY_SLUG = byKind("detection-method");
export const TRAJECTORY_BY_SLUG = byKind("trajectory-class");
export const SURVEY_BY_SLUG = byKind(["survey", "organization"]);

const rTraj = (s?: string) => (s ? TRAJECTORY_BY_SLUG.get(s)?.id : undefined);
const rMethod = (s?: string) => (s ? METHOD_BY_SLUG.get(s)?.id : undefined);

/* ----------------------------------------------------------- entities */

export function entryPathFor(r: Pick<InterstellarRecord, "kind" | "slug">): string | undefined {
  switch (r.kind) {
    case "object":
    case "candidate":
    case "hyperbolic-comet":
      return `/interstellar-objects/${r.slug}`;
    case "detection-method":
      return `/interstellar-objects/detection/${r.slug}`;
    case "trajectory-class":
      return `/interstellar-objects/trajectory/${r.slug}`;
    case "survey": // reused types — resolve to the standalone /explore graph page
    case "organization":
      return undefined;
  }
}

const newRecords = INTERSTELLAR_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => {
  const entryPath = entryPathFor(r);
  return {
    id: r.id,
    type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
    name: r.name,
    domain: "science" as const,
    ...(entryPath ? { entryPath } : {}),
    description: r.description,
    aliases: r.altNames,
    ...(r.designation ? { catalogNumbers: [r.designation] } : {}),
    sources: r.sources,
  };
});

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string, type: RelationType, to: string | undefined) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science"));
}

for (const r of INTERSTELLAR_RECORDS) {
  switch (r.kind) {
    case "object":
    case "candidate":
    case "hyperbolic-comet":
      // A trajectory class is asserted only where the record carries one — candidates
      // deliberately omit it, so the graph never classifies a debated object as
      // interstellar-hyperbolic.
      add(r.id, "has_trajectory_class", rTraj(r.trajectoryClassSlug));
      for (const m of r.detectionMethodSlugs ?? []) add(r.id, "associated_with", rMethod(m));
      for (const s of r.surveyKeys ?? []) add(r.id, "surveyed_by", s);
      for (const c of r.cataloguedByKeys ?? []) add(r.id, "catalogued_in", c);
      for (const c of r.cometClassKeys ?? []) add(r.id, "associated_with", c);
      for (const o of r.observedByKeys ?? []) add(r.id, "observed_by", o);
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "trajectory-class":
      for (const c of r.relatedClassSlugs ?? []) add(r.id, "related_to", rTraj(c)); // the e-ladder
      break;
    case "detection-method":
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "survey":
    case "organization":
      break; // incoming edges only (surveyed_by / catalogued_in / associated_with)
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: InterstellarRecord) => string | undefined) {
  const m = new Map<string, InterstellarRecord[]>();
  for (const r of INTERSTELLAR_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const INTERSTELLAR_BY_KIND = group((r) => r.kind);
export const INTERSTELLAR_BY_STATUS = group((r) => r.status);

export const INTERSTELLAR_STATS = {
  records: INTERSTELLAR_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...INTERSTELLAR_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  objects: INTERSTELLAR_BY_KIND.get("object")?.length ?? 0,
  candidates: INTERSTELLAR_BY_KIND.get("candidate")?.length ?? 0,
  hyperbolicComets: INTERSTELLAR_BY_KIND.get("hyperbolic-comet")?.length ?? 0,
  methods: INTERSTELLAR_BY_KIND.get("detection-method")?.length ?? 0,
  trajectoryClasses: INTERSTELLAR_BY_KIND.get("trajectory-class")?.length ?? 0,
} as const;

/** Statuses a confirmed object / candidate may legally carry (confirmed ≠ candidate). */
const CONFIRMED_STATUS: InterstellarStatus = "confirmed_interstellar";
const NON_CONFIRMED: ReadonlySet<InterstellarStatus> = new Set([
  "candidate_interstellar",
  "debated_origin",
  "rejected_or_uncertain",
]);

export function validateInterstellarObjects(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as InterstellarKind[]);
  const seenSlugByKind = new Map<InterstellarKind, Set<string>>();
  for (const r of INTERSTELLAR_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate interstellar id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    for (const [k, v] of Object.entries(r)) {
      if (typeof v !== "number") continue;
      if (!Number.isFinite(v)) issues.push(`${r.id}: non-finite numeric ${k}=${v}`);
      // Interstellar objects legitimately reach e ≈ 6+, so only a negative or absurd
      // eccentricity is invalid; the confirmed/candidate rules below add the real checks.
      else if (k === "eccentricity") { if (v < 0 || v > 50) issues.push(`${r.id}: eccentricity out of range: ${v}`); }
      else if (k === "inclinationDeg") { if (v < 0 || v > 180) issues.push(`${r.id}: inclination out of range: ${v}`); }
      else if (v < 0) issues.push(`${r.id}: invalid numeric ${k}=${v}`);
    }
  }

  // ---- status honesty: confirmed ≠ candidate, and interstellar claims must be supported.
  for (const r of INTERSTELLAR_RECORDS) {
    if (r.kind === "object") {
      if (r.status !== CONFIRMED_STATUS) issues.push(`${r.id}: an interstellar_object must be status confirmed_interstellar`);
      // A confirmed interstellar object must sit on the interstellar-hyperbolic class...
      if (r.trajectoryClassSlug !== "interstellar-hyperbolic") issues.push(`${r.id}: confirmed interstellar object must have trajectory class "interstellar-hyperbolic"`);
      // ...and, where an eccentricity is stated, it must be hyperbolic (e > 1).
      if (r.eccentricity !== undefined && r.eccentricity <= 1) issues.push(`${r.id}: confirmed interstellar object with non-hyperbolic eccentricity ${r.eccentricity}`);
    }
    if (r.kind === "candidate") {
      if (!r.status || !NON_CONFIRMED.has(r.status)) issues.push(`${r.id}: a candidate must NOT be status confirmed_interstellar`);
      // Never assert the confirmed interstellar trajectory class for an unconfirmed object.
      if (r.trajectoryClassSlug === "interstellar-hyperbolic") issues.push(`${r.id}: a candidate must not be classified as interstellar-hyperbolic`);
      // Every candidate/debated claim must carry an explicit uncertainty note.
      if (!r.uncertaintyNote) issues.push(`${r.id}: a candidate must carry an uncertaintyNote`);
    }
    if (r.kind === "hyperbolic-comet") {
      if (r.status !== "hyperbolic_solar_system_object") issues.push(`${r.id}: a hyperbolic comet must be status hyperbolic_solar_system_object`);
      // A Solar-System comet here must not be mislabelled as interstellar.
      if (r.trajectoryClassSlug === "interstellar-hyperbolic") issues.push(`${r.id}: a Solar-System comet must not be classified as interstellar-hyperbolic`);
      // If an eccentricity is stated it must be at least near-parabolic (not clearly bound).
      if (r.eccentricity !== undefined && r.eccentricity < 0.9) issues.push(`${r.id}: hyperbolic comet with a clearly bound eccentricity ${r.eccentricity}`);
    }
  }

  // ---- relation integrity: catalog-internal cross-references must resolve.
  for (const r of INTERSTELLAR_RECORDS) {
    if (r.trajectoryClassSlug && !rTraj(r.trajectoryClassSlug)) issues.push(`${r.id}: unresolved trajectoryClassSlug "${r.trajectoryClassSlug}"`);
    for (const c of r.relatedClassSlugs ?? []) if (!rTraj(c)) issues.push(`${r.id}: unresolved related trajectory class "${c}"`);
    for (const m of r.detectionMethodSlugs ?? []) if (!rMethod(m)) issues.push(`${r.id}: unresolved detection method "${m}"`);
    // Full graph ids (surveys / catalogues / comet classes / observatories / related) are
    // validated at the graph level; here we only require a well-formed id.
    for (const k of [...(r.surveyKeys ?? []), ...(r.cataloguedByKeys ?? []), ...(r.cometClassKeys ?? []), ...(r.observedByKeys ?? []), ...(r.relatedKeys ?? [])]) {
      if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
    }
    // Surveys / cataloguing bodies point at the expected graph type.
    for (const k of r.surveyKeys ?? []) if (!k.startsWith("sky_survey:")) issues.push(`${r.id}: surveyKey must be a sky_survey id: "${k}"`);
    for (const k of r.cataloguedByKeys ?? []) if (!k.startsWith("organization:")) issues.push(`${r.id}: cataloguedByKey must be an organization id: "${k}"`);
    for (const k of r.cometClassKeys ?? []) if (!k.startsWith("comet_class:")) issues.push(`${r.id}: cometClassKey must be a comet_class id: "${k}"`);
  }

  // ---- no duplicate canonical homes: object/candidate/hyperbolic-comet share one route
  // namespace, so their slugs must be unique across the three kinds.
  const homeSlugs = new Set<string>();
  for (const r of INTERSTELLAR_RECORDS) {
    if (r.kind !== "object" && r.kind !== "candidate" && r.kind !== "hyperbolic-comet") continue;
    if (homeSlugs.has(r.slug)) issues.push(`duplicate object slug across kinds: ${r.slug}`);
    homeSlugs.add(r.slug);
  }

  // ---- no isolated new entity: every created entity carries at least one relation.
  const connected = new Set<string>();
  for (const x of relations) {
    connected.add(x.from);
    connected.add(x.to);
  }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

// Re-export record types + helpers for the engine.
export type { InterstellarRecord, InterstellarKind, InterstellarCategory, InterstellarStatus } from "@/knowledge-graph/data/interstellar-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL, STATUS_LABEL } from "@/knowledge-graph/data/interstellar-catalog/types";
export { objects, candidates, hyperbolicComets, methods, trajectoryClasses, surveys };
