import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CitationDemo } from "@/components/authority/CitationDemo";
import { StatusBadge } from "@/components/data/StatusBadge";
import { IMPLEMENTED_ENDPOINTS, CATALOGUE_STATS } from "@/platform/open-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "Developer documentation for the Asteria Star Open Celestial Data Platform. The read-only Open Data API v0 is live — versioned, typed, engine-backed JSON with a provenance envelope. Broader API surfaces are planned.";

export const metadata: Metadata = buildMetadata({ title: "Developers", description: DESCRIPTION, path: ROUTES.developers });

/** Future API surfaces that are designed but not yet implemented. */
const PLANNED_APIS: { name: string; description: string }[] = [
  { name: "Timeline API", description: "Curated, sourced chronologies." },
  { name: "Comparison API", description: "Compare two entities or concepts." },
  { name: "Discovery API", description: "Graph-derived recommendations for an entity." },
  { name: "Learning Path API", description: "Structured learning journeys." },
  { name: "Live Sky API", description: "Real observational data — once a provider is connected and its licensing verified." },
];

const PORTAL: { title: string; description: string; status: "Live" | "Planned" | "Architecture"; href?: string; linkLabel?: string }[] = [
  { title: "API Reference", description: "Every implemented endpoint, its parameters, and runnable examples.", status: "Live", href: ROUTES.developersApi, linkLabel: "API reference" },
  { title: "OpenAPI 3.1", description: "Machine-readable spec of the live API.", status: "Live", href: "/api/v0/openapi.json", linkLabel: "openapi.json" },
  { title: "API Status", description: "What is implemented, prepared, and planned.", status: "Live", href: "/developers/status", linkLabel: "Status" },
  { title: "Data Portal", description: "Datasets, exports, schemas, licensing, provenance, and quality.", status: "Live", href: ROUTES.data, linkLabel: "Data portal" },
  { title: "Entity Documentation", description: "Every entity self-documents its metadata, provenance, and connections.", status: "Live", href: ROUTES.entityIndex, linkLabel: "Entity index" },
  { title: "Schema & Registry", description: "Entity and relation types, identifiers, and the registry.", status: "Live", href: ROUTES.registry, linkLabel: "Registry" },
  { title: "SDK", description: "Typed client libraries for the public API.", status: "Planned", href: "/developers/sdk", linkLabel: "SDK" },
  { title: "Rate limits", description: "None today — read-only, static, cacheable.", status: "Architecture", href: "/developers/rate-limits", linkLabel: "Rate limits" },
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
        eyebrow={<span>Open Data API · v0</span>}
        title="Developers"
        lead="Asteria Star is designed to be consumed by applications, researchers, and AI. The read-only Open Data API v0 is live today; broader API surfaces are planned and clearly labelled."
      />

      <Container className="mt-8 mb-12 space-y-10">
        <aside className="flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
          <span aria-hidden className="mt-0.5 text-emerald-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-fg">The read-only API v0 is live.</strong> {IMPLEMENTED_ENDPOINTS.length} engine-backed
            endpoints, a provenance envelope on every response, and an{" "}
            <Link href="/api/v0/openapi.json" className="text-nebula underline-offset-4 hover:underline">OpenAPI 3.1 spec</Link>.
            Start at the <Link href={ROUTES.developersApi} className="text-nebula underline-offset-4 hover:underline">API reference</Link>{" "}
            or the <Link href={ROUTES.data} className="text-nebula underline-offset-4 hover:underline">data portal</Link>.
          </p>
        </aside>

        <section aria-labelledby="api-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="api-heading" className="font-display text-2xl font-bold">Open Data API (v0)</h2>
            <StatusBadge status="implemented" />
          </div>
          <p className="mt-2 max-w-2xl text-muted">
            Read-only, deterministic, engine-backed JSON. {CATALOGUE_STATS.total} datasets are catalogued; every response is a
            projection of the knowledge graph.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {IMPLEMENTED_ENDPOINTS.map((e) => (
              <li key={e.id}>
                <Link href={e.example ?? ROUTES.developersApi} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 font-mono text-xs text-faint transition hover:border-white/25 hover:text-fg">
                  <span><span className="text-emerald-300">{e.method}</span> {e.path}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={ROUTES.developersApi} className="mt-4 inline-block text-sm text-nebula underline-offset-4 hover:underline">Full API reference →</Link>
        </section>

        <section aria-labelledby="planned-heading">
          <div className="flex items-center gap-3">
            <h2 id="planned-heading" className="font-display text-2xl font-bold">Planned API surface</h2>
            <StatusBadge status="planned" />
          </div>
          <p className="mt-2 max-w-2xl text-muted">Designed, not yet implemented. Listed for transparency and never exposed as fake endpoints.</p>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLANNED_APIS.map((c) => (
              <li key={c.name} className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-5">
                <h3 className="font-display text-base font-semibold text-fg">{c.name}</h3>
                <p className="mt-1 text-sm text-muted">{c.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="citation-heading">
          <h2 id="citation-heading" className="font-display text-2xl font-bold">Citation engine</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Reusable citation formatting generated from structured metadata — never fabricated. One real reference, every
            supported style:
          </p>
          <div className="mt-5">
            <CitationDemo />
          </div>
        </section>

        <section aria-labelledby="portal-heading">
          <h2 id="portal-heading" className="font-display text-2xl font-bold">Developer portal</h2>
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
