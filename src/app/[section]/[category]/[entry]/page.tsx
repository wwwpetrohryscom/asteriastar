import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EntryHeader } from "@/components/entry/EntryHeader";
import { EntryBody } from "@/components/entry/EntryBody";
import { EntryFacts } from "@/components/entry/EntryFacts";
import { EntryKeyPoints } from "@/components/entry/EntryKeyPoints";
import { EntrySourceList } from "@/components/entry/EntrySourceList";
import { EntryRelatedGrid } from "@/components/entry/EntryRelatedGrid";
import { EntryDisclaimer } from "@/components/entry/EntryDisclaimer";
import { EntryNavigation } from "@/components/entry/EntryNavigation";
import { KnowledgeConnections } from "@/components/entry/KnowledgeConnections";
import { EntityRecommendations } from "@/components/graph/EntityRecommendations";
import { EntityDataPanel } from "@/components/graph/EntityDataPanel";
import { EntityQualityPanel } from "@/components/authority/EntityQualityPanel";
import { EntryGallery } from "@/components/entry/EntryGallery";
import { EntryTimeline } from "@/components/entry/EntryTimeline";
import { EntryRelatedMissions } from "@/components/entry/EntryRelatedMissions";
import {
  getAllEntryParams,
  getEntriesByCategory,
  getEntry,
  getEntityForEntry,
  getRelatedEntries,
} from "@/content/entries";
import { getCategory } from "@/lib/content/registry";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleSchema,
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
} from "@/lib/seo/jsonld";
import { categoryPath, sectionPath } from "@/lib/routes";
import { accentVars } from "@/lib/theme";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEntryParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/[section]/[category]/[entry]">): Promise<Metadata> {
  const { section, category, entry } = await params;
  const found = getEntry(section, category, entry);
  if (!found) return {};
  return buildMetadata({
    title: found.seoTitle,
    description: found.seoDescription,
    path: found.path,
    ogType: "article",
    keywords: found.tags,
  });
}

export default async function EntryPage({
  params,
}: PageProps<"/[section]/[category]/[entry]">) {
  const { section: sectionSlug, category: categorySlug, entry: entrySlug } =
    await params;

  const entry = getEntry(sectionSlug, categorySlug, entrySlug);
  const taxonomy = getCategory(sectionSlug, categorySlug);
  if (!entry || !taxonomy) notFound();
  const { section, category } = taxonomy;

  const catHref = categoryPath(section, category);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: section.name, url: sectionPath(section) },
    { name: category.name, url: catHref },
    { name: entry.title, url: entry.path },
  ];

  const structured =
    entry.jsonLdType === "CollectionPage"
      ? collectionPageSchema({
          name: entry.title,
          description: entry.seoDescription,
          url: entry.path,
        })
      : articleSchema({
          headline: entry.title,
          description: entry.seoDescription,
          url: entry.path,
        });

  // Previous / next within the category.
  const siblings = getEntriesByCategory(sectionSlug, categorySlug);
  const index = siblings.findIndex((e) => e.slug === entry.slug);
  const previous = index > 0 ? siblings[index - 1] : undefined;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined;

  const related = getRelatedEntries(entry);
  const graphEntity = getEntityForEntry(entry);

  return (
    <div style={accentVars(section.accent)}>
      <JsonLd data={[breadcrumbSchema(crumbs), structured]} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <EntryHeader
        entry={entry}
        accent={section.accent}
        sectionName={section.name}
        categoryName={category.name}
        categoryHref={catHref}
      />

      <Container className="mt-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <EntryDisclaimer entry={entry} />
            <EntryBody sections={entry.body} />
            <KnowledgeConnections entry={entry} />
            {section.slug === "astronomy" && (
              <EntryGallery name={entry.title} entryPath={entry.path} />
            )}
            <EntryTimeline items={entry.timeline} />
            <EntryRelatedGrid
              entries={related}
              accent={section.accent}
              eyebrow={section.name}
            />
            {graphEntity && <EntryRelatedMissions entityId={graphEntity.id} />}
            {graphEntity && <EntityRecommendations entityId={graphEntity.id} />}
            <EntryNavigation
              previous={previous}
              next={next}
              categoryName={category.name}
              categoryHref={catHref}
            />
          </div>

          <aside className="space-y-6">
            <EntryFacts facts={entry.facts} />
            <EntryKeyPoints points={entry.keyPoints} />
            {graphEntity && <EntityDataPanel entity={graphEntity} />}
            {graphEntity && <EntityQualityPanel entity={graphEntity} />}
            <EntrySourceList keys={entry.sources} />
          </aside>
        </div>
      </Container>
    </div>
  );
}
