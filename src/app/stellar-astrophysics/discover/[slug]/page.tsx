import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SaCards } from "@/components/stellar-astrophysics/SaCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, stellarAstrophysicsDiscoveryPath } from "@/lib/routes";
import { BF_DISCOVERIES, getBfDiscovery } from "@/app/stellar-astrophysics/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BF_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stellar-astrophysics/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBfDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: stellarAstrophysicsDiscoveryPath(slug) });
}

export default async function BfDiscoverPage({ params }: PageProps<"/stellar-astrophysics/discover/[slug]">) {
  const { slug } = await params;
  const d = getBfDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = stellarAstrophysicsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Stellar Astrophysics", url: ROUTES.stellarAstrophysics },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Stellar Astrophysics · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><SaCards records={records} /></Container>
    </>
  );
}
