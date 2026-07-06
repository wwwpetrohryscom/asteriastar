import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { PrivacyPanel } from "@/components/workspace/PrivacyPanel";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "The workspace is private by construction: everything lives in your browser's localStorage, with no account, no server persistence, no cookie, and no tracking. See exactly what is stored, and erase all of it with one control.";
export const metadata: Metadata = buildMetadata({ title: "Workspace — Privacy", description: DESCRIPTION, path: `${ROUTES.workspace}/privacy` });

export default function PrivacyPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Workspace", url: ROUTES.workspace },
    { name: "Privacy", url: `${ROUTES.workspace}/privacy` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Workspace · Privacy</span>} title="Privacy by construction" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <WorkspaceTabs active="privacy" />
        <PrivacyPanel />
      </Container>
    </>
  );
}
