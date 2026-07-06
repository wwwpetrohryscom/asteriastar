import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { engine } from "@/platform/data-engine";
import { IMPLEMENTED_ENDPOINTS } from "@/platform/open-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "The developer entry point to the Open Astronomy Platform — the public Graph API, the OpenAPI spec, the machine-readable graph exports, bulk downloads with real checksums, and the licensing that governs reuse.";
export const metadata: Metadata = buildMetadata({ title: "Developers — Open Platform", description: DESCRIPTION, path: "/developers/platform" });

export default function DevelopersPlatformPage() {
  const e = engine.openPlatform;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Developers", url: ROUTES.developers },
    { name: "Platform", url: "/developers/platform" },
  ];
  const quickStart: { title: string; href: string; blurb: string }[] = [
    { title: "OpenAPI 3.1 spec", href: "/api/v0/openapi.json", blurb: `Machine-readable contract for all ${IMPLEMENTED_ENDPOINTS.length} implemented endpoints.` },
    { title: "API reference", href: "/developers/api", blurb: "Every endpoint, its parameters, and an example." },
    { title: "Graph export (JSON)", href: "/data/graph.json", blurb: "The whole typed graph in one document." },
    { title: "Graph export (JSON-LD)", href: "/data/graph.jsonld", blurb: "RDF-compatible, SPARQL-ready linked data." },
    { title: "Bulk downloads", href: `${ROUTES.openPlatform}/downloads`, blurb: "Real SHA-256 checksums and sizes." },
    { title: "Sources & licensing", href: `${ROUTES.openPlatform}/licenses`, blurb: "CC BY-SA 4.0 + per-source terms." },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Developers · {IMPLEMENTED_ENDPOINTS.length} endpoints · data {e.version.graphVersion}</span>}
        title="Build on the open platform"
        lead="Everything you need to build on AsteriaStar: a read-only public API with a provenance envelope on every response, machine-readable graph exports, verifiable bulk downloads, and clear licensing. No auth, no rate limits, no write endpoints."
      />
      <Container className="mt-8 mb-14">
        <section aria-labelledby="quickstart">
          <h2 id="quickstart" className="font-display text-2xl font-bold">Quick start</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickStart.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-ember/40">
                  <span className="font-display text-base font-semibold text-fg">{q.title}</span>
                  <span className="mt-1 flex-1 text-sm text-muted">{q.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="more" className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="more" className="font-display text-base font-semibold text-fg">The full platform</h2>
          <p className="mt-2 text-sm text-muted">
            See the{" "}
            <Link href={ROUTES.openPlatform} className="text-ember underline-offset-4 hover:underline">Open Astronomy Platform</Link>{" "}
            for every capability — including the architecture-ready SPARQL, GraphQL, SDK, DOI, and Virtual-Observatory interfaces, each described honestly. Provenance and quality are documented under{" "}
            <Link href="/transparency/source-quality" className="text-ember underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
