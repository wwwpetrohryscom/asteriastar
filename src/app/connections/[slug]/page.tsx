import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EntityCard } from "@/components/graph/EntityCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { RELATIONSHIP_PAGES, getRelationshipPage } from "@/lib/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, connectionPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return RELATIONSHIP_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/connections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getRelationshipPage(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: connectionPath(page.slug),
  });
}

export default async function ConnectionPage({ params }: PageProps<"/connections/[slug]">) {
  const { slug } = await params;
  const page = getRelationshipPage(slug);
  if (!page) notFound();

  const entities = page.resolve();
  const url = connectionPath(page.slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Explore", url: ROUTES.explore },
    { name: page.title, url },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: page.title, description: page.description, url }),
        ]}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Connection · {entities.length} entities</span>}
        title={page.title}
        lead={page.description}
      />

      <Container className="mt-8 mb-10">
        {page.note && (
          <p className="mb-6 text-sm text-faint">{page.note}</p>
        )}
        {entities.length === 0 ? (
          <p className="scientific-card p-6 text-muted">
            These connections are being added to the knowledge graph.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entities.map((entity) => (
              <li key={entity.id} className="contents">
                <EntityCard entity={entity} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
