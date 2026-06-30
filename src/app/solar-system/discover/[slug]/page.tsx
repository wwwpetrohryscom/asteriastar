import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { BodyTable } from "@/components/solar-system/BodyTable";
import { SOLAR_DISCOVERIES, getSolarDiscovery } from "@/app/solar-system/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, solarDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return SOLAR_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solar-system/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getSolarDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: solarDiscoveryPath(slug) });
}

export default async function SolarDiscoverPage({ params }: PageProps<"/solar-system/discover/[slug]">) {
  const { slug } = await params;
  const d = getSolarDiscovery(slug);
  if (!d) notFound();
  const bodies = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Solar System", url: ROUTES.solarSystem },
    { name: d.title, url: solarDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: solarDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{bodies.length} objects.</p>
        {bodies.length > 0 ? <BodyTable bodies={bodies} /> : <p className="text-muted">No matching objects.</p>}
      </Container>
    </>
  );
}
