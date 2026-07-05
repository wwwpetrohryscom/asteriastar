import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DlCards } from "@/components/distance-ladder/DlCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, distanceLadderDiscoveryPath } from "@/lib/routes";
import { AV_DISCOVERIES, getAvDiscovery } from "@/app/distance-ladder/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return AV_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/distance-ladder/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAvDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: distanceLadderDiscoveryPath(slug) });
}

export default async function AvDiscoverPage({ params }: PageProps<"/distance-ladder/discover/[slug]">) {
  const { slug } = await params;
  const d = getAvDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = distanceLadderDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Distance Ladder", url: ROUTES.distanceLadder },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Distance Ladder · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><DlCards records={records} /></Container>
    </>
  );
}
