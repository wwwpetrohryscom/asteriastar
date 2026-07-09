import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SoftwareCards } from "@/components/astronomy-software/SoftwareCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astronomySoftwareDiscoveryPath } from "@/lib/routes";
import { CH_DISCOVERIES, getChDiscovery } from "@/app/astronomy-software/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return CH_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astronomy-software/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getChDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: astronomySoftwareDiscoveryPath(slug) });
}

export default async function AstronomySoftwareDiscoverPage({ params }: PageProps<"/astronomy-software/discover/[slug]">) {
  const { slug } = await params;
  const d = getChDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astronomy Software", url: ROUTES.astronomySoftware },
    { name: d.title, url: astronomySoftwareDiscoveryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: astronomySoftwareDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Astronomy Software · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><SoftwareCards records={records} /></Container>
    </>
  );
}
