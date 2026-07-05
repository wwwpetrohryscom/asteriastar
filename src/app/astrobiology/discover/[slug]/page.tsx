import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AbCards } from "@/components/astrobiology/AbCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astrobiologyDiscoveryPath } from "@/lib/routes";
import { AB_DISCOVERIES, getAbDiscovery } from "@/app/astrobiology/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return AB_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astrobiology/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAbDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: astrobiologyDiscoveryPath(slug) });
}

export default async function AbDiscoverPage({ params }: PageProps<"/astrobiology/discover/[slug]">) {
  const { slug } = await params;
  const d = getAbDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = astrobiologyDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astrobiology", url: ROUTES.astrobiology },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Astrobiology · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><AbCards records={records} /></Container>
    </>
  );
}
