import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EntityCard } from "@/components/graph/EntityCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { TOPICS, getTopic, getTopicEntities, groupByInitial } from "@/lib/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, topicPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/explore/[topic]">): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  return buildMetadata({
    title: topic.title,
    description: topic.description,
    path: topicPath(topic.slug),
  });
}

export default async function TopicPage({ params }: PageProps<"/explore/[topic]">) {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const entities = getTopicEntities(topic);
  const groups = groupByInitial(entities);
  const url = topicPath(topic.slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Explore", url: ROUTES.explore },
    { name: topic.title, url },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: topic.title, description: topic.description, url }),
        ]}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection
        compact
        accent={topic.accent}
        eyebrow={<span>Explore · {entities.length} entities</span>}
        title={topic.title}
        lead={topic.description}
      />

      <Container className="mt-8 mb-10 space-y-10">
        {entities.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-muted">
            This topic is part of the knowledge graph and is being expanded.
            Entities will appear here as they are added.
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.letter} aria-label={`Entries starting with ${group.letter}`}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-display text-2xl font-bold text-nebula">{group.letter}</h2>
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-faint">{group.entities.length}</span>
              </div>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.entities.map((entity) => (
                  <li key={entity.id} className="contents">
                    <EntityCard entity={entity} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </Container>
    </>
  );
}
