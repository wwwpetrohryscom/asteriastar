import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { HistoryCardGrid } from "@/components/history/HistoryCardGrid";
import { HISTORY_DISCOVERIES, getHistoryDiscovery } from "@/app/history/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, historyDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return HISTORY_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/history/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getHistoryDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: historyDiscoveryPath(slug) });
}

export default async function HistoryDiscoverPage({ params }: PageProps<"/history/discover/[slug]">) {
  const { slug } = await params;
  const d = getHistoryDiscovery(slug);
  if (!d) notFound();
  const cards = d.cards();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "History of Astronomy", url: ROUTES.history },
    { name: d.title, url: historyDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: historyDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{cards.length} {cards.length === 1 ? "entry" : "entries"}.</p>
        <HistoryCardGrid cards={cards} />
      </Container>
    </>
  );
}
