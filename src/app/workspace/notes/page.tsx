import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { NotesManager } from "@/components/workspace/NotesManager";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "Write your own research notes and attach them to saved entities. Notes are private to your browser and are included in exports and the printable packet.";
export const metadata: Metadata = buildMetadata({ title: "Workspace — Notes", description: DESCRIPTION, path: `${ROUTES.workspace}/notes` });

export default function NotesPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Workspace", url: ROUTES.workspace },
    { name: "Notes", url: `${ROUTES.workspace}/notes` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Workspace · Notes</span>} title="Notes" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <WorkspaceTabs active="notes" />
        <NotesManager />
      </Container>
    </>
  );
}
