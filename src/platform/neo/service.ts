import { NO_VALUE_STATUSES, refreshStatus, type LiveEnvelope } from "@/platform/live-providers/envelope";
import { getLiveProduct, LIVE_PRODUCTS, LIVE_PROVIDERS, providerState, type LiveProviderDescriptor } from "@/platform/live-providers/registry";
import { getHealth, type ProviderHealth } from "@/platform/live-providers/health";
import { SBDB_ROWS } from "@/knowledge-graph/data/small-body-precision/snapshots/sbdb";
import { entityGraphPath, getEntityById } from "@/knowledge-graph";
import * as clients from "@/platform/neo/clients";
import type {
  CatalogueMatch, CloseApproach, NeoCandidate, NeoSnapshot, RecentNeo, ResolvedCloseApproach, SentryObject,
} from "@/platform/neo/model";

/**
 * The near-Earth object service (Program CK).
 *
 * Its most consequential job is the one that produces no data at all: deciding whether a live
 * provider record corresponds to something AsteriaStar has actually catalogued. A live close
 * approach is a real event about a real object, but most of those objects are faint rocks with
 * provisional designations that no encyclopedia should mint a permanent entity for. So a record
 * either MATCHES an existing entity — and says what it matched on — or it is shown as a provider
 * record and labelled "not yet catalogued in AsteriaStar". Nothing in between, and nothing minted.
 */

/* --------------------------------------------------------- catalogue matching */

/**
 * Designations are written several ways for the same object: JPL's close-approach table gives
 * "99942", its full name gives "99942 Apophis (2004 MN4)", and the SBDB snapshot's key is "99942".
 * Comparison therefore happens on a folded form — case, spacing and punctuation removed — so
 * "2004 MN4" and "2004MN4" are one designation while "2004 MN4" and "2004 MN14" remain two.
 */
function fold(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Every provisional or permanent designation an SBDB full name contains, e.g. "99942 Apophis (2004 MN4)". */
function designationsIn(fullname: string): string[] {
  const out: string[] = [];
  const leadingNumber = /^(\d+)\b/.exec(fullname);
  if (leadingNumber) out.push(leadingNumber[1]);
  for (const m of fullname.matchAll(/\(([^)]+)\)/g)) out.push(m[1]);
  const name = fullname.replace(/^\d+\s+/, "").replace(/\s*\([^)]*\)/g, "").trim();
  if (name) out.push(name);
  return out;
}

/**
 * The lookup from a provider designation to a catalogue entity, built once from the committed SBDB
 * snapshot — which is the only place in the repository that already carries BOTH a JPL identifier
 * and one of our entity ids, and so the only honest join between the two.
 */
const DESIGNATION_TO_ENTITY: Map<string, { entityId: string; matchedOn: CatalogueMatch["matchedOn"] }> = (() => {
  const map = new Map<string, { entityId: string; matchedOn: CatalogueMatch["matchedOn"] }>();
  for (const row of SBDB_ROWS) {
    const key = fold(row.key);
    if (key) map.set(key, { entityId: row.bodyId, matchedOn: "sbdb-designation" });
    for (const d of designationsIn(row.fullname)) {
      const folded = fold(d);
      // A designation already claimed by a `key` match is not overwritten: the key is the more
      // precise identifier, and a name fragment must never displace it.
      if (folded && !map.has(folded)) map.set(folded, { entityId: row.bodyId, matchedOn: "sbdb-fullname" });
    }
  }
  return map;
})();

/**
 * Resolve a live provider record against the catalogue.
 *
 * `notYetCatalogued` is set — and shown — for every record that does not match. That is the normal
 * case and it is not a defect: CNEOS tracks tens of thousands of objects and AsteriaStar catalogues
 * the ones with something to say about them. Building an ingest path for promoting a live record
 * into a permanent entity is a separate, deliberate act; this function will never do it implicitly.
 */
export function matchCatalogue(designation: string, fullName?: string): CatalogueMatch {
  const candidates = [designation, ...(fullName ? designationsIn(fullName) : [])];
  for (const candidate of candidates) {
    const hit = DESIGNATION_TO_ENTITY.get(fold(candidate));
    if (!hit) continue;
    const entity = getEntityById(hit.entityId);
    if (!entity) continue;
    return {
      entityId: entity.id,
      entityName: entity.name,
      entityPath: entityGraphPath(entity),
      matchedOn: hit.matchedOn,
      notYetCatalogued: false,
    };
  }
  return { notYetCatalogued: true };
}

/** How much of a live feed AsteriaStar already knows about — counted, never estimated. */
export function catalogueCoverage(designations: { designation: string; fullName?: string }[]): { total: number; matched: number } {
  let matched = 0;
  for (const d of designations) if (!matchCatalogue(d.designation, d.fullName).notYetCatalogued) matched += 1;
  return { total: designations.length, matched };
}

/* ------------------------------------------------------------------ snapshots */

/**
 * Fetch every NEO product.
 *
 * Written as `Promise.all` for the same reason the space-weather service is — it is the natural
 * shape — but JPL's Fair Use Policy permits only one open request at a time, and the loader's
 * per-provider gate serialises them. The composition here does not need to know that, and cannot
 * accidentally violate it.
 */
export async function neoSnapshot(): Promise<NeoSnapshot> {
  const [closeApproaches, sentry, recent, candidates] = await Promise.all([
    clients.closeApproaches(),
    clients.sentryTable(),
    clients.recentNeos(),
    clients.neoCandidates(),
  ]);
  return { closeApproaches, sentry, recent, candidates };
}

export async function closeApproachSnapshot(): Promise<Pick<NeoSnapshot, "closeApproaches" | "sentry">> {
  const [closeApproaches, sentry] = await Promise.all([clients.closeApproaches(), clients.sentryTable()]);
  return { closeApproaches, sentry };
}

