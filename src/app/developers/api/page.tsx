import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EndpointCard } from "@/components/data/EndpointCard";
import { StatusBadge } from "@/components/data/StatusBadge";
import {
  IMPLEMENTED_ENDPOINTS,
  PLANNED_ENDPOINTS,
  ENDPOINT_GROUPS,
  apiMeta,
} from "@/platform/open-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, apiGroupPath, developerDocPath, absoluteUrl } from "@/lib/routes";

const DESCRIPTION =
  "The Asteria Star Open Data API (v0): a read-only, deterministic, engine-backed JSON API. Every response carries a provenance envelope. No authentication, no rate limits, no write endpoints.";

export const metadata: Metadata = buildMetadata({ title: "API Reference", description: DESCRIPTION, path: ROUTES.developersApi });

export default function ApiReferencePage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Developers", url: ROUTES.developers },
    { name: "API", url: ROUTES.developersApi },
  ];
  const sampleEnvelope = JSON.stringify({ meta: apiMeta({ provenance: "How this response was derived." }), count: 8, data: "…" }, null, 2);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "API Reference", description: DESCRIPTION, url: ROUTES.developersApi }),
          {
            "@context": "https://schema.org",
            "@type": "WebAPI",
            name: "Asteria Star Open Data API",
            description: DESCRIPTION,
            documentation: absoluteUrl(ROUTES.developersApi),
            termsOfService: absoluteUrl("/data/licensing"),
          },
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="halo"
        eyebrow={<span>Open Data API · v0</span>}
        title="API reference"
        lead="A read-only, deterministic projection of the knowledge graph. Ten endpoints are implemented today; every response is wrapped in a provenance envelope."
      />

      <Container className="mt-8 mb-12 space-y-12">
        <section aria-labelledby="basics-heading" className="grid gap-4 lg:grid-cols-2">
          <div className="scientific-card p-5">
            <h2 id="basics-heading" className="font-display text-lg font-semibold">Basics</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li>Base path: <span className="font-mono text-fg">/api/v0</span></li>
              <li>Format: JSON, UTF-8. Method: <span className="font-mono text-fg">GET</span> only.</li>
              <li>No authentication, no API keys, no rate limits.</li>
              <li>No cookies, tracking, user data, or write/upload endpoints.</li>
              <li>Cacheable &amp; deterministic — the same request returns the same bytes for a data version.</li>
              <li>Spec: <Link href="/api/v0/openapi.json" className="text-nasa underline-offset-4 hover:underline">/api/v0/openapi.json</Link></li>
            </ul>
          </div>
          <div className="scientific-card p-5">
            <h2 className="font-display text-lg font-semibold">The response envelope</h2>
            <p className="mt-2 text-sm text-muted">Every response carries provenance metadata alongside its data:</p>
            <pre className="mt-3 max-h-64 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-[0.7rem] leading-relaxed text-faint">{sampleEnvelope}</pre>
          </div>
        </section>

        <section aria-labelledby="endpoints-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="endpoints-heading" className="font-display text-2xl font-bold">Endpoints</h2>
            <div className="flex flex-wrap gap-2">
              {ENDPOINT_GROUPS.map((g) => (
                <Link key={g} href={apiGroupPath(g)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1 text-sm text-muted transition hover:border-white/25 hover:text-fg">
                  {g}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {IMPLEMENTED_ENDPOINTS.map((e) => <EndpointCard key={e.id} endpoint={e} />)}
          </div>
        </section>

        {PLANNED_ENDPOINTS.length > 0 && (
          <section aria-labelledby="planned-heading">
            <div className="flex items-center gap-3">
              <h2 id="planned-heading" className="font-display text-2xl font-bold">Planned</h2>
              <StatusBadge status="planned" />
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted">Documented for transparency; intentionally absent from the OpenAPI spec until real.</p>
            <div className="mt-5 space-y-4">
              {PLANNED_ENDPOINTS.map((e) => <EndpointCard key={e.id} endpoint={e} />)}
            </div>
          </section>
        )}

        <nav aria-label="Developer docs" className="border-t border-white/10 pt-6">
          <p className="text-xs uppercase tracking-wider text-faint">Developer docs</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["openapi", "status", "changelog", "rate-limits", "sdk"].map((d) => (
              <Link key={d} href={developerDocPath(d)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">
                {d}
              </Link>
            ))}
          </div>
        </nav>
      </Container>
    </>
  );
}
