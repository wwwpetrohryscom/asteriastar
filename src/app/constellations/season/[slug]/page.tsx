import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConstellationsTable } from "@/components/constellations/ConstellationsTable";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, constellationSeasonPath, skyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.constellations.seasons().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/constellations/season/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.constellations.resolveSeason(slug);
  if (!d) return {};
  return buildMetadata({ title: d.season.name, description: d.season.description, path: constellationSeasonPath(slug) });
}

export default async function ConstellationSeasonPage({ params }: PageProps<"/constellations/season/[slug]">) {
  const { slug } = await params;
  const d = engine.constellations.resolveSeason(slug);
  if (!d) notFound();
  const url = constellationSeasonPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Constellations", url: ROUTES.constellations },
    { name: d.season.name, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.season.name, description: d.season.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Seasonal sky · {d.season.months}</span>} title={d.season.name} lead={d.season.description} />
      <Container className="mt-8 mb-14 space-y-6">
        <p className="rounded-xl border border-nasa/40 bg-nasa/10 p-4 text-sm text-muted">
          Seasons here are for the <strong>northern mid-latitudes</strong>; from the southern hemisphere they are reversed. For tonight&apos;s actual sky at your location, use the{" "}
          <Link href={skyPath("night-sky-tonight")} className="text-nasa underline-offset-4 hover:underline">computed Tonight dashboard</Link>.
        </p>
        <ConstellationsTable records={d.members} />
      </Container>
    </>
  );
}