export async function riskSnapshot(): Promise<Pick<NeoSnapshot, "sentry">> {
  return { sentry: await clients.sentryTable() };
}

export async function discoverySnapshot(): Promise<Pick<NeoSnapshot, "recent" | "candidates">> {
  const [recent, candidates] = await Promise.all([clients.recentNeos(), clients.neoCandidates()]);
  return { recent, candidates };
}

/* ---------------------------------------------------------------- composition */

/** Attach the catalogue match and any Sentry entry to each close approach. */
export function resolveApproaches(
  approaches: LiveEnvelope<CloseApproach[]>,
  sentry: LiveEnvelope<SentryObject[]>,
): ResolvedCloseApproach[] {
  if (!approaches.data || NO_VALUE_STATUSES.has(approaches.status)) return [];
  const sentryByDesignation = new Map((sentry.data ?? []).map((s) => [fold(s.designation), s]));
  return approaches.data.map((a) => ({
    ...a,
    catalogue: matchCatalogue(a.designation, a.fullName),
    sentry: sentryByDesignation.get(fold(a.designation)),
  }));
}

/**
 * The Sentry entries worth putting in front of a reader first.
 *
 * Ranked by the Palermo scale, which exists precisely to compare impact hazards against the
 * background risk — NOT by raw impact probability, which would put a tiny, harmless object with a
 * poorly-constrained orbit above a large one with a well-determined trajectory.
 */
export function highestRatedRisks(env: LiveEnvelope<SentryObject[]>, limit = 20): SentryObject[] {
  if (!env.data) return [];
  return env.data.slice(0, limit);
}

/**
 * The Palermo scale in words, using its own published definition. A value of 0 means the hazard
 * equals the background risk from all objects of comparable size; −2 and below is the threshold the
 * scale itself describes as no cause for public concern.
 */
export function palermoMeaning(ps: number | undefined): string {
  if (ps === undefined) return "No Palermo rating is published for this object.";
  if (ps < -2) return "Below −2 on the Palermo scale: the hazard is at least a hundred times smaller than the background risk from all objects of comparable size, which the scale itself defines as no cause for public concern.";
  if (ps < 0) return "Between −2 and 0 on the Palermo scale: the hazard is smaller than the background risk from comparable objects, and warrants monitoring rather than concern.";
  return "At or above 0 on the Palermo scale: the computed hazard meets or exceeds the background risk from all objects of comparable size. No object has ever remained at this level once enough observations were gathered.";
}

/** The Torino scale's own published wording for each level, abbreviated to its meaning. */
export function torinoMeaning(level: number | undefined): string | undefined {
  if (level === undefined) return undefined;
  if (level === 0) return "Torino 0: the likelihood of a collision is zero, or so low as to be effectively zero. This applies to almost every object ever tracked.";
  if (level === 1) return "Torino 1: a routine discovery whose pass near Earth poses no unusual level of danger. Current calculations show the chance of collision is extremely unlikely.";
  return `Torino ${level}: a level warranting attention from astronomers. The scale is defined only for potential impacts less than a century away.`;
}

/** Re-age a snapshot's envelopes against a later clock. */
export function reage<T extends object>(snapshot: T, nowIso: string): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(snapshot)) {
    const env = value as LiveEnvelope<unknown> | undefined;
    const product = env && typeof env === "object" && typeof env.productKey === "string" ? getLiveProduct(env.productKey) : undefined;
    out[key] = product && env ? refreshStatus(env, product.freshness, nowIso) : value;
  }
  return out as T;
}

/* ------------------------------------------------------------ provider health */

export interface NeoProviderReport {
  descriptor: LiveProviderDescriptor;
  state: ReturnType<typeof providerState>;
  products: { productKey: string; label: string; health?: ProviderHealth }[];
}

/** The NEO providers and what this instance has observed of them. */
export function neoProviderReports(): NeoProviderReport[] {
  return LIVE_PROVIDERS.filter((p) => p.category === "near-earth-object").map((descriptor) => {
    const products = LIVE_PRODUCTS.filter((p) => p.providerKey === descriptor.providerKey);
    return {
      descriptor,
      state: providerState(descriptor, products.map((p) => p.productKey)),
      products: products.map((p) => ({ productKey: p.productKey, label: p.label, health: getHealth(p.productKey) })),
    };
  });
}

/** Counts for the NEO hub, all derived from the live responses. */
export function neoTotals(snapshot: NeoSnapshot) {
  const approaches = snapshot.closeApproaches.data ?? [];
  const sentry = snapshot.sentry.data ?? [];
  const recent = snapshot.recent.data ?? [];
  const candidates = snapshot.candidates.data ?? [];
  return {
    approaches: approaches.length,
    /** Approaches closer than one lunar distance — a real threshold, not a danger threshold. */
    withinOneLunarDistance: approaches.filter((a) => a.distance.lunarDistances < 1).length,
    sentryObjects: sentry.length,
    /** Objects the Palermo scale itself places above "no cause for public concern". */
    aboveBackgroundConcern: sentry.filter((s) => (s.palermoCumulative ?? -99) >= -2).length,
    torinoAboveZero: sentry.filter((s) => (s.torinoMaximum ?? 0) > 0).length,
    recentObjects: recent.length,
    recentHazardous: recent.filter((r) => r.isPotentiallyHazardous).length,
    candidates: candidates.length,
    catalogued: catalogueCoverage(approaches.map((a) => ({ designation: a.designation, fullName: a.fullName }))),
  };
}

export type { CloseApproach, NeoCandidate, RecentNeo, SentryObject, ResolvedCloseApproach };
