import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OpenPlatformNav } from "@/components/open-platform/OpenPlatformNav";
import { CapabilityCards } from "@/components/open-platform/CapabilityCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "AsteriaStar as an open, research-grade data platform. A public read-only Graph API over the whole knowledge graph, JSON and JSON-LD/RDF exports, per-dataset downloads, bulk downloads with real SHA-256 checksums, versioned releases, and a clear licensing matrix — all live today. The linked-data standards it is built for — a hosted SPARQL endpoint, a GraphQL API, Python and JavaScript SDKs, DOI-minted releases, federation metadata, and Virtual Observatory (TAP/ADQL) — are described honestly as architecture-ready, and serve no fabricated data.";

export const metadata: Metadata = buildMetadata({ title: "Open Astronomy Platform", description: DESCRIPTION, path: ROUTES.openPlatform });

export default function OpenPlatformHubPage() {
  const e = engine.openPlatform;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Open Astronomy Platform", description: DESCRIPTION, url: ROUTES.openPlatform })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Open data · {e.stats.available} available · {e.stats.byStatus["architecture-ready"]} architecture-ready · data {e.version.graphVersion}</span>}
        title="Open Astronomy Platform"
        lead="The whole knowledge graph, open. A read-only public API, machine-readable exports in JSON and RDF-compatible JSON-LD, bulk downloads with verifiable checksums, and clear licensing — live today. The standards a research platform is measured by — SPARQL, GraphQL, SDKs, DOI releases, Virtual-Observatory interoperability — are here too, described honestly as architecture-ready, never faked."
      />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="" />
        <section aria-labelledby="available-heading">
          <h2 id="available-heading" className="font-display text-2xl font-bold">Available now</h2>
          <p className="mt-1 text-sm text-muted">Working today over the real graph — each with a live endpoint or export.</p>
          <div className="mt-4"><CapabilityCards records={e.available()} /></div>
        </section>
        <section aria-labelledby="arch-heading" className="mt-12">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="arch-heading" className="font-display text-2xl font-bold">Architecture-ready</h2>
            <Link href={`${ROUTES.openPlatform}/roadmap`} className="text-sm text-nasa hover:underline">The roadmap →</Link>
          </div>
          <p className="mt-1 text-sm text-muted">Defined interfaces built on the live data, not yet hosted — and honest about it. No fabricated endpoints.</p>
          <div className="mt-4"><CapabilityCards records={e.byStatus("architecture-ready")} /></div>
        </section>
        <section aria-labelledby="dev-heading" className="mt-12 scientific-card p-5">
          <h2 id="dev-heading" className="font-display text-base font-semibold text-fg">For developers</h2>
          <p className="mt-2 text-sm text-muted">
            Start at the{" "}
            <Link href="/developers/platform" className="text-nasa underline-offset-4 hover:underline">platform overview for developers</Link>, browse the{" "}
            <Link href="/api/v0/openapi.json" className="text-nasa underline-offset-4 hover:underline">OpenAPI 3.1 spec</Link>, or pull the whole graph from{" "}
            <Link href="/data/graph.json" className="text-nasa underline-offset-4 hover:underline">/data/graph.json</Link>. Every API response carries a provenance envelope; the graph and API are licensed CC BY-SA 4.0.
          </p>
        </section>
      </Container>
    </>
  );
}
