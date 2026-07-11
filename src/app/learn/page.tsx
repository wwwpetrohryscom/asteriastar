import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { LEARNING_PATHS } from "@/lib/learn";
import { getHeroImageForEntity } from "@/lib/media/registry";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, learnPath } from "@/lib/routes";

const DESCRIPTION =
  "Structured learning paths through everything above Earth — guided journeys from beginner to advanced, built on the knowledge graph.";

export const metadata: Metadata = buildMetadata({
  title: "Learn",
  description: DESCRIPTION,
  path: ROUTES.learn,
});

export default function LearnIndexPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Learn", url: ROUTES.learn },
  ];
  const items = LEARNING_PATHS.map((p) => {
    const imgId = (p.relatedEntityIds ?? []).find((id) => getHeroImageForEntity(id));
    const img = imgId ? getHeroImageForEntity(imgId) : undefined;
    return {
      title: p.title,
      description: p.description,
      href: learnPath(p.slug),
      accent: p.accent,
      eyebrow: `${p.stages.length} levels`,
      image: img?.url ? { url: img.url, alt: img.alt, blurDataURL: img.blurDataURL } : undefined,
    };
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Learn", description: DESCRIPTION, url: ROUTES.learn }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="comet"
        eyebrow={<span>Learning paths</span>}
        title="Learn"
        lead="Guided journeys through the universe — from your first night under the stars to black holes and beyond."
      />
      <Container className="mt-8 mb-12">
        <SectionGrid items={items} columns={3} />
      </Container>
    </>
  );
}
