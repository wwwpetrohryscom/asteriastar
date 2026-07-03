import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SatellitesTable } from "@/components/satellites/SatellitesTable";
import { SatellitesCards } from "@/components/satellites/SatellitesCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, satelliteDiscoveryPath } from "@/lib/routes";
import { SATELLITE_DISCOVERIES, getSatelliteDiscovery } from "@/app/satellites/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return SATELLITE_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/satellites/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getSatelliteDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: satelliteDiscoveryPath(slug) });
}

export default async function SatelliteDiscoverPage({ params }: PageProps<"/satellites/discover/[slug]">) {
  const { slug } = await params;
  const d = getSatelliteDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = satelliteDiscoveryPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: d.title, url },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Satellites · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-muted">No satellites match this view yet — values that are not reliably known are left blank, so some filters are intentionally empty.</p>
        ) : d.view === "table" ? (
          <SatellitesTable records={records} />
        ) : (
          <SatellitesCards records={records} />
        )}
      </Container>
    </>
  );
}
