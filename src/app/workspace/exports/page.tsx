import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { ExportsPanel } from "@/components/workspace/ExportsPanel";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "Export your whole workspace to JSON, Markdown, BibTeX, or CSV, print a clean research packet, or re-import a JSON export. Everything is generated in your browser — nothing is uploaded.";
export const metadata: Metadata = buildMetadata({ title: "Workspace — Exports", description: DESCRIPTION, path: `${ROUTES.workspace}/exports` });

export default function ExportsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Workspace", url: ROUTES.workspace },
    { name: "Exports", url: `${ROUTES.workspace}/exports` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Workspace · Exports</span>} title="Exports &amp; Printable Packet" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <WorkspaceTabs active="exports" />
        <ExportsPanel />
      </Container>
    </>
  );
}
