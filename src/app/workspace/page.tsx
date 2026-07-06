import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { WorkspaceHub } from "@/components/workspace/WorkspaceHub";
import { getAllGraphEntities, entityGraphPath } from "@/knowledge-graph";
import { ENTITY_TYPE_LABELS } from "@/knowledge-graph/schema";
import { isMetaNode } from "@/lib/graph-explorer/algorithms";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";
import type { WorkspacePickItem } from "@/lib/workspace/types";

const DESCRIPTION =
  "A private, local research workspace over the AsteriaStar knowledge graph. Save any entity, organise collections, reading lists, and observation projects, take notes, collect real source-backed citations, and export to JSON, Markdown, BibTeX, or CSV. Everything lives only in your browser — no account, no server, no cookie, no tracking.";

export const metadata: Metadata = buildMetadata({ title: "Research Workspace", description: DESCRIPTION, path: ROUTES.workspace });

/** The real entity index for the find-and-save picker, built on the server (kept out of the client
 *  bundle) and excluding platform-feature meta-nodes so only real science entities can be saved. */
function pickIndex(): WorkspacePickItem[] {
  return getAllGraphEntities()
    .filter((e) => !isMetaNode(e.id))
    .map((e) => ({ id: e.id, name: e.name, type: ENTITY_TYPE_LABELS[e.type], href: entityGraphPath(e) }));
}

export default function WorkspacePage() {
  const items = pickIndex();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Workspace", url: ROUTES.workspace },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Research Workspace", description: DESCRIPTION, url: ROUTES.workspace })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="halo"
        eyebrow={<span>Private · local-only · {items.length.toLocaleString()} entities to save</span>}
        title="Research Workspace"
        lead="Your own corner of the encyclopedia — save entities, build collections and reading lists, take notes, and collect citations. It is private by construction: everything stays in your browser, with no account, no server, and no tracking."
      />
      <Container className="mt-8 mb-14">
        <WorkspaceTabs active="" />
        <WorkspaceHub items={items} />
        <p className="mt-10 text-xs text-faint">
          The workspace stores data only in this browser. See the{" "}
          <Link href={`${ROUTES.workspace}/privacy`} className="text-halo underline-offset-4 hover:underline">privacy guarantees</Link>.
        </p>
      </Container>
    </>
  );
}
