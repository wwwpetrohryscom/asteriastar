import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { EntityCard } from "@/components/graph/EntityCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getEntityById } from "@/knowledge-graph";
import { RELATIONSHIP_PAGES } from "@/lib/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, connectionPath } from "@/lib/routes";

const DESCRIPTION =
  "Curated paths through the Asteria Star knowledge graph — featured objects, missions, and connections to start exploring everything above Earth.";

export const metadata: Metadata = buildMetadata({
  title: "Discover",
  description: DESCRIPTION,
  path: ROUTES.discover,
});

const FEATURED_IDS = [
  "star:sirius",
  "planet:jupiter",
  "galaxy:andromeda-galaxy",
  "space_telescope:james-webb-space-telescope",
  "constellation:orion",
  "black_hole:sagittarius-a-star",
  "nebula:orion-nebula",
  "dwarf_planet:pluto",
];

export default function DiscoverPage() {
  const featured = FEATURED_IDS.map((id) => getEntityById(id)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );

  const connectionCards = RELATIONSHIP_PAGES.map((p) => ({
    title: p.title,
    description: p.description,
    href: connectionPath(p.slug),
    accent: "aurora" as const,
  }));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Explore", url: ROUTES.explore },
    { name: "Discover", url: ROUTES.discover },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Discover", description: DESCRIPTION, url: ROUTES.discover }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Curated</span>}
        title="Discover"
        lead="A starting point for exploring the universe — featured objects and the connections between them."
      />

      <Container className="mt-10">
        <h2 className="font-display text-2xl font-bold">Featured in the graph</h2>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((entity) => (
            <li key={entity.id} className="contents">
              <EntityCard entity={entity} />
            </li>
          ))}
        </ul>
      </Container>

      <Container className="mt-16 mb-12">
        <RelatedLinks title="Explore by connection" items={connectionCards} columns={3} />
      </Container>
    </>
  );
}
