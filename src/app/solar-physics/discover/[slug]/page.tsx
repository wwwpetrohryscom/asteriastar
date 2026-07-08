import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SolarCards } from "@/components/solar-physics/SolarCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, solarPhysicsDiscoveryPath } from "@/lib/routes";
import { BY_DISCOVERIES, getBySolarDiscovery } from "@/app/solar-physics/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BY_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solar-physics/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBySolarDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: solarPhysicsDiscoveryPath(slug) });
}

export default async function SolarPhysicsDiscoverPage({ params }: PageProps<"/solar-physics/discover/[slug]">) {
  const { slug } = await params;
  const d = getBySolarDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Solar Physics", url: ROUTES.solarPhysics },
    { name: d.title, url: solarPhysicsDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: solarPhysicsDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Solar Physics · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><SolarCards records={records} /></Container>
    </>
  );
}
