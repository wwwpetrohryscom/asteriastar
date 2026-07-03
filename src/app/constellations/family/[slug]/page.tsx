import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConstellationsTable } from "@/components/constellations/ConstellationsTable";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, constellationFamilyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.constellations.families().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/constellations/family/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.constellations.resolveConstellationFamily(slug);
  if (!d) return {};
  return buildMetadata({ title: d.family.name, description: d.family.description, path: constellationFamilyPath(slug) });
}

export default async function ConstellationFamilyPage({ params }: PageProps<"/constellations/family/[slug]">) {
  const { slug } = await params;
  const d = engine.constellations.resolveConstellationFamily(slug);
  if (!d) notFound();
  const url = constellationFamilyPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Constellations", url: ROUTES.constellations },
    { name: d.family.name, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.family.name, description: d.family.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Constellation family · {d.members.length} constellations</span>} title={d.family.name} lead={d.family.description} />
      <Container className="mt-8 mb-14"><ConstellationsTable records={d.members} /></Container>
    </>
  );
}
