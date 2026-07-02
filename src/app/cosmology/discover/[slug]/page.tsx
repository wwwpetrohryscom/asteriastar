import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CosmoCardGrid } from "@/components/cosmology/CosmoCardGrid";
import { ConsensusLegend } from "@/components/cosmology/Consensus";
import { COSMO_DISCOVERIES, getCosmoDiscovery } from "@/app/cosmology/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, cosmologyDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return COSMO_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cosmology/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCosmoDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: cosmologyDiscoveryPath(slug) });
}

export default async function CosmoDiscoverPage({ params }: PageProps<"/cosmology/discover/[slug]">) {
  const { slug } = await params;
  const d = getCosmoDiscovery(slug);
  if (!d) notFound();
  const cards = d.cards();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Cosmology & Universe", url: ROUTES.cosmology },
    { name: d.title, url: cosmologyDiscoveryPath(slug) },
  ];
  const showLegend = slug === "scientific-debates" || slug === "open-questions" || slug === "cosmological-models" || slug === "cosmology";
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: cosmologyDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14 space-y-8">
        {showLegend && <ConsensusLegend />}
        <div>
          <p className="mb-4 text-sm text-faint">{cards.length} {cards.length === 1 ? "entry" : "entries"}.</p>
          <CosmoCardGrid cards={cards} />
        </div>
      </Container>
    </>
  );
}
