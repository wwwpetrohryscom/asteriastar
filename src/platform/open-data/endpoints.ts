/**
 * API endpoint registry — the single source of truth for the developer docs AND
 * the OpenAPI spec. Only endpoints marked `implemented` become real routes and
 * appear in the OpenAPI document; `planned` endpoints are documented honestly as
 * not-yet-available and are never added to the spec. There are no write,
 * mutation, or upload endpoints — the API is read-only.
 */

export type EndpointStatus = "implemented" | "planned";

export interface EndpointParam {
  name: string;
  in: "query" | "path";
  required: boolean;
  type: "string" | "integer";
  description: string;
  example?: string;
}

export interface EndpointDef {
  id: string;
  group: string;
  method: "GET" | "POST";
  /** OpenAPI-style path with {braces} for path params. */
  path: string;
  summary: string;
  description: string;
  params: EndpointParam[];
  status: EndpointStatus;
  /** A ready-to-run example path (implemented endpoints only). */
  example?: string;
  /** What the `data` field of the envelope contains. */
  returns: string;
}

const LIMIT = (max: number, def: number): EndpointParam => ({
  name: "limit", in: "query", required: false, type: "integer",
  description: `Maximum results to return (default ${def}, max ${max}).`,
});
const OFFSET: EndpointParam = { name: "offset", in: "query", required: false, type: "integer", description: "Number of results to skip for pagination." };
const TYPE: EndpointParam = { name: "type", in: "query", required: false, type: "string", description: "Filter by entity type (e.g. star, planet, galaxy).", example: "star" };
const DOMAIN: EndpointParam = { name: "domain", in: "query", required: false, type: "string", description: "Filter by domain (science, culture, astrology)." };

