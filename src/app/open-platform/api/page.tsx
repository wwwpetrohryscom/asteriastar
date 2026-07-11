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
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "The public read-only REST API over the whole knowledge graph — entities, relationships, search, neighbourhood traversal, shortest paths, sources, and citations. Every response carries a provenance envelope; no auth, no rate limits, no write endpoints.";
export const metadata: Metadata = buildMetadata({ title: "Open Platform — Public API", description: DESCRIPTION, path: `${ROUTES.openPlatform}/api` });

export default function OpenPlatformApiPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
    { name: "API", url: `${ROUTES.openPlatform}/api` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Open Platform · Public API</span>} title="The public Graph API" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="api" />
        <CapabilityCards records={engine.openPlatform.byCategory("api")} />
        <p className="mt-8 text-sm text-muted">
          The full machine-readable contract is the{" "}
          <Link href="/api/v0/openapi.json" className="text-nasa underline-offset-4 hover:underline">OpenAPI 3.1 spec</Link>, and the reference lives at{" "}
          <Link href="/developers/api" className="text-nasa underline-offset-4 hover:underline">/developers/api</Link>.
        </p>
      </Container>
    </>
  );
}
