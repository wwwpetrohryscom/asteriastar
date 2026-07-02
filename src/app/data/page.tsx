import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GRAPH_VERSION_INFO } from "@/knowledge-graph";
import { CATALOGUE_STATS, DATA_SECTIONS } from "@/platform/open-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, dataPath, absoluteUrl } from "@/lib/routes";

const DESCRIPTION =
  "The Asteria Star public data portal: open datasets, checksummed exports, a read-only scientific API, schemas, identifiers, licensing, provenance, and data-quality — all derived from the canonical knowledge graph, never fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Data Portal", description: DESCRIPTION, path: ROUTES.data });

const ACCESS = [
  { href: "/api/v0/entities", title: "Read-only API v0", desc: "Ten engine-backed JSON endpoints.", badge: "Implemented" },
  { href: "/api/v0/openapi.json", title: "OpenAPI 3.1", desc: "Machine-readable spec of the live API.", badge: "Implemented" },
  { href: dataPath("exports"), title: "Checksummed exports", desc: "Real files with verifiable SHA-256.", badge: "Implemented" },
  { href: "/data/graph.json", title: "graph.json", desc: "The full knowledge graph as JSON.", badge: "Implemented" },
  { href: "/data/graph.jsonld", title: "graph.jsonld", desc: "JSON-LD (RDF-compatible).", badge: "Implemented" },
  { href: ROUTES.developersApi, title: "API reference", desc: "Endpoints, parameters, and examples.", badge: "Docs" },
];

export default function DataPortalPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Data Portal", url: ROUTES.data },
  ];
  const v = GRAPH_VERSION_INFO;

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Asteria Star Knowledge Graph",
    description: DESCRIPTION,
    url: absoluteUrl(ROUTES.data),
    version: v.graphVersion,
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "Asteria Star" },
    distribution: [
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: absoluteUrl("/data/graph.json") },
      { "@type": "DataDownload", encodingFormat: "application/ld+json", contentUrl: absoluteUrl("/data/graph.jsonld") },
    ],
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Data Portal", description: DESCRIPTION, url: ROUTES.data }),
          datasetSchema,
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="halo"
        eyebrow={<span>Open Space Data &amp; Scientific APIs</span>}
        title="Data portal"
        lead="Pages are views; entities are reality. This portal exposes the canonical knowledge graph as open datasets, checksummed exports, and a read-only scientific API — resolved through the Scientific Data Engine, never fabricated."
      >
        <p className="mt-6 text-sm text-faint">
          Graph v{v.graphVersion} · schema v{v.schemaVersion} · dataset v{v.datasetVersion} · {v.entityCount.toLocaleString()} entities · {v.relationCount.toLocaleString()} relations · {CATALOGUE_STATS.total} datasets · {v.license}
        </p>
      </HeroSection>

      <Container className="mt-8 mb-12 space-y-12">
        <aside className="flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
          <span aria-hidden className="mt-0.5 text-emerald-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-fg">Honest by construction.</strong> The read-only API and the checksummed exports are live today. Anything not yet built — SDKs, RDF/SPARQL, live-sky data — is labelled <em>planned</em> or <em>architecture</em>, never faked. Every response and download is a deterministic projection of the graph.
          </p>
        </aside>

        <section aria-labelledby="access-heading">
          <h2 id="access-heading" className="font-display text-2xl font-bold">Access the data</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACCESS.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="block h-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-base font-semibold text-fg">{a.title}</span>
                    <span className="text-[0.65rem] uppercase tracking-wider text-faint">{a.badge}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{a.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the portal</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DATA_SECTIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={dataPath(s.slug)}
                  className="block h-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <span className="text-[0.65rem] uppercase tracking-wider text-faint">{s.eyebrow}</span>
                  <span className="mt-1 block font-display text-base font-semibold text-fg">{s.title}</span>
                  <p className="mt-1 text-sm text-muted">{s.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
