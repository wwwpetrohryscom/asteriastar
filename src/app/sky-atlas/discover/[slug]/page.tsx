import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AtlasCards } from "@/components/sky-atlas/AtlasCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyAtlasDiscoveryPath } from "@/lib/routes";
import { BO_DISCOVERIES, getBoDiscovery } from "@/app/sky-atlas/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BO_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sky-atlas/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBoDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: skyAtlasDiscoveryPath(slug) });
}

export default async function BoDiscoverPage({ params }: PageProps<"/sky-atlas/discover/[slug]">) {
  const { slug } = await params;
  const d = getBoDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = skyAtlasDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Sky Atlas", url: ROUTES.skyAtlas },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Sky Atlas · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><AtlasCards records={records} /></Container>
    </>
  );
}
