import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { COMPARISONS } from "@/lib/compare";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, comparePath } from "@/lib/routes";

const DESCRIPTION =
  "Side-by-side comparisons of the objects, missions, and ideas of the universe — drawn from the Asteria Star knowledge graph.";

export const metadata: Metadata = buildMetadata({
  title: "Compare",
  description: DESCRIPTION,
  path: ROUTES.compare,
});

export default function CompareIndexPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Compare", url: ROUTES.compare },
  ];
  const items = COMPARISONS.map((c) => ({
    title: c.title,
    description: c.description,
    href: comparePath(c.slug),
    accent: "nebula" as const,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Compare", description: DESCRIPTION, url: ROUTES.compare }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Comparison engine</span>}
        title="Compare"
        lead="Understand the universe by contrast — objects, missions, and ideas side by side, drawn from the knowledge graph."
      />
      <Container className="mt-8 mb-12">
        <SectionGrid items={items} columns={2} />
      </Container>
    </>
  );
}
