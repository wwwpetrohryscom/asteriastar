import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiCards } from "@/components/astroinformatics/AiCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astroinformaticsDiscoveryPath } from "@/lib/routes";
import { BH_DISCOVERIES, getBhDiscovery } from "@/app/astroinformatics/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BH_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astroinformatics/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBhDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: astroinformaticsDiscoveryPath(slug) });
}

export default async function BhDiscoverPage({ params }: PageProps<"/astroinformatics/discover/[slug]">) {
  const { slug } = await params;
  const d = getBhDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = astroinformaticsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astroinformatics", url: ROUTES.astroinformatics },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Astroinformatics · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><AiCards records={records} /></Container>
    </>
  );
}
