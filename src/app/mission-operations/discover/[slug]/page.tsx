import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OpsCards } from "@/components/mission-operations/OpsCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, missionOperationsDiscoveryPath } from "@/lib/routes";
import { OPS_DISCOVERIES, getOpsDiscovery } from "@/app/mission-operations/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return OPS_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/mission-operations/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getOpsDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: missionOperationsDiscoveryPath(slug) });
}

export default async function OpsDiscoverPage({ params }: PageProps<"/mission-operations/discover/[slug]">) {
  const { slug } = await params;
  const d = getOpsDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = missionOperationsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Mission Operations", url: ROUTES.missionOperations },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Mission Operations · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14"><OpsCards records={records} /></Container>
    </>
  );
}
