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

const DESCRIPTION = "Client libraries for the public API, in Python and JavaScript/TypeScript. The OpenAPI 3.1 spec makes a typed client generatable today; curated, published SDK packages are architecture-ready.";
export const metadata: Metadata = buildMetadata({ title: "Open Platform — SDKs", description: DESCRIPTION, path: `${ROUTES.openPlatform}/sdk` });

export default function OpenPlatformSdkPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
    { name: "SDKs", url: `${ROUTES.openPlatform}/sdk` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Open Platform · SDKs</span>} title="Client libraries" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="sdk" />
        <CapabilityCards records={engine.openPlatform.byCategory("sdk")} />
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="font-display text-base font-semibold text-fg">Generate a client today</h2>
          <p className="mt-2 text-sm text-muted">
            No package is published yet, but the{" "}
            <Link href="/api/v0/openapi.json" className="text-ember underline-offset-4 hover:underline">OpenAPI 3.1 spec</Link>{" "}
            supports client generation now (for example with <code className="rounded bg-white/5 px-1">openapi-generator</code>). A curated, versioned SDK is architecture-ready.
          </p>
        </section>
      </Container>
    </>
  );
}
