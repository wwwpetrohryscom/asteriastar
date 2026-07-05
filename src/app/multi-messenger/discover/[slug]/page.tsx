import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MmCards } from "@/components/multi-messenger/MmCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, multiMessengerDiscoveryPath } from "@/lib/routes";
import { AZ_DISCOVERIES, getAzDiscovery } from "@/app/multi-messenger/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return AZ_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/multi-messenger/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getAzDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: multiMessengerDiscoveryPath(slug) });
}

export default async function AzDiscoverPage({ params }: PageProps<"/multi-messenger/discover/[slug]">) {
  const { slug } = await params;
  const d = getAzDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = multiMessengerDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Multi-Messenger", url: ROUTES.multiMessenger },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Multi-Messenger · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><MmCards records={records} /></Container>
    </>
  );
}