export const ENDPOINTS: EndpointDef[] = [
  {
    id: "entities-list", group: "entities", method: "GET", path: "/api/v0/entities",
    summary: "List entities", status: "implemented",
    description: "Paginated list of canonical entities, sorted by stable id. Every item carries its id, type, name, domain, and canonical path.",
    params: [TYPE, DOMAIN, LIMIT(1000, 100), OFFSET],
    example: "/api/v0/entities?type=planet&limit=8",
    returns: "{ total, offset, limit, count, items: Entity[] }",
  },
  {
    id: "entity-get", group: "entities", method: "GET", path: "/api/v0/entities/{id}",
    summary: "Get one entity", status: "implemented",
    description: "Resolve a single entity by its stable id, including its typed relationships (with direction and the entity on the other end).",
    params: [{ name: "id", in: "path", required: true, type: "string", description: "Stable entity id (type:slug).", example: "planet:mars" }],
    example: "/api/v0/entities/planet:mars",
    returns: "Entity & { relationships: RelationshipEdge[] }",
  },
  {
    id: "relationships-list", group: "relationships", method: "GET", path: "/api/v0/relationships",
    summary: "List relationships", status: "implemented",
    description: "Paginated list of typed, domain-tagged relationships. Filter by relation type, domain, or a specific from/to entity id.",
    params: [
      { name: "type", in: "query", required: false, type: "string", description: "Filter by relation type." },
      DOMAIN,
      { name: "from", in: "query", required: false, type: "string", description: "Filter to relationships originating at this entity id." },
      { name: "to", in: "query", required: false, type: "string", description: "Filter to relationships pointing at this entity id." },
      LIMIT(2000, 200), OFFSET,
    ],
    example: "/api/v0/relationships?from=planet:mars",
    returns: "{ total, offset, limit, count, items: Relationship[] }",
  },
  {
    id: "search", group: "search", method: "GET", path: "/api/v0/search",
    summary: "Search entities", status: "implemented",
    description: "Deterministic, non-semantic entity search over name, aliases, and id. Ranking is fixed (exact > prefix > alias > substring); there is no AI or fuzzy relevance.",
    params: [
      { name: "q", in: "query", required: true, type: "string", description: "Search query.", example: "andromeda" },
      TYPE, DOMAIN, LIMIT(100, 20),
    ],
    example: "/api/v0/search?q=andromeda&limit=5",
    returns: "{ query, count, results: SearchHit[] }",
  },
  {
    id: "traversal", group: "traversal", method: "GET", path: "/api/v0/traversal",
    summary: "Traverse the graph", status: "implemented",
    description: "Breadth-first traversal from a start entity, returning nodes and edges. Cycle-protected and bounded by maxDepth and limit; truncation is reported in warnings.",
    params: [
      { name: "start", in: "query", required: true, type: "string", description: "Start entity id.", example: "star:sirius" },
      { name: "maxDepth", in: "query", required: false, type: "integer", description: "Traversal depth (default 2, max 5)." },
      { name: "relationTypes", in: "query", required: false, type: "string", description: "Comma-separated relation types to follow." },
      { name: "domain", in: "query", required: false, type: "string", description: "Restrict to science, culture/astrology (interpretive), or all." },
      LIMIT(500, 100),
    ],
    example: "/api/v0/traversal?start=star:sirius&maxDepth=2",
    returns: "{ start, nodes[], edges[], truncated, warnings[] }",
  },
  {
    id: "datasets-list", group: "datasets", method: "GET", path: "/api/v0/datasets",
    summary: "List datasets", status: "implemented",
    description: "The full open-data catalogue — domain datasets and graph-level datasets — with real record counts, licenses, formats, and status.",
    params: [],
    example: "/api/v0/datasets",
    returns: "{ count, datasets: CatalogueEntry[] }",
  },
  {
    id: "dataset-get", group: "datasets", method: "GET", path: "/api/v0/datasets/{id}",
    summary: "Get one dataset", status: "implemented",
    description: "Metadata for a single dataset by id, including its formats and (where a pre-generated file exists) real size and sha256.",
    params: [{ name: "id", in: "path", required: true, type: "string", description: "Dataset id.", example: "stars" }],
    example: "/api/v0/datasets/stars",
    returns: "CatalogueEntry",
  },
  {
    id: "images-list", group: "images", method: "GET", path: "/api/v0/images",
    summary: "List scientific images", status: "implemented",
    description: "Catalogue of verified scientific images with depicted object, capturing instrument, source, and license. Image files retain their upstream license.",
    params: [LIMIT(200, 50)],
    example: "/api/v0/images?limit=10",
    returns: "{ total, count, items: Image[] }",
  },
  {
    id: "live-sky-providers", group: "live-sky", method: "GET", path: "/api/v0/live-sky/providers",
    summary: "List live-sky providers", status: "implemented",
    description: "The registry of external providers the live-sky layer is designed to integrate. Every provider reports its integration status honestly (currently all planned).",
    params: [],
    example: "/api/v0/live-sky/providers",
    returns: "{ count, connected, providers: Provider[] }",
  },
  {
    id: "openapi", group: "meta", method: "GET", path: "/api/v0/openapi.json",
    summary: "OpenAPI document", status: "implemented",
    description: "The OpenAPI 3.1 description of every implemented endpoint. Planned endpoints are intentionally absent from the spec.",
    params: [],
    example: "/api/v0/openapi.json",
    returns: "OpenAPI 3.1 document",
  },
  {
    id: "contribution-types", group: "contributions", method: "GET", path: "/api/v0/contribution-types",
    summary: "List contribution types", status: "implemented",
    description: "The typed contribution models the scientific review workflow accepts, with their required targets, review track, and quality impact. Read-only.",
    params: [],
    example: "/api/v0/contribution-types",
    returns: "{ count, contributionTypes: ContributionType[] }",
  },
  {
    id: "review-states", group: "contributions", method: "GET", path: "/api/v0/review-states",
    summary: "List review states", status: "implemented",
    description: "The contribution review-state machine: every state, its description, and its valid next states. Read-only.",
    params: [],
    example: "/api/v0/review-states",
    returns: "{ count, states: ReviewState[] }",
  },
  {
    id: "contribution-guidelines", group: "contributions", method: "GET", path: "/api/v0/contribution-guidelines",
    summary: "Contribution guidelines", status: "implemented",
    description: "The workflow's core principle, contribution types, review states, roles, and security model — everything a future contributor or client needs. Read-only.",
    params: [],
    example: "/api/v0/contribution-guidelines",
    returns: "{ principle, types, states, roles, security }",
  },

  /* -------------------------------------------------------------- planned */
  {
    id: "contributions-submit", group: "contributions", method: "POST", path: "/api/v1/contributions",
    summary: "Submit a contribution", status: "planned",
    description: "Planned (v1, future). Would accept a structured proposal for review. NOT implemented: there is no write endpoint, no authentication, and no persistence in this program.",
    params: [],
    returns: "Accepted proposal receipt (not available)",
  },
  {
    id: "relationship-get", group: "relationships", method: "GET", path: "/api/v0/relationships/{id}",
    summary: "Get one relationship", status: "planned",
    description: "Planned. Relationship ids (from|type|to) are not URL-safe as path segments; today, filter the list endpoint by from/to/type instead.",
    params: [{ name: "id", in: "path", required: true, type: "string", description: "Relationship id (from|type|to)." }],
    returns: "Relationship",
  },
  {
    id: "live-sky-observations", group: "live-sky", method: "GET", path: "/api/v0/live-sky/{provider}/now",
    summary: "Live observations", status: "planned",
    description: "Planned. Requires a connected external provider; no provider is connected yet, so no live data is served. The provider registry above is real.",
    params: [{ name: "provider", in: "path", required: true, type: "string", description: "Provider key." }],
    returns: "Live observation data (not available)",
  },
];

export const IMPLEMENTED_ENDPOINTS = ENDPOINTS.filter((e) => e.status === "implemented");
export const PLANNED_ENDPOINTS = ENDPOINTS.filter((e) => e.status === "planned");

export function endpointsByGroup(): { group: string; endpoints: EndpointDef[] }[] {
  const groups = new Map<string, EndpointDef[]>();
  for (const e of ENDPOINTS) {
    const list = groups.get(e.group) ?? [];
    list.push(e);
    groups.set(e.group, list);
  }
  return [...groups.entries()].map(([group, endpoints]) => ({ group, endpoints }));
}

export function getEndpointGroup(group: string): EndpointDef[] {
  return ENDPOINTS.filter((e) => e.group === group);
}

export const ENDPOINT_GROUPS = [...new Set(ENDPOINTS.map((e) => e.group))];
