import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AcCards } from "@/components/astrochemistry/AcCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astrochemistryDiscoveryPath } from "@/lib/routes";
import { BB_DISCOVERIES, getBbDiscovery } from "@/app/astrochemistry/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BB_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astrochemistry/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBbDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: astrochemistryDiscoveryPath(slug) });
}

export default async function BbDiscoverPage({ params }: PageProps<"/astrochemistry/discover/[slug]">) {
  const { slug } = await params;
  const d = getBbDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = astrochemistryDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astrochemistry", url: ROUTES.astrochemistry },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Astrochemistry · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><AcCards records={records} /></Container>
    </>
  );
}
