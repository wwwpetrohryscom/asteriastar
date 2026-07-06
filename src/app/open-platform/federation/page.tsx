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

const DESCRIPTION = "Interoperability with the wider linked-data and astronomy ecosystem — resolvable IRIs for federation, and an interface prepared for the International Virtual Observatory Alliance protocols (TAP/ADQL). The linked-data foundation is live; the federation and VO services are architecture-ready.";
export const metadata: Metadata = buildMetadata({ title: "Open Platform — Federation", description: DESCRIPTION, path: `${ROUTES.openPlatform}/federation` });

export default function OpenPlatformFederationPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
    { name: "Federation", url: `${ROUTES.openPlatform}/federation` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Open Platform · Federation</span>} title="Federation & the Virtual Observatory" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="federation" />
        <CapabilityCards records={engine.openPlatform.byCategory("federation")} />
      </Container>
    </>
  );
}
