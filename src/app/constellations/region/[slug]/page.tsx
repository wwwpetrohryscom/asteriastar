import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConstellationsTable } from "@/components/constellations/ConstellationsTable";
import { engine } from "@/platform/data-engine";
import type { Hemisphere } from "@/knowledge-graph/data/constellations-catalog/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, constellationRegionPath } from "@/lib/routes";

const REGIONS: { slug: Hemisphere; title: string; description: string }[] = [
  { slug: "northern", title: "Northern Sky", description: "Constellations centred in the northern celestial hemisphere, best seen from northern latitudes." },
  { slug: "southern", title: "Southern Sky", description: "Constellations centred in the southern celestial hemisphere, best seen from southern latitudes." },
  { slug: "equatorial", title: "Equatorial Sky", description: "Constellations straddling the celestial equator, visible from most of the inhabited world." },
];

export const dynamicParams = false;
export function generateStaticParams() {
  return REGIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/constellations/region/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = REGIONS.find((x) => x.slug === slug);
  if (!r) return {};
  return buildMetadata({ title: r.title, description: r.description, path: constellationRegionPath(slug) });
}

export default async function ConstellationRegionPage({ params }: PageProps<"/constellations/region/[slug]">) {
  const { slug } = await params;
  const r = REGIONS.find((x) => x.slug === slug);
  if (!r) notFound();
  const region = engine.constellations.resolveSkyRegion(r.slug);
  const url = constellationRegionPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Constellations", url: ROUTES.constellations },
    { name: r.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: r.title, description: r.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Sky region · {region.members.length} constellations</span>} title={r.title} lead={r.description} />
      <Container className="mt-8 mb-14"><ConstellationsTable records={region.members} /></Container>
    </>
  );
}
