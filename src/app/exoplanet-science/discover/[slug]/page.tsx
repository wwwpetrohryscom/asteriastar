import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ExoScienceCards } from "@/components/exoplanet-science/ExoScienceCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, exoplanetScienceDiscoveryPath } from "@/lib/routes";
import { CC_DISCOVERIES, getCcDiscovery } from "@/app/exoplanet-science/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CC_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exoplanet-science/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCcDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: exoplanetScienceDiscoveryPath(slug) });
}

export default async function ExoplanetScienceDiscoverPage({ params }: PageProps<"/exoplanet-science/discover/[slug]">) {
  const { slug } = await params;
  const d = getCcDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Exoplanet Science", url: ROUTES.exoplanetScience },
    { name: d.title, url: exoplanetScienceDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: exoplanetScienceDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Exoplanet Science · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><ExoScienceCards records={records} /></Container>
    </>
  );
}
