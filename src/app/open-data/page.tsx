import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GRAPH_VERSION_INFO } from "@/knowledge-graph";
import { DATASETS } from "@/lib/datasets";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "Asteria Star is open infrastructure for structured celestial knowledge: a versioned, machine-readable knowledge graph with open datasets, registries, and documented API contracts.";

export const metadata: Metadata = buildMetadata({ title: "Open Data", description: DESCRIPTION, path: ROUTES.openData });

export default function OpenDataPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Data", url: ROUTES.openData },
  ];
  const v = GRAPH_VERSION_INFO;

  const principles = [
    { title: "Knowledge first", description: "The knowledge graph is the product. Every page, explorer, and future app reads from it." },
    { title: "Stable identifiers", description: "Every entity has a permanent type:slug id (e.g. star:sirius) that never changes or recycles." },
    { title: "Open standards", description: "JSON and JSON-LD today; RDF/SPARQL-ready, with GraphQL and REST contracts documented." },
    { title: "Machine- & human-readable", description: "Structured for search engines, LLMs, researchers, and developers — and clear for people." },
    { title: "Versioned", description: "Graph, schema, and dataset versions for long-term compatibility." },
    { title: "Sourced, never invented", description: "Facts cite authoritative sources; nothing is fabricated, including datasets and downloads." },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Open Data", description: DESCRIPTION, url: ROUTES.openData }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="halo"
        eyebrow={<span>Open Celestial Data Platform</span>}
        title="Open data"
        lead="The website is one interface; the knowledge graph is the product. Asteria Star is being built as open infrastructure for structured celestial knowledge."
      >
        <p className="mt-6 text-sm text-faint">
          Graph v{v.graphVersion} · schema v{v.schemaVersion} · dataset v{v.datasetVersion} · {v.entityCount} entities · {v.relationCount} relations · {v.license}
        </p>
      </HeroSection>

      <Container className="mt-10 mb-12 space-y-12">
        <section aria-labelledby="access-heading">
          <h2 id="access-heading" className="font-display text-2xl font-bold">Access the graph</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: ROUTES.data, title: "Data Portal", desc: "Datasets, exports, schemas, licensing, provenance & quality.", data: false },
              { href: "/api/v0/entities", title: "Open Data API v0", desc: "Read-only, engine-backed JSON endpoints (live).", data: true },
              { href: ROUTES.datasets, title: "Datasets", desc: `${DATASETS.length} open datasets (JSON, CSV, JSON-LD).`, data: false },
              { href: ROUTES.developersApi, title: "API reference", desc: "Endpoints, parameters, examples & OpenAPI.", data: false },
              { href: "/data/graph.json", title: "graph.json", desc: "The full graph as JSON.", data: true },
              { href: "/data/graph.jsonld", title: "graph.jsonld", desc: "JSON-LD (RDF-compatible).", data: true },
            ].map((item) => {
              const className =
                "scientific-card p-5 transition hover:border-white/25 hover:bg-white/[0.04]";
              const inner = (
                <>
                  <h3 className="font-display text-lg font-semibold text-fg">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </>
              );
              // Data-export endpoints are route handlers (raw JSON/JSON-LD), not
              // navigable pages — use a plain anchor.
              return item.data ? (
                <a key={item.href} href={item.href} className={className}>{inner}</a>
              ) : (
                <Link key={item.href} href={item.href} className={className}>{inner}</Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="principles-heading">
          <h2 id="principles-heading" className="font-display text-2xl font-bold">Principles</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <li key={p.title} className="scientific-card p-5">
                <h3 className="font-display text-base font-semibold text-fg">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
