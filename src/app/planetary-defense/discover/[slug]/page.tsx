import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdCards } from "@/components/planetary-defense/PdCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, planetaryDefenseDiscoveryPath } from "@/lib/routes";
import { PD_DISCOVERIES, getPdDiscovery } from "@/app/planetary-defense/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return PD_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/planetary-defense/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getPdDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: planetaryDefenseDiscoveryPath(slug) });
}

export default async function PdDiscoverPage({ params }: PageProps<"/planetary-defense/discover/[slug]">) {
  const { slug } = await params;
  const d = getPdDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = planetaryDefenseDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Planetary Defense", url: ROUTES.planetaryDefense },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Planetary Defense · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><PdCards records={records} /></Container>
    </>
  );
}
