import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DhCards } from "@/components/discovery-history/DhCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, discoveryHistoryDiscoveryPath } from "@/lib/routes";
import { BD_DISCOVERIES, getBdDiscovery } from "@/app/discovery-history/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BD_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/discovery-history/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBdDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: discoveryHistoryDiscoveryPath(slug) });
}

export default async function BdDiscoverPage({ params }: PageProps<"/discovery-history/discover/[slug]">) {
  const { slug } = await params;
  const d = getBdDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = discoveryHistoryDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "History of Discovery", url: ROUTES.discoveryHistory },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>History of Discovery · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><DhCards records={records} /></Container>
    </>
  );
}
