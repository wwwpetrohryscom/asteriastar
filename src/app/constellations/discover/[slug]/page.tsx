import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConstellationsTable } from "@/components/constellations/ConstellationsTable";
import { ConstellationsCards } from "@/components/constellations/ConstellationsCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, constellationDiscoveryPath } from "@/lib/routes";
import { CONSTELLATION_DISCOVERIES, getConstellationDiscovery } from "@/app/constellations/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CONSTELLATION_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/constellations/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getConstellationDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: constellationDiscoveryPath(slug) });
}

export default async function ConstellationDiscoverPage({ params }: PageProps<"/constellations/discover/[slug]">) {
  const { slug } = await params;
  const d = getConstellationDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = constellationDiscoveryPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Constellations", url: ROUTES.constellations },
    { name: d.title, url },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Constellations · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="scientific-card p-6 text-sm text-muted">No constellations match this view yet — values that are not reliably known are left blank, so some filters are intentionally empty.</p>
        ) : d.view === "table" ? (
          <ConstellationsTable records={records} />
        ) : (
          <ConstellationsCards records={records} />
        )}
      </Container>
    </>
  );
}
