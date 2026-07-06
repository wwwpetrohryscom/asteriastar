import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { CitationsManager } from "@/components/workspace/CitationsManager";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "Collect the real, source-backed citations behind the entities you study, and render them in APA, Chicago, MLA, Harvard, BibTeX, or RIS. Every field comes from a verifiable citation record — nothing is invented.";
export const metadata: Metadata = buildMetadata({ title: "Workspace — Citations", description: DESCRIPTION, path: `${ROUTES.workspace}/citations` });

export default function CitationsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Workspace", url: ROUTES.workspace },
    { name: "Citations", url: `${ROUTES.workspace}/citations` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Workspace · Citations</span>} title="Citation Folder" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <WorkspaceTabs active="citations" />
        <CitationsManager />
      </Container>
    </>
  );
}
