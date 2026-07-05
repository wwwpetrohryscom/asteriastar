import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArCards } from "@/components/data-archives/ArCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, dataArchivesDiscoveryPath } from "@/lib/routes";
import { AT_DISCOVERIES, getAtDiscovery } from "@/app/data-archives/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return AT_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/data-archives/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAtDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: dataArchivesDiscoveryPath(slug) });
}

export default async function AtDiscoverPage({ params }: PageProps<"/data-archives/discover/[slug]">) {
  const { slug } = await params;
  const d = getAtDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = dataArchivesDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Data Archives", url: ROUTES.dataArchives },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Data Archives · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><ArCards records={records} /></Container>
    </>
  );
}
