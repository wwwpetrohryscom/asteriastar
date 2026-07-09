import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogCards } from "@/components/sky-catalogs/CatalogCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyCatalogsDiscoveryPath } from "@/lib/routes";
import { CD_DISCOVERIES, getCdDiscovery } from "@/app/sky-catalogs/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CD_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sky-catalogs/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCdDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: skyCatalogsDiscoveryPath(slug) });
}

export default async function SkyCatalogsDiscoverPage({ params }: PageProps<"/sky-catalogs/discover/[slug]">) {
  const { slug } = await params;
  const d = getCdDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Sky Catalogues", url: ROUTES.skyCatalogs },
    { name: d.title, url: skyCatalogsDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: skyCatalogsDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Sky Catalogues · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><CatalogCards records={records} /></Container>
    </>
  );
}
