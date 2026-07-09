import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PhysicsCards } from "@/components/fundamental-physics/PhysicsCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, fundamentalPhysicsDiscoveryPath } from "@/lib/routes";
import { CA_DISCOVERIES, getCaDiscovery } from "@/app/fundamental-physics/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CA_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/fundamental-physics/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCaDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: fundamentalPhysicsDiscoveryPath(slug) });
}

export default async function FundamentalPhysicsDiscoverPage({ params }: PageProps<"/fundamental-physics/discover/[slug]">) {
  const { slug } = await params;
  const d = getCaDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Fundamental Physics", url: ROUTES.fundamentalPhysics },
    { name: d.title, url: fundamentalPhysicsDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: fundamentalPhysicsDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Fundamental Physics · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><PhysicsCards records={records} /></Container>
    </>
  );
}
