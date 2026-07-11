import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AsteroidsTable } from "@/components/asteroids/AsteroidsTable";
import { AsteroidsCards } from "@/components/asteroids/AsteroidsCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, asteroidDiscoveryPath } from "@/lib/routes";
import { ASTEROID_DISCOVERIES, getAsteroidDiscovery } from "@/app/asteroids/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return ASTEROID_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asteroids/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAsteroidDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: asteroidDiscoveryPath(slug) });
}

export default async function AsteroidDiscoverPage({ params }: PageProps<"/asteroids/discover/[slug]">) {
  const { slug } = await params;
  const d = getAsteroidDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = asteroidDiscoveryPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Asteroids", url: ROUTES.asteroids },
    { name: d.title, url },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Asteroids · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="scientific-card p-6 text-sm text-muted">No bodies match this view yet — values that are not reliably known are left blank, so some filters are intentionally empty.</p>
        ) : d.view === "table" ? (
          <AsteroidsTable records={records} />
        ) : (
          <AsteroidsCards records={records} />
        )}
      </Container>
    </>
  );
}
