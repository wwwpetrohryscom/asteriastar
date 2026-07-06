import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GxCards } from "@/components/graph-explorer/GxCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, graphDiscoveryPath } from "@/lib/routes";
import { BR_DISCOVERIES, getBrDiscovery } from "@/app/graph/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BR_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/graph/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBrDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: graphDiscoveryPath(slug) });
}

export default async function BrDiscoverPage({ params }: PageProps<"/graph/discover/[slug]">) {
  const { slug } = await params;
  const d = getBrDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = graphDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Graph Explorer", url: ROUTES.graph },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Graph Explorer · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><GxCards records={records} /></Container>
    </>
  );
}
