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

const DESCRIPTION = "Machine-readable exports of the whole knowledge graph — a single JSON document and an RDF-compatible, SPARQL-ready JSON-LD document — plus the linked-data query standards (SPARQL, GraphQL) the platform is built for.";
export const metadata: Metadata = buildMetadata({ title: "Open Platform — Graph Exports", description: DESCRIPTION, path: `${ROUTES.openPlatform}/graph` });

export default function OpenPlatformGraphPage() {
  // The graph page presents the graph exports and the linked-data standards built on them.
  const records = [...engine.openPlatform.byCategory("graph"), ...engine.openPlatform.byCategory("standards")];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
    { name: "Graph", url: `${ROUTES.openPlatform}/graph` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Open Platform · Graph exports</span>} title="The graph as linked data" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="graph" />
        <CapabilityCards records={records} />
        <p className="mt-8 text-sm text-muted">
          The JSON-LD at{" "}
          <Link href="/data/graph.jsonld" className="text-nasa underline-offset-4 hover:underline">/data/graph.jsonld</Link>{" "}
          loads into any triple store today. A hosted SPARQL endpoint and a GraphQL API are architecture-ready — see the{" "}
          <Link href={`${ROUTES.openPlatform}/roadmap`} className="text-nasa underline-offset-4 hover:underline">roadmap</Link>.
        </p>
      </Container>
    </>
  );
}
