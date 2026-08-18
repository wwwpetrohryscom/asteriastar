import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SearchExplorer } from "@/components/search/SearchExplorer";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "Search everything above Earth — stars, planets, galaxies, missions, telescopes, astronomers, guides, and tools, all drawn from the platform's canonical registries.";

/**
 * Full search results.
 *
 * CRAWL SAFETY: `noindex, follow` — /search?q=… can generate unbounded URL
 * combinations, and indexing them would flood the site with thin, duplicative
 * pages that compete with the real entity pages they point at. `follow` is kept
 * so link equity still flows to those destinations, which are individually
 * indexable. The canonical points at bare /search, so the query-string variants
 * consolidate rather than fragmenting.
 */
export const metadata: Metadata = {
  ...buildMetadata({ title: "Search", description: DESCRIPTION, path: ROUTES.search }),
  robots: { index: false, follow: true },
  alternates: { canonical: ROUTES.search },
};

export default function SearchPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Search", url: ROUTES.search },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Universal search</span>}
        title="Search the universe"
        lead="One search across every catalogued object, topic, guide, dataset and tool. Identifiers work too — try M31, NGC 224, HD 128620 or 67P."
      />
      <Container className="mt-8 mb-16">
        <Suspense fallback={<p className="text-muted">Loading search…</p>}>
          <SearchExplorer />
        </Suspense>
      </Container>
    </>
  );
}
