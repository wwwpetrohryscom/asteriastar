import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DsoCards } from "@/components/deep-sky-encyclopedia/DsoCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, deepSkyEncyclopediaDiscoveryPath } from "@/lib/routes";
import { CE_DISCOVERIES, getCeDiscovery } from "@/app/deep-sky-encyclopedia/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CE_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-sky-encyclopedia/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCeDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: deepSkyEncyclopediaDiscoveryPath(slug) });
}

export default async function DeepSkyEncyclopediaDiscoverPage({ params }: PageProps<"/deep-sky-encyclopedia/discover/[slug]">) {
  const { slug } = await params;
  const d = getCeDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep-Sky Encyclopedia", url: ROUTES.deepSkyEncyclopedia },
    { name: d.title, url: deepSkyEncyclopediaDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: deepSkyEncyclopediaDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Deep-Sky Encyclopedia · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><DsoCards records={records} /></Container>
    </>
  );
}
