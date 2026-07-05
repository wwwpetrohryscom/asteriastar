import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SpCards } from "@/components/space-policy/SpCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spacePolicyDiscoveryPath } from "@/lib/routes";
import { BC_DISCOVERIES, getBcDiscovery } from "@/app/space-policy/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return BC_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-policy/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getBcDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: spacePolicyDiscoveryPath(slug) });
}

export default async function BcDiscoverPage({ params }: PageProps<"/space-policy/discover/[slug]">) {
  const { slug } = await params;
  const d = getBcDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = spacePolicyDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Policy", url: ROUTES.spacePolicy },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Space Policy · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><SpCards records={records} /></Container>
    </>
  );
}
