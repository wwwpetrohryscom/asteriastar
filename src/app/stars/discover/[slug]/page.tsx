import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { StarTable } from "@/components/stars/StarTable";
import { STAR_DISCOVERIES, getStarDiscovery } from "@/app/stars/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, starDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return STAR_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stars/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getStarDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: starDiscoveryPath(slug) });
}

export default async function StarDiscoverPage({ params }: PageProps<"/stars/discover/[slug]">) {
  const { slug } = await params;
  const d = getStarDiscovery(slug);
  if (!d) notFound();
  const stars = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Stars", url: ROUTES.stars },
    { name: d.title, url: starDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: starDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{stars.length} stars · ordered by {d.metric}.</p>
        <StarTable stars={stars} metric={d.metric} />
      </Container>
    </>
  );
}
