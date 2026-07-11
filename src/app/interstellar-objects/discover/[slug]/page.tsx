import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InterstellarTable } from "@/components/interstellar/InterstellarTable";
import { InterstellarCards } from "@/components/interstellar/InterstellarCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, interstellarDiscoveryPath } from "@/lib/routes";
import { INTERSTELLAR_DISCOVERIES, getInterstellarDiscovery } from "@/app/interstellar-objects/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return INTERSTELLAR_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/interstellar-objects/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getInterstellarDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: interstellarDiscoveryPath(slug) });
}

export default async function InterstellarDiscoverPage({ params }: PageProps<"/interstellar-objects/discover/[slug]">) {
  const { slug } = await params;
  const d = getInterstellarDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = interstellarDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Interstellar Objects", url: ROUTES.interstellarObjects },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Interstellar Objects · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="scientific-card p-6 text-sm text-muted">No objects match this view yet — values that are not reliably known are left blank, so some filters are intentionally empty.</p>
        ) : d.view === "table" ? (
          <InterstellarTable records={records} />
        ) : (
          <InterstellarCards records={records} />
        )}
      </Container>
    </>
  );
}
