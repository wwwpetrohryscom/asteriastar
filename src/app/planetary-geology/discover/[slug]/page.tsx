import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GeoCards } from "@/components/planetary-geology/GeoCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, planetaryGeologyDiscoveryPath } from "@/lib/routes";
import { GEO_DISCOVERIES, getGeoDiscovery } from "@/app/planetary-geology/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return GEO_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/planetary-geology/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getGeoDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: planetaryGeologyDiscoveryPath(slug) });
}

export default async function GeoDiscoverPage({ params }: PageProps<"/planetary-geology/discover/[slug]">) {
  const { slug } = await params;
  const d = getGeoDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = planetaryGeologyDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Planetary Geology", url: ROUTES.planetaryGeology },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Planetary Geology · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><GeoCards records={records} /></Container>
    </>
  );
}
