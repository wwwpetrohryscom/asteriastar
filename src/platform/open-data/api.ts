import { entities, relations, getEntityById, entityGraphPath, getConnectionsByDomain } from "@/knowledge-graph";
import { fold, foldId, rankDoc, Tier } from "@/lib/search/match";
import type { GraphEntity, GraphRelation, EntityType, EntityDomain, RelationType } from "@/knowledge-graph/schema";
import { GRAPH_VERSION_INFO, GRAPH_RELEASED } from "@/knowledge-graph/version";
import { traversalEngine } from "@/platform/data-engine/traversal-engine";
import { SITE_URL } from "@/lib/site";

/**
 * Open Data API core (v0).
 *
 * The read-only public API is a thin, deterministic projection of the
 * Scientific Data Engine and Knowledge Graph — it never bypasses the engine and
 * never fabricates values. Every response carries a provenance envelope
 * (apiVersion, schemaVersion, dataVersion, generatedAt, source, license,
 * attribution). Responses expose only public fields (ids, names, canonical
 * paths, sourced metadata) — never internal file paths, user data, or analytics.
 * Read-only: there are no write, mutation, or upload endpoints.
 */

export const API_VERSION = "v0";
export const API_SOURCE = "Asteria Star — Scientific Data Engine & Knowledge Graph";
export const API_LICENSE = "CC BY-SA 4.0";
export const API_ATTRIBUTION = `Asteria Star (asteriastar) — ${SITE_URL}. Underlying source data retains its own licenses; see ${SITE_URL}/data/licensing.`;
/** Deterministic: the data was generated at the fixed graph-release date, not per request. */
export const DATA_GENERATED_AT = `${GRAPH_RELEASED}T00:00:00Z`;

export interface ApiMeta {
  apiVersion: string;
  schemaVersion: string;
  dataVersion: string;
  generatedAt: string;
  source: string;
  license: string;
  attribution: string;
  provenance: string;
  docs: string;
  stale?: boolean;
}

export function apiMeta(opts: { provenance: string; license?: string; docs?: string; generatedAt?: string; source?: string; stale?: boolean } ): ApiMeta {
  return {
    apiVersion: API_VERSION,
    schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
    dataVersion: GRAPH_VERSION_INFO.graphVersion,
    // Static graph data uses the fixed release date; dynamic endpoints (e.g. the
    // computed Moon) pass their real computation time.
    generatedAt: opts.generatedAt ?? DATA_GENERATED_AT,
    source: opts.source ?? API_SOURCE,
    license: opts.license ?? API_LICENSE,
    attribution: API_ATTRIBUTION,
    provenance: opts.provenance,
    docs: `${SITE_URL}/developers/api`,
    ...(opts.stale != null ? { stale: opts.stale } : {}),
  };
}

/**
 * Cache-key declaration for every API response.
 *
 * RFC 9111 makes the *whole* request URI the cache key, query string included —
 * which is what every one of these endpoints relies on: `?latitude=50&longitude=14`
 * and `?latitude=60&longitude=25` are different questions with different answers.
 *
 * Netlify's Next.js Runtime overrides that default with
 * `Netlify-Vary: query=__nextDataReq|_rsc`, an allow-list naming only Next's own
 * routing parameters. That is correct for App Router pages, which are keyed by
 * path — and wrong for route handlers, because an allow-list drops everything
 * not named. Measured before this header existed: a request for latitude 60 was
 * served a cached answer computed for latitude 0, and a request with no
 * parameters at all was served a 200 instead of its 400 error contract.
 *
 * `Netlify-Vary: query` with no allow-list restores the RFC default. It cannot
 * be set from `netlify.toml`: custom header rules there apply to files in the
 * publish directory, not to responses produced by the server function — that was
 * tried first and verified not to work. So it is declared here, next to the
 * `Cache-Control` it qualifies.
 *
 * The header is inert on hosts that do not implement it, and it asserts the
 * standard behaviour rather than a vendor-specific one, so it does not tie these
 * handlers to a platform.
 */
const CACHE_KEY_IS_FULL_URL = { "Netlify-Vary": "query" } as const;

/**
 * CORS for the public Open Data API.
 *
 * Vercel added `Access-Control-Allow-Origin: *` to every static response as a
 * platform header, so browser clients of this API have always been able to read
 * it cross-origin — without the application ever declaring it. Netlify does not,
 * and a `netlify.toml` header rule cannot supply it here: those rules reach
 * files in the publish directory (verified on /logo.svg and /favicon.ico) but
 * not responses produced by the server function, which is what serves every
 * route handler (verified on /api/v0/sources and /robots.txt).
 *
 * So the API declares its own CORS policy, which is where it belonged anyway:
 * this is a public, read-only, credential-free API whose whole purpose is to be
 * consumed by other people's software. `*` also forbids credentialed requests
 * by definition, so it cannot leak anything a caller could not already fetch.
 */
export const OPEN_DATA_CORS = { "Access-Control-Allow-Origin": "*" } as const;

