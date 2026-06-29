import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { HeroSection } from "@/components/sections/HeroSection";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { GraphConnections } from "@/components/graph/GraphConnections";
import { EntityCard } from "@/components/graph/EntityCard";
import {
  ENTITY_TYPE_LABELS,
  getConnections,
  getGraphEntityByTypeSlug,
  getRelatedEntities,
  getSiblingEntities,
  getStandaloneEntities,
} from "@/knowledge-graph";
import { topicPath } from "@/lib/routes";
import { TOPICS } from "@/lib/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStandaloneEntities().map((e) => {
    const sep = e.id.indexOf(":");
    return { type: e.id.slice(0, sep), slug: e.id.slice(sep + 1) };
  });
}

function pagePath(type: string, slug: string) {
  return `/explore/entity/${type}/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps<"/explore/entity/[type]/[slug]">): Promise<Metadata> {
  const { type, slug } = await params;
  const entity = getGraphEntityByTypeSlug(type, slug);
  if (!entity) return {};
  const typeLabel = ENTITY_TYPE_LABELS[entity.type];
  return buildMetadata({
    title: entity.name,
    description:
      entity.description ?? `${entity.name} — a ${typeLabel.toLowerCase()} in the Asteria Star knowledge graph.`,
    path: pagePath(type, slug),
  });
}

export default async function GraphEntityPage({
  params,
}: PageProps<"/explore/entity/[type]/[slug]">) {
  const { type, slug } = await params;
  const entity = getGraphEntityByTypeSlug(type, slug);
  // Entities with their own content entry are served there, not here.
  if (!entity || entity.entryPath) notFound();

  const typeLabel = ENTITY_TYPE_LABELS[entity.type];
  const url = pagePath(type, slug);
  const related = getRelatedEntities(entity.id);
  const siblings = getSiblingEntities(entity);
  const hasConnections = getConnections(entity.id).length > 0;
  const topic = TOPICS.find((t) => t.types.includes(entity.type));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Explore", url: ROUTES.explore },
    { name: entity.name, url },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({
            name: entity.name,
            description: entity.description ?? entity.name,
            url,
          }),
        ]}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection
        compact
        accent={entity.domain === "culture" ? "ember" : "nebula"}
        eyebrow={<span>{typeLabel}</span>}
        title={entity.name}
        lead={entity.description}
      >
        <div className="mt-4">
          <Badge tone="accent">Knowledge graph</Badge>
        </div>
      </HeroSection>

      <Container className="mt-8 mb-12 space-y-12">
        {hasConnections && (
          <section aria-labelledby="connections-heading">
            <h2 id="connections-heading" className="font-display text-xl font-semibold text-fg">
              Connections
            </h2>
            <p className="mt-1 text-sm text-faint">
              How {entity.name} connects across Asteria Star — scientific,
              cultural, and astrological links are kept separate.
            </p>
            <div className="mt-4">
              <GraphConnections entityId={entity.id} />
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-xl font-semibold text-fg">
              Related entities
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <li key={e.id} className="contents">
                  <EntityCard entity={e} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {siblings.length > 0 && (
          <section aria-labelledby="siblings-heading">
            <div className="flex items-center justify-between gap-3">
              <h2 id="siblings-heading" className="font-display text-xl font-semibold text-fg">
                More {typeLabel.toLowerCase()}s
              </h2>
              {topic && (
                <a href={topicPath(topic.slug)} className="text-sm text-muted transition hover:text-fg">
                  Browse all →
                </a>
              )}
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((e) => (
                <li key={e.id} className="contents">
                  <EntityCard entity={e} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {entity.sources && entity.sources.length > 0 && (
          <SourceList keys={entity.sources} />
        )}
      </Container>
    </>
  );
}
