import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ExplorationTable } from "@/components/exploration/ExplorationTable";
import { ExplorationCards } from "@/components/exploration/ExplorationCards";
import { EXPLORATION_DISCOVERIES, getExplorationDiscovery } from "@/app/exploration/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, explorationDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return EXPLORATION_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exploration/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getExplorationDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: explorationDiscoveryPath(slug) });
}

export default async function ExplorationDiscoverPage({ params }: PageProps<"/exploration/discover/[slug]">) {
  const { slug } = await params;
  const d = getExplorationDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Exploration", url: ROUTES.exploration },
    { name: d.title, url: explorationDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: explorationDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{records.length} {records.length === 1 ? "entry" : "entries"}.</p>
        {records.length === 0 ? (
          <p className="text-muted">No matching entries.</p>
        ) : d.view === "missions" ? (
          <ExplorationTable records={records} />
        ) : (
          <ExplorationCards records={records} />
        )}
      </Container>
    </>
  );
}