/** A JSON response with the provenance envelope. Static data caches long; dynamic endpoints pass a shorter cacheControl. */
export function apiResponse<T>(data: T, opts: { provenance: string; license?: string; count?: number; generatedAt?: string; source?: string; stale?: boolean; cacheControl?: string }): Response {
  const body = { meta: apiMeta(opts), ...(opts.count != null ? { count: opts.count } : {}), data };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": opts.cacheControl ?? "public, max-age=3600, stale-while-revalidate=86400",
      "X-Api-Version": API_VERSION,
      ...CACHE_KEY_IS_FULL_URL,
      ...OPEN_DATA_CORS,
    },
  });
}

export function apiError(status: number, message: string): Response {
  return new Response(JSON.stringify({ meta: apiMeta({ provenance: "Error response." }), error: { status, message } }, null, 2), {
    // An error response is as query-dependent as a success one: without this,
    // a cached 200 for one parameter set answers a request whose parameters are
    // invalid, and the 400 contract silently disappears.
    status, headers: { "Content-Type": "application/json; charset=utf-8", ...CACHE_KEY_IS_FULL_URL, ...OPEN_DATA_CORS },
  });
}

/* ------------------------------------------------------- public serializers */
/** Public entity shape — no internal fields, only sourced public data + canonical path. */
export interface EntityDTO {
  id: string; type: EntityType; name: string; domain: EntityDomain;
  path: string; description?: string; aliases?: string[];
  scientificName?: string; catalogNumbers?: string[]; sources?: string[];
}
export function serializeEntity(e: GraphEntity): EntityDTO {
  return {
    id: e.id, type: e.type, name: e.name, domain: e.domain, path: entityGraphPath(e),
    description: e.description, aliases: e.aliases, scientificName: e.scientificName,
    catalogNumbers: e.catalogNumbers, sources: e.sources,
  };
}
export interface RelationDTO { id: string; from: string; type: RelationType; to: string; confidence: string; domain: string; note?: string; sources?: string[] }
export function serializeRelation(r: GraphRelation): RelationDTO {
  return { id: r.id, from: r.from, type: r.type, to: r.to, confidence: r.confidence, domain: r.domain, note: r.note, sources: r.sources };
}

/* ------------------------------------------------------------------ queries */
const clampLimit = (raw: string | null, def: number, max: number): number => {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), max) : def;
};

export function listEntities(params: URLSearchParams) {
  const type = params.get("type");
  const domain = params.get("domain");
  const limit = clampLimit(params.get("limit"), 100, 1000);
  const offset = Math.max(0, Number(params.get("offset")) || 0);
  let list = entities;
  if (type) list = list.filter((e) => e.type === type);
  if (domain) list = list.filter((e) => e.domain === domain);
  const sorted = list.slice().sort((a, b) => a.id.localeCompare(b.id));
  const page = sorted.slice(offset, offset + limit);
  return { total: sorted.length, offset, limit, count: page.length, items: page.map(serializeEntity) };
}

export function getEntity(id: string) {
  const e = getEntityById(id);
  if (!e) return null;
  const conns = getConnectionsByDomain(id);
  const all = [...conns.science, ...conns.culture, ...conns.astrology];
  return {
    ...serializeEntity(e),
    relationships: all.map((c) => ({ relation: c.relation.type, direction: c.outgoing ? "out" : "in", other: { id: c.other.id, name: c.other.name, type: c.other.type, path: entityGraphPath(c.other) } })),
  };
}

export function listRelationships(params: URLSearchParams) {
  const type = params.get("type");
  const domain = params.get("domain");
  const from = params.get("from");
  const to = params.get("to");
  const limit = clampLimit(params.get("limit"), 200, 2000);
  const offset = Math.max(0, Number(params.get("offset")) || 0);
  let list = relations;
  if (type) list = list.filter((r) => r.type === type);
  if (domain) list = list.filter((r) => r.domain === domain);
  if (from) list = list.filter((r) => r.from === from);
  if (to) list = list.filter((r) => r.to === to);
  const sorted = list.slice().sort((a, b) => a.id.localeCompare(b.id));
  const page = sorted.slice(offset, offset + limit);
  return { total: sorted.length, offset, limit, count: page.length, items: page.map(serializeRelation) };
}

/** Deterministic, non-semantic entity search: exact > prefix > substring on name/aliases/id. */
export interface SearchHit { id: string; title: string; type: EntityType; domain: EntityDomain; path: string; summary?: string; score: number }
/**
 * Deterministic entity search.
 *
 * Ranking now runs through the same tier ladder as the on-site search
 * (`lib/search/match`), so an API consumer and a visitor see results in the
 * same order and the same normalisation applies to both: diacritics folded,
 * Unicode apostrophes and dashes normalised to ASCII, and identifier
 * separators collapsed so "M 31", "M-31" and "M31" are one query.
 *
 * BACKWARD COMPATIBILITY: the request parameters (`q`, `type`, `domain`,
 * `limit`) and the response shape (`id`, `title`, `type`, `domain`, `path`,
 * `summary`, `score`) are unchanged, and `score` remains a 0–100 integer.
 *
 * One ordering change is intentional: an exact alias match now outranks a
 * title *prefix* match. The previous ladder scored a prefix (70) above an exact
 * alias (65), so searching "M31" ranked every entity whose name merely begins
 * with "m31" above the object actually designated M31. The documented
 * precedence — exact title, exact alias/identifier, title prefix, alias prefix
 * — is what this now implements.
 */
