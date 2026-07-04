import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InfraCards } from "@/components/space-infrastructure/InfraCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceInfrastructureDiscoveryPath } from "@/lib/routes";
import { INFRA_DISCOVERIES, getInfraDiscovery } from "@/app/space-infrastructure/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return INFRA_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-infrastructure/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getInfraDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: spaceInfrastructureDiscoveryPath(slug) });
}

export default async function InfraDiscoverPage({ params }: PageProps<"/space-infrastructure/discover/[slug]">) {
  const { slug } = await params;
  const d = getInfraDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = spaceInfrastructureDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Infrastructure", url: ROUTES.spaceInfrastructure },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Space Infrastructure · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><InfraCards records={records} /></Container>
    </>
  );
}
