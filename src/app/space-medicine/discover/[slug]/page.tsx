import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MedCards } from "@/components/space-medicine/MedCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceMedicineDiscoveryPath } from "@/lib/routes";
import { MED_DISCOVERIES, getMedDiscovery } from "@/app/space-medicine/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return MED_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-medicine/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getMedDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: spaceMedicineDiscoveryPath(slug) });
}

export default async function MedDiscoverPage({ params }: PageProps<"/space-medicine/discover/[slug]">) {
  const { slug } = await params;
  const d = getMedDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = spaceMedicineDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Medicine", url: ROUTES.spaceMedicine },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Space Medicine · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><MedCards records={records} /></Container>
    </>
  );
}
