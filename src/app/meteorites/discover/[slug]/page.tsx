import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MeteoritesTable } from "@/components/meteorites/MeteoritesTable";
import { MeteoritesCards } from "@/components/meteorites/MeteoritesCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, meteoriteDiscoveryPath } from "@/lib/routes";
import { METEORITE_DISCOVERIES, getMeteoriteDiscovery } from "@/app/meteorites/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return METEORITE_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meteorites/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getMeteoriteDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: meteoriteDiscoveryPath(slug) });
}

export default async function MeteoriteDiscoverPage({ params }: PageProps<"/meteorites/discover/[slug]">) {
  const { slug } = await params;
  const d = getMeteoriteDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = meteoriteDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Meteorites", url: ROUTES.meteorites },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Meteorites · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-muted">No meteorites match this view yet — values that are not reliably known are left blank, so some filters are intentionally empty.</p>
        ) : d.view === "table" ? (
          <MeteoritesTable records={records} />
        ) : (
          <MeteoritesCards records={records} />
        )}
      </Container>
    </>
  );
}
