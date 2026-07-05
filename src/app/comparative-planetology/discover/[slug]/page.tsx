import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CpCards } from "@/components/comparative-planetology/CpCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, comparativePlanetologyDiscoveryPath } from "@/lib/routes";
import { BA_DISCOVERIES, getBaDiscovery } from "@/app/comparative-planetology/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BA_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comparative-planetology/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBaDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: comparativePlanetologyDiscoveryPath(slug) });
}

export default async function BaDiscoverPage({ params }: PageProps<"/comparative-planetology/discover/[slug]">) {
  const { slug } = await params;
  const d = getBaDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = comparativePlanetologyDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Comparative Planetology", url: ROUTES.comparativePlanetology },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Comparative Planetology · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><CpCards records={records} /></Container>
    </>
  );
}
