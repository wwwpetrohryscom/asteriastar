import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CompactCards } from "@/components/compact-objects/CompactCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, compactObjectsDiscoveryPath } from "@/lib/routes";
import { BZ_DISCOVERIES, getBzDiscovery } from "@/app/compact-objects/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BZ_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/compact-objects/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBzDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: compactObjectsDiscoveryPath(slug) });
}

export default async function CompactObjectsDiscoverPage({ params }: PageProps<"/compact-objects/discover/[slug]">) {
  const { slug } = await params;
  const d = getBzDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Compact Objects", url: ROUTES.compactObjects },
    { name: d.title, url: compactObjectsDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: compactObjectsDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Compact Objects · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><CompactCards records={records} /></Container>
    </>
  );
}
