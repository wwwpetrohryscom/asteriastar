import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { HsfCards } from "@/components/human-spaceflight/HsfCards";
import { HSF_DISCOVERIES, getHsfDiscovery } from "@/app/human-spaceflight/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, humanSpaceflightDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return HSF_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/human-spaceflight/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getHsfDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: humanSpaceflightDiscoveryPath(slug) });
}

export default async function HsfDiscoverPage({ params }: PageProps<"/human-spaceflight/discover/[slug]">) {
  const { slug } = await params;
  const d = getHsfDiscovery(slug);
  if (!d) notFound();
  const items = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Human Spaceflight", url: ROUTES.humanSpaceflight },
    { name: d.title, url: humanSpaceflightDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: humanSpaceflightDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{items.length} {items.length === 1 ? "entry" : "entries"}.</p>
        {items.length === 0 ? <p className="text-muted">No matching entries.</p> : <HsfCards items={items} />}
      </Container>
    </>
  );
}
