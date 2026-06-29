import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EntityBrowser, type BrowserItem } from "@/components/graph/EntityBrowser";
import {
  ENTITY_TYPE_LABELS,
  entityGraphPath,
  getAllGraphEntities,
  getEntityTypeCounts,
} from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "A complete, searchable A–Z index of every entity in the Asteria Star knowledge graph — stars, planets, galaxies, missions, telescopes, mythology, and more.";

export const metadata: Metadata = buildMetadata({
  title: "Entity Index",
  description: DESCRIPTION,
  path: ROUTES.entityIndex,
});

export default function EntityIndexPage() {
  const items: BrowserItem[] = getAllGraphEntities().map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    typeLabel: ENTITY_TYPE_LABELS[e.type],
    domain: e.domain,
    href: entityGraphPath(e),
  }));

  const typeFilters = getEntityTypeCounts()
    .map((t) => ({ value: t.type, label: ENTITY_TYPE_LABELS[t.type], count: t.count }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Explore", url: ROUTES.explore },
    { name: "Entity Index", url: ROUTES.entityIndex },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Entity Index", description: DESCRIPTION, url: ROUTES.entityIndex }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="stone"
        eyebrow={<span>Knowledge graph</span>}
        title="Entity index"
        lead="Every entity in the knowledge graph, searchable and grouped A–Z."
      />
      <Container className="mt-8 mb-12">
        <EntityBrowser items={items} typeFilters={typeFilters} />
      </Container>
    </>
  );
}
