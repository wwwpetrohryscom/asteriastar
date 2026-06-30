import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ObsCards } from "@/components/observatories/ObsCards";
import { OBS_DISCOVERIES, getObsDiscovery } from "@/app/observatories/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, observatoryDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return OBS_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/observatories/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getObsDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: observatoryDiscoveryPath(slug) });
}

export default async function ObsDiscoverPage({ params }: PageProps<"/observatories/discover/[slug]">) {
  const { slug } = await params;
  const d = getObsDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observatories", url: ROUTES.observatories },
    { name: d.title, url: observatoryDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: observatoryDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{records.length} {records.length === 1 ? "entry" : "entries"}.</p>
        {records.length === 0 ? <p className="text-muted">No matching entries.</p> : <ObsCards records={records} />}
      </Container>
    </>
  );
}
