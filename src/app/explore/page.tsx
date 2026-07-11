import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { TOPICS, getTopicEntities, RELATIONSHIP_PAGES } from "@/lib/discovery";
import { GRAPH_STATS } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, topicPath, connectionPath } from "@/lib/routes";

const DESCRIPTION =
  "Explore everything above Earth through the Asteria Star knowledge graph — browse stars, planets, galaxies, missions, telescopes, constellations, mythology, and more.";

export const metadata: Metadata = buildMetadata({
  title: "Explore",
  description: DESCRIPTION,
  path: ROUTES.explore,
});

export default function ExplorePage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Explore", url: ROUTES.explore },
  ];

  const topicCards = TOPICS.map((topic) => ({
    title: topic.title,
    description: topic.description,
    href: topicPath(topic.slug),
    accent: topic.accent,
    eyebrow: `${getTopicEntities(topic).length} entities`,
  }));

  const relationshipCards = RELATIONSHIP_PAGES.map((page) => ({
    title: page.title,
    description: page.description,
    href: connectionPath(page.slug),
    accent: "aurora" as const,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Explore", description: DESCRIPTION, url: ROUTES.explore }),
        ]}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Knowledge graph</span>}
        title="Explore the universe"
        lead="Navigate everything above Earth through a connected graph of stars, planets, galaxies, missions, and the stories of the sky."
      >
        <p className="mt-6 text-sm text-faint">
          {GRAPH_STATS.entityCount} entities · {GRAPH_STATS.relationCount} connections · across science, culture, and astrology
        </p>
      </HeroSection>

      <Container className="mt-10">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Browse by topic</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Each topic is an A–Z index of entities in the knowledge graph.
        </p>
        <SectionGrid items={topicCards} columns={3} className="mt-6" />
      </Container>

      <Container className="mt-16">
        <RelatedLinks
          title="Explore by connection"
          items={relationshipCards}
          columns={3}
        />
      </Container>

      <Container className="mt-16 mb-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: ROUTES.entityIndex, title: "Entity index", desc: "Every entity, A–Z." },
            { href: ROUTES.topicIndex, title: "Topic index", desc: "All sections, categories, and types." },
            { href: ROUTES.discover, title: "Discover", desc: "Curated paths through the graph." },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="scientific-card p-5 transition hover:border-white/25 hover:bg-white/[0.04]"
            >
              <h3 className="font-display text-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </a>
          ))}
        </div>
      </Container>
    </>
  );
}
