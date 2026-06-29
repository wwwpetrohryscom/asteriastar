import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SearchExplorer } from "@/components/search/SearchExplorer";
import { buildSearchIndex, SEARCH_GROUPS } from "@/lib/search";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "Search everything above Earth — stars, planets, galaxies, missions, telescopes, astronomers, mythology, guides, and more, all drawn from the knowledge graph.";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: DESCRIPTION,
  path: ROUTES.search,
});

export default function SearchPage() {
  const items = buildSearchIndex();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Search", url: ROUTES.search },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Search", description: DESCRIPTION, url: ROUTES.search }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Universal search</span>}
        title="Search the universe"
        lead="One search across every entity, article, topic, learning path, timeline, and comparison."
      />
      <Container className="mt-8 mb-12">
        <Suspense fallback={<p className="text-muted">Loading search…</p>}>
          <SearchExplorer items={items} groups={SEARCH_GROUPS} />
        </Suspense>
      </Container>
    </>
  );
}
