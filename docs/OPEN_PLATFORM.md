# Open Astronomy Platform (Program BX)

The capstone: AsteriaStar not just as an encyclopedia but as an **open, research-grade data platform** —
the whole knowledge graph, queryable, exportable, downloadable, and licensed for reuse. Built with the
same honesty envelope as everything else: what is live is real, and what is not yet built says so.

## Reuse first

BX adds almost no new machinery — it **consolidates and documents** what the platform already exposes
and adds the few missing pieces. The public API is the existing `/api/v0/{entities,relationships,search,
traversal,citations,datasets}` endpoints; the graph exports are the existing `/data/graph.json` and
`/data/graph.jsonld`; the datasets are the existing dataset catalogue. **New in BX:** the `/api/v0/sources`
endpoint, the real bulk-download manifest, and the capability catalogue that describes it all honestly.

## Available now (11 capabilities)

- **Public Graph API** — read-only REST over the whole graph: entities, relationships, search,
  neighbourhood traversal, shortest paths, sources, citations. Provenance envelope on every response.
- **OpenAPI 3.1 spec** (`/api/v0/openapi.json`) — auto-generated from the endpoint registry.
- **Sources API** (`/api/v0/sources`) — the authoritative source registry, the provenance behind every fact.
- **Citation export** — real citations in APA/BibTeX/RIS/… via the citation engine.
- **Graph exports** — JSON (`/data/graph.json`) and RDF-compatible **JSON-LD** (`/data/graph.jsonld`).
- **Dataset exports** — every curated dataset as JSON/CSV.
- **Bulk downloads** — with **real SHA-256 checksums** (see below).
- **Versioned releases** — graph and schema versions, pinned in every response.
- **Licensing matrix** — CC BY-SA 4.0 for the platform + each source's terms.

## No fake downloads — verifiable checksums

`src/lib/open-platform/graph-exports.ts` holds the canonical serialisers `buildGraphJson()` and
`buildGraphJsonLd()`. **Both the export routes and the download manifest use them**, so a download's
advertised size and SHA-256 are computed from *exactly* the bytes served — never fabricated. You can
verify a download yourself (`shasum -a 256 graph.json`), and the build gate does too: it recomputes each
checksum from the served content and **fails the build** on any mismatch.

## Architecture-ready (7 capabilities) — honest, not faked

Each has a defined interface built on the live data, but serves no data yet and **advertises no live
endpoint**. Stated plainly on every card, with what it still needs:

- **SPARQL endpoint** — the RDF/JSON-LD is live and loads into any triple store; a hosted SPARQL service
  is next.
- **GraphQL API** — schema maps onto the graph; the resolver layer is not yet served.
- **Python & JavaScript SDKs** — generatable from the OpenAPI spec today; curated packages are next.
- **DOI-minted releases** — versioned, checksummed releases exist; DOI registration is next.
- **Federation metadata** — resolvable IRIs exist in the JSON-LD; a formal federation manifest is next.
- **Virtual Observatory (TAP/ADQL)** — the catalogues hold the real columns; a TAP service is next.

The endpoint registry records `graph-sparql` and `graph-graphql` as **`planned`**, so they never appear
in the OpenAPI spec as implemented.

## Engine & pages

`engine.openPlatform` (capabilities + honest status + release). Pages
`/open-platform/{api,graph,datasets,downloads,licenses,sdk,federation,roadmap}` and `/developers/platform`.
The capabilities are platform-feature meta-nodes, excluded from scientific graph traversal.
