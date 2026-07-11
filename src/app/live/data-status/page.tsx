import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { LiveStatusPanel } from "@/components/live/LiveStatusPanel";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "The honest status of every live data provider connected to AsteriaStar — which are connected, computed, cached, stale, unavailable, or architecture-ready — with endpoints and licences. No provider is connected in this deployment, so no live value is shown; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Live Data Status", description: DESCRIPTION, path: `${ROUTES.live}/data-status` });

export default function LiveDataStatusPage() {
  const report = engine.liveScientificData.statusReport();
  const url = `${ROUTES.live}/data-status`;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live Data", url: ROUTES.live },
    { name: "Data status", url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Live Data · Status</span>} title="Live Data Status" lead="Full transparency on every provider — what it is, whether it is connected, and under what licence. This page never shows a value the platform cannot back with a real, connected source." />
      <Container className="mt-8 mb-14 space-y-8">
        <LiveStatusPanel report={report} />
        <p className="text-sm text-muted">A machine-readable version of this status is available at <Link href="/api/v0/live/status" className="text-nasa hover:underline">/api/v0/live/status</Link>. See also{" "}<Link href="/transparency/source-quality" className="text-nasa hover:underline">source quality</Link>.</p>
      </Container>
    </>
  );
}
