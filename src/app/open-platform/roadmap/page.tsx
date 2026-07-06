import type { Metadata } from "next";
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

const DESCRIPTION = "What is built and what is next. The available capabilities work today over the real graph; the architecture-ready ones have a defined interface built on that live data but are not yet hosted — stated honestly, with what each still needs.";
export const metadata: Metadata = buildMetadata({ title: "Open Platform — Roadmap", description: DESCRIPTION, path: `${ROUTES.openPlatform}/roadmap` });

export default function OpenPlatformRoadmapPage() {
  const e = engine.openPlatform;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
    { name: "Roadmap", url: `${ROUTES.openPlatform}/roadmap` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Open Platform · {e.stats.available} available · {e.stats.byStatus["architecture-ready"]} architecture-ready</span>} title="Roadmap" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="roadmap" />
        <section aria-labelledby="now">
          <h2 id="now" className="font-display text-2xl font-bold">Available now</h2>
          <div className="mt-4"><CapabilityCards records={e.available()} /></div>
        </section>
        <section aria-labelledby="next" className="mt-12">
          <h2 id="next" className="font-display text-2xl font-bold">Architecture-ready</h2>
          <p className="mt-1 text-sm text-muted">Each is built on the live data and states honestly what it still needs to go live — no endpoint is advertised until it serves real data.</p>
          <div className="mt-4"><CapabilityCards records={e.byStatus("architecture-ready")} /></div>
        </section>
      </Container>
    </>
  );
}
