import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CalcCards } from "@/components/calculators/CalcCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, calculatorsDiscoveryPath } from "@/lib/routes";
import { BP_DISCOVERIES, getBpDiscovery } from "@/app/calculators/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BP_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/calculators/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBpDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: calculatorsDiscoveryPath(slug) });
}

export default async function BpDiscoverPage({ params }: PageProps<"/calculators/discover/[slug]">) {
  const { slug } = await params;
  const d = getBpDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = calculatorsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Calculators", url: ROUTES.calculators },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Calculators · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><CalcCards records={records} /></Container>
    </>
  );
}
