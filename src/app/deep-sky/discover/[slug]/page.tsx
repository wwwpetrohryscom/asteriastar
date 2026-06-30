import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeepSkyTable } from "@/components/deep-sky/DeepSkyTable";
import { DEEP_SKY_DISCOVERIES, getDeepSkyDiscovery } from "@/app/deep-sky/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, deepSkyDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEEP_SKY_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-sky/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDeepSkyDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: deepSkyDiscoveryPath(slug) });
}

export default async function DeepSkyDiscoverPage({ params }: PageProps<"/deep-sky/discover/[slug]">) {
  const { slug } = await params;
  const d = getDeepSkyDiscovery(slug);
  if (!d) notFound();
  const objects = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep Sky", url: ROUTES.deepSky },
    { name: d.title, url: deepSkyDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: deepSkyDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{objects.length} objects.</p>
        {objects.length > 0 ? <DeepSkyTable objects={objects} /> : <p className="text-muted">No matching objects.</p>}
      </Container>
    </>
  );
}
