import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CaCards } from "@/components/citizen-astronomy/CaCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, citizenAstronomyDiscoveryPath } from "@/lib/routes";
import { AY_DISCOVERIES, getAyDiscovery } from "@/app/citizen-astronomy/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return AY_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/citizen-astronomy/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAyDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: citizenAstronomyDiscoveryPath(slug) });
}

export default async function AyDiscoverPage({ params }: PageProps<"/citizen-astronomy/discover/[slug]">) {
  const { slug } = await params;
  const d = getAyDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = citizenAstronomyDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Citizen Astronomy", url: ROUTES.citizenAstronomy },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Citizen Astronomy · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><CaCards records={records} /></Container>
    </>
  );
}
