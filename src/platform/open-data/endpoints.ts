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
    id: "assistant-explain", group: "assistant", method: "GET", path: "/api/v0/assistant/explain",
    summary: "Grounded entity explanation", status: "implemented",
    description: "A grounded explanation of an entity — its description, its real graph relations, and its cited sources. Deterministic; no language model. Nothing is generated or invented.",
    params: [{ name: "id", in: "query", required: true, type: "string", description: "Entity id to explain.", example: "planet:mars" }],
    example: "/api/v0/assistant/explain?id=planet:mars",
    returns: "{ entity, description?, sources?, links[], citations[] }",
  },
  {
    id: "assistant-compare", group: "assistant", method: "GET", path: "/api/v0/assistant/compare",
    summary: "Grounded concept comparison", status: "implemented",
    description: "Compares two entities by the real common ground between them — the entities they both connect to in the graph. Deterministic; no language model.",
    params: [
      { name: "a", in: "query", required: true, type: "string", description: "First entity id.", example: "planet:mars" },
      { name: "b", in: "query", required: true, type: "string", description: "Second entity id.", example: "planet:venus" },
    ],
    example: "/api/v0/assistant/compare?a=planet:mars&b=planet:venus",
    returns: "{ a, b, shared: Ref[] }",
  },
  {
    id: "assistant-path", group: "assistant", method: "GET", path: "/api/v0/assistant/path",
    summary: "Shortest evidence path", status: "implemented",
    description: "The shortest evidence path between two entities — a real chain of graph relations. Deterministic; no language model. 404 with an honest message when no path exists.",
    params: [
      { name: "from", in: "query", required: true, type: "string", description: "Start entity id.", example: "astronomer:edwin-hubble" },
      { name: "to", in: "query", required: true, type: "string", description: "Target entity id.", example: "cosmology_concept:dark-energy" },
    ],
    example: "/api/v0/assistant/path?from=astronomer:edwin-hubble&to=cosmology_concept:dark-energy",
    returns: "{ from, to, length, path: NeighborNode[] }",
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
    id: "citations-list", group: "citations", method: "GET", path: "/api/v0/citations",
    summary: "List citations", status: "implemented",
    description: "The real citation registry — source-backed references across flagship entities and datasets, with DOIs where verified. Filter by type, source, entity, or dataset.",
    params: [
      { name: "type", in: "query", required: false, type: "string", description: "Filter by citation type (e.g. peer_reviewed_paper, dataset)." },
      { name: "source", in: "query", required: false, type: "string", description: "Filter by source-registry key (e.g. nasa, esa)." },
      { name: "entity", in: "query", required: false, type: "string", description: "Filter to citations supporting an entity id." },
      { name: "dataset", in: "query", required: false, type: "string", description: "Filter to citations supporting a dataset slug." },
      { name: "limit", in: "query", required: false, type: "integer", description: "Maximum results (default 200, max 500)." },
      { name: "offset", in: "query", required: false, type: "integer", description: "Pagination offset." },
    ],
    example: "/api/v0/citations?type=peer_reviewed_paper",
    returns: "{ total, offset, limit, count, items: Citation[] }",
  },
  {
    id: "citation-get", group: "citations", method: "GET", path: "/api/v0/citations/{id}",
    summary: "Get one citation", status: "implemented",
    description: "A single citation by id, including its type, DOI (if verified), links to entities/datasets/provenance, and formatted references.",
    params: [{ name: "id", in: "path", required: true, type: "string", description: "Citation id.", example: "cite:mayor-queloz-1995" }],
    example: "/api/v0/citations/cite:mayor-queloz-1995",
    returns: "Citation & { formats }",
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
    id: "sources-list", group: "sources", method: "GET", path: "/api/v0/sources",
    summary: "List authoritative sources", status: "implemented",
    description: "The platform's source registry — every source's name, organisation, canonical URL, scope, authority type, and usage terms. The provenance behind every cited fact.",
    params: [],
    example: "/api/v0/sources",
    returns: "{ count, sources: Source[] }",
  },
  {
    id: "graph-sparql", group: "graph", method: "POST", path: "/api/v0/graph/sparql",
    summary: "SPARQL query (architecture-ready)", status: "planned",
    description: "A SPARQL 1.1 query endpoint over the graph's RDF. Architecture-ready: the JSON-LD/RDF export is live at /data/graph.jsonld and loads into any triple store today; a hosted SPARQL service is not yet available. No live endpoint is advertised.",
    params: [],
    example: "/api/v0/graph/sparql",
    returns: "SPARQL results (planned)",
  },
  {
    id: "graph-graphql", group: "graph", method: "POST", path: "/api/v0/graph/graphql",
    summary: "GraphQL query (architecture-ready)", status: "planned",
    description: "A GraphQL endpoint over the same typed graph. Architecture-ready: the schema maps onto the graph and the REST API delivers the same data today; the resolver layer is not yet served.",
    params: [],
    example: "/api/v0/graph/graphql",
    returns: "GraphQL results (planned)",
  },
  {
    id: "live-sky-providers", group: "live-sky", method: "GET", path: "/api/v0/live-sky/providers",
    summary: "List live-sky providers", status: "implemented",
    description: "The registry of external providers the live-sky layer is designed to integrate. Every provider reports its integration status honestly: NOAA SWPC and NASA DONKI are connected, the rest are planned.",
    params: [],
    example: "/api/v0/live-sky/providers",
    returns: "{ count, connected, providers: Provider[] }",
  },
  {
    id: "live-sky-moon", group: "live-sky", method: "GET", path: "/api/v0/live-sky/moon",
    summary: "Moon phase & position", status: "implemented",
    description: "The computed Moon (method: computed — not a live provider feed), with its own honesty envelope. WITHOUT latitude/longitude: the global Moon phase and illuminated fraction. WITH latitude and longitude: location-aware moonrise, moonset, transit, topocentric position, phase, and horizon status for the date (polar and no-rise/no-set cases handled honestly). Location is only ever what you pass in — never inferred, geolocated, or stored.",
    params: [
      { name: "date", in: "query", required: false, type: "string", description: "Compute for a specific date (YYYY-MM-DD or ISO-8601). Defaults to the current instant / today.", example: "2026-06-29" },
      { name: "latitude", in: "query", required: false, type: "string", description: "Observer latitude, −90 to 90. When given (with longitude), returns location-aware moonrise/moonset/position.", example: "50.08" },
      { name: "longitude", in: "query", required: false, type: "string", description: "Observer longitude, −180 to 180. Required together with latitude.", example: "14.44" },
      { name: "timezone", in: "query", required: false, type: "string", description: "IANA timezone id for local event times (e.g. Europe/Prague). Defaults to UTC.", example: "Europe/Prague" },
    ],
    example: "/api/v0/live-sky/moon?latitude=50.08&longitude=14.44&timezone=Europe/Prague",
    returns: "MoonData & { envelope }  |  MoonPositionData & { envelope }",
  },
  {
    id: "live-sky-sun", group: "live-sky", method: "GET", path: "/api/v0/live-sky/sun",
    summary: "Sun & twilight times", status: "implemented",
    description: "Sunrise, sunset, solar noon, civil/nautical/astronomical twilight, day length, and a solar summary for an EXPLICIT location and date, deterministically COMPUTED from the public-domain NOAA Solar Calculator algorithm (method: computed — not a live provider feed). Polar day/night is handled honestly (null events + a status). Location is only ever what you pass in — never inferred, geolocated, or stored.",
    params: [
      { name: "latitude", in: "query", required: true, type: "string", description: "Observer latitude as a decimal number, −90 to 90.", example: "50.08" },
      { name: "longitude", in: "query", required: true, type: "string", description: "Observer longitude as a decimal number, −180 to 180.", example: "14.44" },
      { name: "date", in: "query", required: false, type: "string", description: "Civil date (YYYY-MM-DD). Defaults to today (UTC).", example: "2025-06-21" },
      { name: "timezone", in: "query", required: false, type: "string", description: "IANA timezone id for local times (e.g. Europe/Prague). Defaults to UTC.", example: "Europe/Prague" },
    ],
    example: "/api/v0/live-sky/sun?latitude=50.08&longitude=14.44&date=2025-06-21&timezone=Europe/Prague",
    returns: "SunData & { envelope }",
  },
  {
    id: "live-sky-planets", group: "live-sky", method: "GET", path: "/api/v0/live-sky/planets",
    summary: "Planet visibility & rise/set", status: "implemented",
    description: "Computed, location-aware visibility for the naked-eye planets (Mercury–Saturn; Uranus/Neptune via ?planet): rise, set, transit, topocentric position, approximate magnitude, and conservative honest observing rules (method: computed — not a live provider feed). Positions use the public-domain NASA/JPL approximate planetary elements. Location is only ever what you pass in — never inferred, geolocated, or stored.",
    params: [
      { name: "latitude", in: "query", required: true, type: "string", description: "Observer latitude as a decimal number, −90 to 90.", example: "50.08" },
      { name: "longitude", in: "query", required: true, type: "string", description: "Observer longitude as a decimal number, −180 to 180.", example: "14.44" },
      { name: "date", in: "query", required: false, type: "string", description: "Civil date (YYYY-MM-DD). Defaults to today.", example: "2025-06-21" },
      { name: "timezone", in: "query", required: false, type: "string", description: "IANA timezone id for local times (e.g. Europe/Prague). Defaults to UTC.", example: "Europe/Prague" },
      { name: "planet", in: "query", required: false, type: "string", description: "One planet (mercury|venus|mars|jupiter|saturn|uranus|neptune). Default is the five naked-eye planets.", example: "jupiter" },
    ],
    example: "/api/v0/live-sky/planets?latitude=50.08&longitude=14.44&timezone=Europe/Prague",
    returns: "PlanetVisibilityData & { envelope }",
  },
  {
    id: "live-sky-tonight", group: "live-sky", method: "GET", path: "/api/v0/live-sky/tonight",
    summary: "Tonight observing dashboard", status: "implemented",
    description: "A computed COMPOSITE of the Sun & Twilight, Moon, and Planet engines (method: computed_composite — not a live provider feed): twilight/darkness summary and night type, Moon phase/rise/set/position and moonlight impact, ranked naked-eye planet visibility, and best observing windows for an EXPLICIT location and date. It invents no weather, cloud, seeing, ISS, aurora, meteor, or comet data; a sub-engine failure yields a null section plus a limitation. Location is only ever what you pass in — never inferred, geolocated, or stored.",
    params: [
      { name: "latitude", in: "query", required: true, type: "string", description: "Observer latitude as a decimal number, −90 to 90.", example: "50.08" },
      { name: "longitude", in: "query", required: true, type: "string", description: "Observer longitude as a decimal number, −180 to 180.", example: "14.44" },
      { name: "date", in: "query", required: false, type: "string", description: "Civil date (YYYY-MM-DD). Defaults to today.", example: "2025-06-21" },
      { name: "timezone", in: "query", required: false, type: "string", description: "IANA timezone id for local times (e.g. Europe/Prague). Defaults to UTC.", example: "Europe/Prague" },
    ],
    example: "/api/v0/live-sky/tonight?latitude=50.08&longitude=14.44&timezone=Europe/Prague",
    returns: "TonightObservingData & { envelope }",
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
    summary: "Live observations by provider key", status: "planned",
    description: "Planned. A generic per-provider observation endpoint. The connected space-weather providers are already served by the /api/v0/live/space-weather endpoints below, which return each product in its own honesty envelope; this generic form awaits the ephemeris and orbital providers.",
    params: [{ name: "provider", in: "path", required: true, type: "string", description: "Provider key." }],
    returns: "Live observation data (not available)",
  },

  /* ---------------------------------------------------------------- live providers (Program CJ) */
  {
    id: "live-space-weather", group: "live", method: "GET", path: "/api/v0/live/space-weather",
    summary: "Current space weather", status: "implemented",
    description: "Every current space-weather product from NOAA SWPC in one response: real-time solar wind and interplanetary magnetic field at L1, the propagated solar-wind series, observed and forecast planetary K-index, the R/S/G scales, the alert stream, the GOES X-ray flare state, the daily active-region report, the 10.7 cm radio flux, and the OVATION aurora forecast. Each product carries its own honesty envelope: provider, exact source URL, the provider's timestamp, freshness status, cache window, licence and limitations. A product that could not be read is present with a status and a reason and NO data key.",
    params: [],
    example: "/api/v0/live/space-weather",
    returns: "Record<productName, LiveEnvelope>",
  },
  {
    id: "live-space-weather-solar", group: "live", method: "GET", path: "/api/v0/live/space-weather/solar",
    summary: "Solar activity", status: "implemented",
    description: "The GOES X-ray flare state, NOAA's daily numbered active regions with sunspot and magnetic classifications, the 10.7 cm radio flux, and NASA CCMC DONKI's curated flare and CME catalogues. The operational reading and the curated catalogue are separate keys and are never merged: they have different latencies and answer different questions.",
    params: [],
    example: "/api/v0/live/space-weather/solar",
    returns: "Record<productName, LiveEnvelope>",
  },
  {
    id: "live-space-weather-geomagnetic", group: "live", method: "GET", path: "/api/v0/live/space-weather/geomagnetic",
    summary: "Geomagnetic activity", status: "implemented",
    description: "The planetary K-index observed and forecast, the NOAA R/S/G scales, and SWPC's watch, warning and alert stream. Every Kp point carries a provenance field of observed, estimated or predicted, so no consumer has to guess whether a value is a measurement or a forecast.",
    params: [],
    example: "/api/v0/live/space-weather/geomagnetic",
    returns: "Record<productName, LiveEnvelope>",
  },
  {
    id: "live-space-weather-events", group: "live", method: "GET", path: "/api/v0/live/space-weather/events",
    summary: "Space weather events", status: "implemented",
    description: "NASA CCMC DONKI's catalogued solar flares, coronal mass ejections, geomagnetic storms and solar energetic particle events. An empty array means the catalogue held no records in the window, which is not the same as nothing having happened: DONKI is analyst-curated and lags events by hours.",
    params: [],
    example: "/api/v0/live/space-weather/events",
    returns: "Record<productName, LiveEnvelope>",
  },
  {
    id: "live-providers", group: "live", method: "GET", path: "/api/v0/live/providers",
    summary: "Live provider health", status: "implemented",
    description: "Every live provider and product: its terms, authentication, documented rate limits, cache window, publication cadence, stale threshold, and what THIS server instance has actually observed of it — last attempt, last success, latency, consecutive failures and schema state. There is no uptime percentage and no reliability score: this deployment retains no operational history, so a long-run figure would be invented.",
    params: [],
    example: "/api/v0/live/providers",
    returns: "{ totals, providers: LiveProviderReport[] }",
  },

  /* ------------------------------------------------------- near-Earth objects (Program CK) */
  {
    id: "live-neo", group: "live", method: "GET", path: "/api/v0/live/neo",
    summary: "Near-Earth objects", status: "implemented",
    description: "Every near-Earth object feed in one response: close approaches within 0.05 au over the next 60 days, the CNEOS Sentry impact-risk table, newly catalogued objects, and the Minor Planet Center's unconfirmed candidates. Close-approach times are TDB, not UTC. Impact probabilities are JPL's own and carry JPL's statement that they can be inaccurate by a factor of ten; AsteriaStar computes none of its own.",
    params: [],
    example: "/api/v0/live/neo",
    returns: "{ totals, closeApproaches, sentry, recent, candidates } — each an envelope",
  },
  {
    id: "live-neo-close-approaches", group: "live", method: "GET", path: "/api/v0/live/neo/close-approaches",
    summary: "Close approaches", status: "implemented",
    description: "Near-Earth objects passing within 0.05 au over the next 60 days, each resolved against AsteriaStar's catalogue. Every approach carries its nominal distance in astronomical units, kilometres and lunar distances, the provider's 3-sigma minimum and maximum, and the 3-sigma uncertainty in the approach time — a nominal distance served without its bounds would turn a prediction with real error bars into a fact.",
    params: [],
    example: "/api/v0/live/neo/close-approaches",
    returns: "LiveEnvelope<ResolvedCloseApproach[]>",
  },
  {
    id: "live-neo-object", group: "live", method: "GET", path: "/api/v0/live/neo/{designation}",
    summary: "One object across the live feeds", status: "implemented",
    description: "Everything the four live feeds currently say about one object. This endpoint does NOT proxy the provider: the designation comes from the request, and no value from a request is ever placed into a provider URL. The feeds are loaded from their own constant URLs and matched locally, so a designation absent here is absent from these four feeds — not from JPL's database.",
    params: [{ name: "designation", in: "path", required: true, type: "string", description: "Object designation, 1-40 characters of letters, digits, spaces, dots, slashes or hyphens.", example: "99942" }],
    example: "/api/v0/live/neo/99942",
    returns: "{ designation, foundInLiveFeeds, catalogue, closeApproaches, sentry, recentEntry, confirmationPageCandidate }",
  },

  /* ------------------------------------------------------------- satellites (Program CL) */
  {
    id: "live-satellites", group: "live", method: "GET", path: "/api/v0/live/satellites",
    summary: "Tracked satellites", status: "implemented",
    description: "Every satellite AsteriaStar tracks live, which is one: the International Space Station, from NASA Johnson Space Center's published operational ephemeris. The response states its own coverage explicitly rather than leaving it to be inferred from a single-element array.",
    params: [],
    example: "/api/v0/live/satellites",
    returns: "{ trackedCount, coverage, satellites[], providers[] }",
  },
  {
    id: "live-satellite", group: "live", method: "GET", path: "/api/v0/live/satellites/{id}",
    summary: "One satellite's current state", status: "implemented",
    description: "Position, altitude, speed and measured nodal period for one satellite, plus `frameVerification` — the measured disagreement between this platform's coordinate transformation and NASA's own published equator-crossing longitudes from the same file. A consumer relying on these positions is entitled to see how far they can be trusted, measured rather than claimed. `current` is null when the published ephemeris does not cover the present moment; nothing is extrapolated past its end.",
    params: [{ name: "id", in: "path", required: true, type: "string", description: "Satellite id. The only recognised value is `iss` (also accepts 25544).", example: "iss" }],
    example: "/api/v0/live/satellites/iss",
    returns: "{ id, name, ephemeris, current, frameVerification[] }",
  },
  {
    id: "live-satellite-passes", group: "live", method: "GET", path: "/api/v0/live/satellites/{id}/passes",
    summary: "Visible passes for an explicit location", status: "implemented",
    description: "Pass predictions for coordinates you supply. The coordinates are used to evaluate a pure function and are NOT logged, stored, counted or transmitted anywhere; nothing is inferred, geolocated or defaulted, and omitting them returns an error rather than a guess. Each pass states whether it is actually visible — sunlit station, dark sky — or which of those conditions failed. No weather is modelled. Note that the website itself does not call this endpoint: the pass page ships orbital data to the browser and computes there, so a reader's coordinates never leave their device at all.",
    params: [
      { name: "id", in: "path", required: true, type: "string", description: "Satellite id; `iss` only.", example: "iss" },
      { name: "latitude", in: "query", required: true, type: "string", description: "Observer latitude in decimal degrees, -90 to 90.", example: "51.4779" },
      { name: "longitude", in: "query", required: true, type: "string", description: "Observer longitude in decimal degrees, -180 to 180.", example: "-0.0015" },
      { name: "hours", in: "query", required: false, type: "integer", description: "Window length in hours (default 48, maximum 240). Predictions stop where the published ephemeris stops." },
    ],
    example: "/api/v0/live/satellites/iss/passes?latitude=51.4779&longitude=-0.0015&hours=48",
    returns: "{ observer, windowHours, minimumElevationDeg, passes[] }",
  },

  /* --------------------------------------------------- the observing calendar (Program CM) */
  {
    id: "live-events", group: "live", method: "GET", path: "/api/v0/live/events",
    summary: "Observing calendar", status: "implemented",
    description: "A year of dated astronomical events, each carrying the provenance of its date. `basis` is one of `computed` (derived here, with `method` naming the algorithm and version), `source-backed` (published by an authority, with `source` naming it), `forecast` (an annual recurrence, approximate to about a day) or `planned` (somebody's intention, with `source.lastVerifiedAt` giving the time it was last confirmed). `precision` says how much of the timestamp means anything \u2014 a launch scheduled to the quarter is not a timestamp to the minute \u2014 and `confirmed` is false for everything that can still move. Categories whose provider could not be reached are reported in `gaps` rather than silently omitted.",
    params: [],
    example: "/api/v0/live/events",
    returns: "{ window, events: AstronomicalEvent[], gaps, providers }",
  },
  {
    id: "live-events-eclipses", group: "live", method: "GET", path: "/api/v0/live/events/eclipses",
    summary: "Eclipse catalogue", status: "implemented",
    description: "Every solar and lunar eclipse of the twenty-first century, reproduced from NASA/GSFC's Five Millennium Catalog by Espenak and Meeus. The catalogue's instants are Terrestrial Dynamical Time; `greatestEclipseUtc` is that time less the catalogue's own `deltaTSeconds`, and both are returned so the arithmetic can be checked rather than trusted. These are the circumstances of GREATEST eclipse only \u2014 not local circumstances, which need the Besselian elements NASA publishes separately.",
    params: [],
    example: "/api/v0/live/events/eclipses",
    returns: "{ solar, lunar } \u2014 each an envelope around a CatalogueEclipse[]",
  },
  {
    id: "live-events-launches", group: "live", method: "GET", path: "/api/v0/live/events/launches",
    summary: "Upcoming launches", status: "implemented",
    description: "The upcoming orbital launch schedule from Launch Library 2, maintained by The Space Devs \u2014 a community aggregation of operator and agency announcements, NOT a schedule published by any space agency. Every date is a No Earlier Than value that moves, often by weeks. `netPrecision` is the provider's own statement of how precisely the date is known, from the second down to the year, and `lastUpdated` is when the provider last confirmed the entry; both are passed through unchanged because without them a launch date cannot be used honestly.",
    params: [],
    example: "/api/v0/live/events/launches",
    returns: "LiveEnvelope<{ total, launches: UpcomingLaunch[] }>",
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
