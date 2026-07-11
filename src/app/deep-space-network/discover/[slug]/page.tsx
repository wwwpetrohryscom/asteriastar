import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DSCommCards } from "@/components/deep-space-comms/DSCommCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, dsnDiscoveryPath } from "@/lib/routes";
import { DSCOMM_DISCOVERIES, getDSCommDiscovery } from "@/app/deep-space-network/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return DSCOMM_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-space-network/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDSCommDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: dsnDiscoveryPath(slug) });
}

export default async function DSCommDiscoverPage({ params }: PageProps<"/deep-space-network/discover/[slug]">) {
  const { slug } = await params;
  const d = getDSCommDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = dsnDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep Space Network", url: ROUTES.deepSpaceNetwork },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Deep Space Network · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="scientific-card p-6 text-sm text-muted">No entries match this view yet.</p>
        ) : (
          <DSCommCards records={records} />
        )}
      </Container>
    </>
  );
}
