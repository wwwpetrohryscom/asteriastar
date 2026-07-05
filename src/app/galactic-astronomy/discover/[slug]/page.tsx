import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GaCards } from "@/components/galactic-astronomy/GaCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, galacticAstronomyDiscoveryPath } from "@/lib/routes";
import { BG_DISCOVERIES, getBgDiscovery } from "@/app/galactic-astronomy/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BG_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/galactic-astronomy/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBgDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: galacticAstronomyDiscoveryPath(slug) });
}

export default async function BgDiscoverPage({ params }: PageProps<"/galactic-astronomy/discover/[slug]">) {
  const { slug } = await params;
  const d = getBgDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = galacticAstronomyDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Galactic Astronomy", url: ROUTES.galacticAstronomy },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Galactic Astronomy · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><GaCards records={records} /></Container>
    </>
  );
}
