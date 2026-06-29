import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CitationDemo } from "@/components/authority/CitationDemo";
import { COMMUNITY_API_VERSION } from "@/lib/community";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "Developer documentation for the Asteria Star Open Celestial Data Platform — versioned, typed API contracts (documented; the live API is planned). Open data is available today.";

export const metadata: Metadata = buildMetadata({ title: "Developers", description: DESCRIPTION, path: ROUTES.developers });

const V = COMMUNITY_API_VERSION; // "v0"

const CONTRACTS: { name: string; description: string; endpoints: string[] }[] = [
  { name: "Entity API", description: "Fetch a graph entity and its metadata by stable id.", endpoints: [`GET /api/${V}/entities/{id}`, `GET /api/${V}/entities?type={type}`] },
  { name: "Relationship API", description: "Traverse typed relations from an entity, grouped by domain.", endpoints: [`GET /api/${V}/entities/{id}/relations`, `GET /api/${V}/relations?type={relationType}`] },
  { name: "Search API", description: "Search entities, articles, topics, and more.", endpoints: [`GET /api/${V}/search?q={query}&group={group}`] },
  { name: "Discovery API", description: "Graph-derived recommendations for an entity.", endpoints: [`GET /api/${V}/entities/{id}/recommendations`] },
  { name: "Timeline API", description: "Curated, sourced chronologies.", endpoints: [`GET /api/${V}/timelines`, `GET /api/${V}/timelines/{slug}`] },
  { name: "Comparison API", description: "Compare two entities or concepts.", endpoints: [`GET /api/${V}/compare/{slug}`] },
  { name: "Image Metadata API", description: "Provenance-first image metadata (no media bundled).", endpoints: [`GET /api/${V}/entities/{id}/images`] },
  { name: "Dataset API", description: "List datasets and download generated exports.", endpoints: [`GET /api/${V}/datasets`, `GET /api/${V}/datasets/{slug}`] },
  { name: "Learning Path API", description: "Structured learning journeys.", endpoints: [`GET /api/${V}/learn`, `GET /api/${V}/learn/{slug}`] },
];

const PORTAL: { title: string; description: string; status: string; href?: string; linkLabel?: string }[] = [
  { title: "API Documentation", description: "Versioned, typed contracts for every endpoint.", status: "Architecture", href: ROUTES.developers, linkLabel: "Contracts" },
  { title: "Entity Documentation", description: "Every entity self-documents its metadata, provenance, and connections.", status: "Live", href: ROUTES.entityIndex, linkLabel: "Entity index" },
  { title: "Dataset Documentation", description: "Schemas, formats, and download endpoints per dataset.", status: "Live", href: ROUTES.datasets, linkLabel: "Datasets" },
  { title: "Schema Documentation", description: "Entity and relation types, identifiers, and the registry.", status: "Live", href: ROUTES.registry, linkLabel: "Registry" },
  { title: "Platform Architecture", description: "Layers, runtime, registries, and extension points.", status: "Live", href: ROUTES.platform, linkLabel: "Platform" },
  { title: "SDK Documentation", description: "Client libraries for the public API.", status: "Planned" },
];

export default function DevelopersPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Developers", url: ROUTES.developers },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Developers", description: DESCRIPTION, url: ROUTES.developers }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="halo"
        eyebrow={<span>API {V} · contracts</span>}
        title="Developers"
        lead="Asteria Star is designed to be consumed by applications, researchers, and AI. These are the planned, versioned, typed API contracts — the live API is not implemented yet."
      />

      <Container className="mt-8 mb-12 space-y-10">
        <aside className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <span aria-hidden className="mt-0.5 text-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 8h.01M11 11h1v5h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-fg">Contracts, not a live API.</strong> No live API
            endpoints are implemented in this phase. Open data is, however, available
            today as static exports:{" "}
            <a href="/data/graph.json" className="text-nebula underline-offset-4 hover:underline">graph.json</a>,{" "}
            <a href="/data/graph.jsonld" className="text-nebula underline-offset-4 hover:underline">graph.jsonld</a>, and per-dataset{" "}
            <Link href={ROUTES.datasets} className="text-nebula underline-offset-4 hover:underline">JSON/CSV</Link>.
          </p>
        </aside>

        <section aria-labelledby="contracts-heading">
          <h2 id="contracts-heading" className="font-display text-2xl font-bold">API contracts</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {CONTRACTS.map((c) => (
              <li key={c.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-display text-lg font-semibold text-fg">{c.name}</h3>
                <p className="mt-1 text-sm text-muted">{c.description}</p>
                <ul className="mt-3 space-y-1.5">
                  {c.endpoints.map((e) => (
                    <li key={e} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-xs text-faint">{e}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="citation-heading">
          <h2 id="citation-heading" className="font-display text-2xl font-bold">Citation engine</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Reusable citation formatting generated from structured metadata — never
            fabricated. One real reference, every supported style:
          </p>
          <div className="mt-5">
            <CitationDemo />
          </div>
        </section>

        <section aria-labelledby="portal-heading">
          <h2 id="portal-heading" className="font-display text-2xl font-bold">Developer portal</h2>
          <p className="mt-2 max-w-2xl text-muted">
            The documentation surface for building on the platform. Architecture
            today; the SDK and live API are planned.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PORTAL.map((d) => (
              <li key={d.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-fg">{d.title}</h3>
                  <span className="text-[0.65rem] uppercase tracking-wider text-faint">{d.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{d.description}</p>
                {d.href && (
                  <Link href={d.href} className="mt-2 inline-block text-sm text-nebula underline-offset-4 hover:underline">
                    {d.linkLabel ?? "Open"} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
