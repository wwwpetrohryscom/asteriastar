import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GxCards } from "@/components/galaxies/GxCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, galaxiesDiscoveryPath } from "@/lib/routes";
import { GX_DISCOVERIES, getGxDiscovery } from "@/app/galaxies/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return GX_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/galaxies/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getGxDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: galaxiesDiscoveryPath(slug) });
}

export default async function GxDiscoverPage({ params }: PageProps<"/galaxies/discover/[slug]">) {
  const { slug } = await params;
  const d = getGxDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = galaxiesDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Galaxies", url: ROUTES.galaxies },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Galaxies · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><GxCards records={records} /></Container>
    </>
  );
}
