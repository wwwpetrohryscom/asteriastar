import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CmCards } from "@/components/celestial-mechanics/CmCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, celestialMechanicsDiscoveryPath } from "@/lib/routes";
import { BE_DISCOVERIES, getBeDiscovery } from "@/app/celestial-mechanics/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BE_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/celestial-mechanics/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBeDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: celestialMechanicsDiscoveryPath(slug) });
}

export default async function BeDiscoverPage({ params }: PageProps<"/celestial-mechanics/discover/[slug]">) {
  const { slug } = await params;
  const d = getBeDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = celestialMechanicsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Celestial Mechanics", url: ROUTES.celestialMechanics },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Celestial Mechanics · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><CmCards records={records} /></Container>
    </>
  );
}