/** Folded haystacks are stable per entity, so they are built once per process. */
const apiHaystacks = new WeakMap<GraphEntity, ReturnType<typeof buildApiHaystacks>>();

function buildApiHaystacks(e: GraphEntity) {
  const title = fold(e.name);
  const aliases = (e.aliases ?? []).map(fold);
  const desc = fold(e.description ?? "");
  return {
    title,
    bare: /^(the|a|an) /.test(title) ? title.slice(title.indexOf(" ") + 1) : "",
    aliases,
    ids: [foldId(e.name), foldId(e.id), ...(e.aliases ?? []).flatMap((a) => [foldId(a), fold(a)])],
    desc,
    all: [title, ...aliases, desc].join(" "),
  };
}

export function searchEntities(params: URLSearchParams): { query: string; count: number; results: SearchHit[] } {
  const raw = (params.get("q") ?? "").trim();
  const type = params.get("type");
  const domain = params.get("domain");
  const limit = clampLimit(params.get("limit"), 20, 100);
  if (!raw) return { query: "", count: 0, results: [] };

  const q = fold(raw);
  const qid = foldId(raw);

  /** Tier → the 0–100 score the public API has always exposed. */
  const SCORE: Record<number, number> = {
    [Tier.TitleExact]: 100,
    [Tier.AliasExact]: 90,
    [Tier.TitlePrefix]: 70,
    [Tier.AliasPrefix]: 55,
    [Tier.WordPrefix]: 45,
    [Tier.AllTokens]: 35,
    [Tier.Substring]: 30,
    [Tier.Fuzzy]: 10,
  };

  let list = entities;
  if (type) list = list.filter((e) => e.type === type);
  if (domain) list = list.filter((e) => e.domain === domain);

  const rank = (e: GraphEntity, allowFuzzy: boolean): number => {
    let h = apiHaystacks.get(e);
    if (!h) {
      h = buildApiHaystacks(e);
      apiHaystacks.set(e, h);
    }
    return rankDoc(h, q, qid, allowFuzzy);
  };

  const collect = (allowFuzzy: boolean) =>
    list
      .map((e) => ({ e, t: rank(e, allowFuzzy) }))
      .filter((x) => x.t !== Tier.None);

  // Strict first; typo tolerance only widens a query that found almost nothing,
  // so a close spelling can never displace a real match.
  let scored = collect(false);
  if (scored.length < 3) {
    const widened = collect(true);
    if (widened.length > scored.length) scored = widened;
  }

  const ordered = scored
    .sort((a, b) => b.t - a.t || a.e.name.length - b.e.name.length || a.e.name.localeCompare(b.e.name))
    .slice(0, limit);

  return {
    query: raw,
    count: ordered.length,
    results: ordered.map(({ e, t }) => ({
      id: e.id,
      title: e.name,
      type: e.type,
      domain: e.domain,
      path: entityGraphPath(e),
      summary: e.description?.slice(0, 160),
      score: SCORE[t] ?? 0,
    })),
  };
}

const DOMAIN_MAP: Record<string, "scientific" | "interpretive" | "mixed"> = { science: "scientific", scientific: "scientific", culture: "interpretive", astrology: "interpretive", interpretive: "interpretive", all: "mixed", mixed: "mixed" };

export function traverse(params: URLSearchParams) {
  const start = params.get("start");
  if (!start) return { error: "missing 'start' entity id" };
  const maxDepth = Math.min(Math.max(1, Number(params.get("maxDepth")) || 2), 5);
  const limit = clampLimit(params.get("limit"), 100, 500);
  const domainParam = params.get("domain");
  const relationTypes = params.get("relationTypes")?.split(",").map((s) => s.trim()).filter(Boolean) as RelationType[] | undefined;
  const result = traversalEngine.traverse(start, {
    maxDepth, maxNodes: limit,
    relationTypes: relationTypes && relationTypes.length ? relationTypes : undefined,
    domain: domainParam ? DOMAIN_MAP[domainParam] : undefined,
  });
  if (!result) return { error: `unknown start entity: ${start}` };
  const warnings: string[] = [];
  if (result.truncated) warnings.push(`Traversal truncated at maxNodes=${limit}.`);
  return {
    start: serializeEntity(result.start),
    nodes: result.nodes.map((n) => ({ id: n.entity.id, name: n.entity.name, type: n.entity.type, path: entityGraphPath(n.entity), distance: n.distance, via: n.viaRelation })),
    edges: result.edges.map((e) => ({ from: e.from, to: e.to, type: e.type, domain: e.domain })),
    truncated: result.truncated, warnings,
  };
}
