import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MlCards } from "@/components/astro-ml/MlCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astroMlDiscoveryPath } from "@/lib/routes";
import { AX_DISCOVERIES, getAxDiscovery } from "@/app/astro-ml/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return AX_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astro-ml/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAxDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: astroMlDiscoveryPath(slug) });
}

export default async function AxDiscoverPage({ params }: PageProps<"/astro-ml/discover/[slug]">) {
  const { slug } = await params;
  const d = getAxDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = astroMlDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astronomy & ML", url: ROUTES.astroMl },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Astronomy &amp; ML · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><MlCards records={records} /></Container>
    </>
  );
}
