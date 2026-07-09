import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TechniqueCards } from "@/components/observation-techniques/TechniqueCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, observationTechniquesDiscoveryPath } from "@/lib/routes";
import { CG_DISCOVERIES, getCgDiscovery } from "@/app/observation-techniques/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CG_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/observation-techniques/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCgDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: observationTechniquesDiscoveryPath(slug) });
}

export default async function ObservationTechniquesDiscoverPage({ params }: PageProps<"/observation-techniques/discover/[slug]">) {
  const { slug } = await params;
  const d = getCgDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observation Techniques", url: ROUTES.observationTechniques },
    { name: d.title, url: observationTechniquesDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: observationTechniquesDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Observation Techniques · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><TechniqueCards records={records} /></Container>
    </>
  );
}
