import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DseCards } from "@/components/deep-space-exploration/DseCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, deepSpaceExplorationDiscoveryPath } from "@/lib/routes";
import { BI_DISCOVERIES, getBiDiscovery } from "@/app/deep-space-exploration/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BI_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-space-exploration/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBiDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: deepSpaceExplorationDiscoveryPath(slug) });
}

export default async function BiDiscoverPage({ params }: PageProps<"/deep-space-exploration/discover/[slug]">) {
  const { slug } = await params;
  const d = getBiDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = deepSpaceExplorationDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep-Space Exploration", url: ROUTES.deepSpaceExploration },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Deep-Space Exploration · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><DseCards records={records} /></Container>
    </>
  );
}
