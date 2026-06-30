# Platform Architecture

Phase 8 establishes **Asteria Platform Core**. The website is one client; the
platform is the foundation for every future interface (mobile, desktop, public
API, AI applications, planetariums, education). The **knowledge graph is the
operating core** — everything references entities; nothing references pages.
Pages are views. Entities are reality.

The browsable overview is at [`/platform`](../src/app/platform/page.tsx); the
code lives in [`src/platform/`](../src/platform).

## Layers

Seven independent layers with an **acyclic** dependency contract
([`src/platform/layers.ts`](../src/platform/layers.ts)):

```
Presentation → Explorer → Knowledge → Graph → Registry → Data → Source
```

| Layer | Owns | May depend on |
| --- | --- | --- |
| Presentation | `app`, `components` | everything below |
| Explorer | `lib/discovery`, `lib/search`, `lib/compare` | knowledge, graph, data, source |
| Knowledge | `content`, `lib/content`, `lib/learn`, `lib/timelines` | graph, data, source |
| Graph | `knowledge-graph` | source |
| Registry | `platform` | graph, knowledge, explorer, data, source |
| Data | `lib/datasets`, `lib/media`, `lib/citations` | graph, source |
| Source | `lib/sources` | — |

The **Graph layer is the core**: it never imports a layer above it. Cross-cutting
utilities (`lib/routes`, `lib/site`, `lib/seo`, `lib/navigation`) are
unclassified and exempt.

**Enforcement.** [`scripts/check-architecture.ts`](../scripts/check-architecture.ts)
scans every import edge in `src/` and fails the build on any edge that violates
the allowlist. Because the allowlist is a DAG, a pass also proves there are no
circular dependencies between layers. It runs first in `npm run validate`.

## Entity Runtime

[`src/platform/runtime.ts`](../src/platform/runtime.ts) provides one abstraction
for "everything about an entity":

```ts
const entity = resolveEntity("planet:mars");
// → a unified RuntimeEntity:
//   identity:      id, type, typeLabel, domain, domainLabel, status,
//                  name, aliases, description, scientificName,
//                  catalogNumbers, importance
//   access:        canonicalPath
//   relationships: relationCount, connections, connectionsByDomain,
//                  related, recommendations
//   provenance:    sources, images
//   knowledge:     entries, primaryEntry, datasets, timelines,
//                  learningPaths, topics
//   versioning:    version, locale, localized
```

Every client resolves an entity through the runtime instead of re-querying each
subsystem. Cross-subsystem membership (datasets, timelines, learning paths,
topics) is indexed once at module load, so resolution is O(1) lookups.

## Universal Registry

[`src/platform/registry.ts`](../src/platform/registry.ts) is a registry of
registries. Nothing exists outside a registry: entities, relationships, schema,
datasets, images, citations, sources, explorers, learning, timelines,
components, locales, and extensions each register with a typed descriptor and a
**live** count.

## Universal Metadata

[`src/platform/metadata.ts`](../src/platform/metadata.ts) generates every
metadata facet from one `RuntimeEntity` — canonical, SEO, Open Graph, citation,
dataset, graph, and machine — so nothing is hand-duplicated. The standalone
entity page's `generateMetadata` is generated this way.

## Universal Search Core

[`src/platform/search-core.ts`](../src/platform/search-core.ts) defines the
typed search contract: providers (entities, relationships, datasets, learning
paths, comparisons, guides, images, organizations, astronomers, missions), every
result tracing back to a graph entity. Architecture only — the live engine is
not implemented; the current static index is `src/lib/search.ts`.

## Components

The reusable [card family](../src/components/platform/cards.tsx) (Knowledge,
Relationship, Dataset, Mission, Astronomer, Comparison, Learning, Timeline,
Explorer, Gallery, Observation) sits over one shared `PlatformCard` surface so
every client composes the same UI. The catalogue is the Component Registry
([`src/platform/component-registry.ts`](../src/platform/component-registry.ts)) —
metadata only, so the Registry layer never imports the Presentation layer.

## Navigation

A premium grouped mega-menu
([`src/components/site/PlatformNav.tsx`](../src/components/site/PlatformNav.tsx),
driven by [`src/lib/navigation.ts`](../src/lib/navigation.ts)) keeps the header
uncluttered: a few group triggers each reveal a multi-column panel on hover or
keyboard focus — pure CSS, no hydration.

## Scientific Data Engine

The [`src/platform/data-engine/`](../src/platform/data-engine) (Registry layer)
is the execution layer: 17 pure, framework-independent modules that every
consumer reads through. It delegates to the runtime, metadata, authority,
localization, and `lib/*` subsystems (no duplicated logic) and adds the new graph
traversal and scientific query engines. Enforced framework-independence (no
React/Next/UI imports) via `npm run check:arch`. See
[SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md).

## Authority layer

Within the Registry layer, [`src/platform/authority/`](../src/platform/authority)
adds the scientific-trust surface: evidence framework, provenance, review,
object-level versioning, editorial status, and data-quality indicators, plus the
derived authority snapshot. `validateAuthority()` runs inside `validatePlatform()`.
See [SCIENTIFIC_AUTHORITY.md](./SCIENTIFIC_AUTHORITY.md).

## See also

- [Entity Identifiers](./ENTITY_IDENTIFIERS.md) · [Knowledge Graph Schema](./KNOWLEDGE_GRAPH_SCHEMA.md)
- [Localization](./LOCALIZATION.md) · [Extensions](./EXTENSIONS.md)
- [Scientific Authority](./SCIENTIFIC_AUTHORITY.md) · [Evidence Framework](./EVIDENCE_FRAMEWORK.md) · [Provenance Model](./PROVENANCE_MODEL.md)
- [Open Data](./OPEN_DATA.md) · [API Overview](./API_OVERVIEW.md) · [Versioning](./VERSIONING_STRATEGY.md)
