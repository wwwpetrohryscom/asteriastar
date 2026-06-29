import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TIMELINES } from "@/lib/timelines";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, timelinePath } from "@/lib/routes";

const DESCRIPTION =
  "Chronologies of everything above Earth — space missions, telescope launches, planet discoveries, and the history of astronomy.";

export const metadata: Metadata = buildMetadata({
  title: "Timelines",
  description: DESCRIPTION,
  path: ROUTES.timelines,
});

export default function TimelinesIndexPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Timelines", url: ROUTES.timelines },
  ];
  const items = TIMELINES.map((t) => ({
    title: t.title,
    description: t.description,
    href: timelinePath(t.slug),
    accent: t.accent,
    eyebrow: `${t.events.length} events`,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Timelines", description: DESCRIPTION, url: ROUTES.timelines }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="stone"
        eyebrow={<span>Timeline engine</span>}
        title="Timelines"
        lead="The story of the universe and our exploration of it, in chronological order."
      />
      <Container className="mt-8 mb-12">
        <SectionGrid items={items} columns={2} />
      </Container>
    </>
  );
}
