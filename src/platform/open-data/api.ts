import { entities, relations, getEntityById, entityGraphPath, getConnectionsByDomain } from "@/knowledge-graph";
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

/** A JSON response with the provenance envelope. Static data caches long; dynamic endpoints pass a shorter cacheControl. */
export function apiResponse<T>(data: T, opts: { provenance: string; license?: string; count?: number; generatedAt?: string; source?: string; stale?: boolean; cacheControl?: string }): Response {
  const body = { meta: apiMeta(opts), ...(opts.count != null ? { count: opts.count } : {}), data };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": opts.cacheControl ?? "public, max-age=3600, stale-while-revalidate=86400",
      "X-Api-Version": API_VERSION,
    },
  });
}

export function apiError(status: number, message: string): Response {
  return new Response(JSON.stringify({ meta: apiMeta({ provenance: "Error response." }), error: { status, message } }, null, 2), {
    status, headers: { "Content-Type": "application/json; charset=utf-8" },
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
export function searchEntities(params: URLSearchParams): { query: string; count: number; results: SearchHit[] } {
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const type = params.get("type");
  const domain = params.get("domain");
  const limit = clampLimit(params.get("limit"), 20, 100);
  if (!q) return { query: "", count: 0, results: [] };
  const scoreOf = (e: GraphEntity): number => {
    const name = e.name.toLowerCase();
    const aliases = (e.aliases ?? []).map((a) => a.toLowerCase());
    if (name === q || e.id.toLowerCase() === q) return 100;
    if (name.startsWith(q)) return 70;
    if (aliases.some((a) => a === q)) return 65;
    if (name.includes(q)) return 40;
    if (aliases.some((a) => a.includes(q))) return 30;
    if (e.id.toLowerCase().includes(q)) return 20;
    if ((e.scientificName ?? "").toLowerCase().includes(q)) return 25;
    return 0;
  };
  let list = entities;
  if (type) list = list.filter((e) => e.type === type);
  if (domain) list = list.filter((e) => e.domain === domain);
  const scored = list.map((e) => ({ e, s: scoreOf(e) })).filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.e.name.localeCompare(b.e.name)).slice(0, limit);
  return {
    query: q, count: scored.length,
    results: scored.map(({ e, s }) => ({ id: e.id, title: e.name, type: e.type, domain: e.domain, path: entityGraphPath(e), summary: e.description?.slice(0, 160), score: s })),
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
