import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OsCards } from "@/components/observing/OsCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, observingDiscoveryPath } from "@/lib/routes";
import { BQ_DISCOVERIES, getBqDiscovery } from "@/app/observing/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BQ_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/observing/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBqDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: observingDiscoveryPath(slug) });
}

export default async function BqDiscoverPage({ params }: PageProps<"/observing/discover/[slug]">) {
  const { slug } = await params;
  const d = getBqDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = observingDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observing Suite", url: ROUTES.observing },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Observing Suite · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><OsCards records={records} /></Container>
    </>
  );
}
