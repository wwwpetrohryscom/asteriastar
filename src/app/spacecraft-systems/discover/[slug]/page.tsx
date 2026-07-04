import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SysCards } from "@/components/spacecraft-systems/SysCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spacecraftSystemsDiscoveryPath } from "@/lib/routes";
import { SYS_DISCOVERIES, getSysDiscovery } from "@/app/spacecraft-systems/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return SYS_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/spacecraft-systems/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getSysDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: spacecraftSystemsDiscoveryPath(slug) });
}

export default async function SysDiscoverPage({ params }: PageProps<"/spacecraft-systems/discover/[slug]">) {
  const { slug } = await params;
  const d = getSysDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = spacecraftSystemsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Spacecraft Systems", url: ROUTES.spacecraftSystems },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Spacecraft Systems · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><SysCards records={records} /></Container>
    </>
  );
}
