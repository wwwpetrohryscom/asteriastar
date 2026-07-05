import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OfCards } from "@/components/observatory-frontier/OfCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, observatoryFrontierDiscoveryPath } from "@/lib/routes";
import { AU_DISCOVERIES, getAuDiscovery } from "@/app/observatory-frontier/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return AU_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/observatory-frontier/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAuDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: observatoryFrontierDiscoveryPath(slug) });
}

export default async function AuDiscoverPage({ params }: PageProps<"/observatory-frontier/discover/[slug]">) {
  const { slug } = await params;
  const d = getAuDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = observatoryFrontierDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observatory Frontier", url: ROUTES.observatoryFrontier },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Observatory Frontier · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><OfCards records={records} /></Container>
    </>
  );
}
