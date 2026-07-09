import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReferenceCards } from "@/components/reference-systems/ReferenceCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, referenceSystemsDiscoveryPath } from "@/lib/routes";
import { CF_DISCOVERIES, getCfDiscovery } from "@/app/reference-systems/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CF_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/reference-systems/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCfDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: referenceSystemsDiscoveryPath(slug) });
}

export default async function ReferenceSystemsDiscoverPage({ params }: PageProps<"/reference-systems/discover/[slug]">) {
  const { slug } = await params;
  const d = getCfDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Coordinates & Time", url: ROUTES.referenceSystems },
    { name: d.title, url: referenceSystemsDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: referenceSystemsDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Coordinates &amp; Time · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><ReferenceCards records={records} /></Container>
    </>
  );
}
