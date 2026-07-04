import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TDCards } from "@/components/time-domain/TDCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, timeDomainDiscoveryPath } from "@/lib/routes";
import { TD_DISCOVERIES, getTDDiscovery } from "@/app/time-domain/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return TD_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/time-domain/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getTDDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: timeDomainDiscoveryPath(slug) });
}

export default async function TDDiscoverPage({ params }: PageProps<"/time-domain/discover/[slug]">) {
  const { slug } = await params;
  const d = getTDDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = timeDomainDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Time-Domain", url: ROUTES.timeDomain },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Time-Domain · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><TDCards records={records} /></Container>
    </>
  );
}
