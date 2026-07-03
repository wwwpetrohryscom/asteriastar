import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CometsTable } from "@/components/comets/CometsTable";
import { CometsCards } from "@/components/comets/CometsCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, cometDiscoveryPath } from "@/lib/routes";
import { COMET_DISCOVERIES, getCometDiscovery } from "@/app/comets/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return COMET_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comets/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getCometDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: cometDiscoveryPath(slug) });
}

export default async function CometDiscoverPage({ params }: PageProps<"/comets/discover/[slug]">) {
  const { slug } = await params;
  const d = getCometDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = cometDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Comets", url: ROUTES.comets },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Comets · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-muted">No comets match this view yet — values that are not reliably known are left blank, so some filters are intentionally empty.</p>
        ) : d.view === "table" ? (
          <CometsTable records={records} />
        ) : (
          <CometsCards records={records} />
        )}
      </Container>
    </>
  );
}
