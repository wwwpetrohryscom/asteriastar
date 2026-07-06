import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { CollectionsManager } from "@/components/workspace/CollectionsManager";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "Organise your saved entities into collections, ordered reading lists, and observation projects — all held privately in your browser.";
export const metadata: Metadata = buildMetadata({ title: "Workspace — Collections", description: DESCRIPTION, path: `${ROUTES.workspace}/collections` });

export default function CollectionsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Workspace", url: ROUTES.workspace },
    { name: "Collections", url: `${ROUTES.workspace}/collections` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Workspace · Organising</span>} title="Collections" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <WorkspaceTabs active="collections" />
        <CollectionsManager />
      </Container>
    </>
  );
}
