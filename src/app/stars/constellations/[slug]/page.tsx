import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { StarTable } from "@/components/stars/StarTable";
import { engine } from "@/platform/data-engine";
import { CONSTELLATIONS } from "@/knowledge-graph/data/star-catalog/constellations";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, constellationStarsPath, constellationPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return CONSTELLATIONS.map((c) => ({ slug: c.slug }));
}

function find(slug: string) {
  return CONSTELLATIONS.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/stars/constellations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = find(slug);
  if (!c) return {};
  const n = engine.star.byConstellation(`constellation:${c.slug}`).length;
  return buildMetadata({
    title: `Stars in ${c.name}`,
    description: `The ${n} catalogued stars in the constellation ${c.name} (${c.genitive}), with real magnitudes, distances, and types.`,
    // Canonicalize to the full constellation entry (Program W) — this star-table is a sub-view.
    path: constellationPath(slug),
  });
}

export default async function ConstellationStarsPage({ params }: PageProps<"/stars/constellations/[slug]">) {
  const { slug } = await params;
  const c = find(slug);
  if (!c) notFound();
  const stars = engine.star.byConstellation(`constellation:${c.slug}`);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Stars", url: ROUTES.stars },
    { name: c.name, url: constellationStarsPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: `Stars in ${c.name}`, description: `Catalogued stars in ${c.name}.`, url: constellationStarsPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Constellation · {c.abbr}</span>}
        title={`Stars in ${c.name}`}
        lead={`${c.name} (${c.genitive}) — ${stars.length} catalogued stars, brightest first.`}
      />
      <Container className="mt-8 mb-14 space-y-6">
        <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted">
          This is the star table for {c.name}. For the full constellation entry — mythology, deep-sky objects, meteor showers, neighbours, and observing guidance —{" "}
          <Link href={constellationPath(slug)} className="text-nebula underline-offset-4 hover:underline">visit the {c.name} constellation page →</Link>
        </p>
        {stars.length > 0 ? <StarTable stars={stars} showConstellation={false} /> : <p className="text-muted">No catalogued stars yet.</p>}
      </Container>
    </>
  );
}
