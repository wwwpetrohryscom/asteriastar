import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InstCards } from "@/components/instruments/InstCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, instrumentsDiscoveryPath } from "@/lib/routes";
import { INST_DISCOVERIES, getInstDiscovery } from "@/app/instruments/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return INST_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/instruments/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getInstDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: instrumentsDiscoveryPath(slug) });
}

export default async function InstDiscoverPage({ params }: PageProps<"/instruments/discover/[slug]">) {
  const { slug } = await params;
  const d = getInstDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = instrumentsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Instruments", url: ROUTES.instruments },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Instruments · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><InstCards records={records} /></Container>
    </>
  );
}
