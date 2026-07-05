import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { HpCards } from "@/components/heliophysics/HpCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, heliophysicsDiscoveryPath } from "@/lib/routes";
import { AW_DISCOVERIES, getAwDiscovery } from "@/app/heliophysics/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return AW_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/heliophysics/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAwDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: heliophysicsDiscoveryPath(slug) });
}

export default async function AwDiscoverPage({ params }: PageProps<"/heliophysics/discover/[slug]">) {
  const { slug } = await params;
  const d = getAwDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = heliophysicsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Heliophysics", url: ROUTES.heliophysics },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Heliophysics · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><HpCards records={records} /></Container>
    </>
  );
}
