import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EngineeringCards } from "@/components/space-engineering/EngineeringCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceEngineeringDiscoveryPath } from "@/lib/routes";
import { CB_DISCOVERIES, getCbDiscovery } from "@/app/space-engineering/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CB_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-engineering/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCbDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: spaceEngineeringDiscoveryPath(slug) });
}

export default async function SpaceEngineeringDiscoverPage({ params }: PageProps<"/space-engineering/discover/[slug]">) {
  const { slug } = await params;
  const d = getCbDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Engineering", url: ROUTES.spaceEngineering },
    { name: d.title, url: spaceEngineeringDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: spaceEngineeringDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Space Engineering · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><EngineeringCards records={records} /></Container>
    </>
  );
}
