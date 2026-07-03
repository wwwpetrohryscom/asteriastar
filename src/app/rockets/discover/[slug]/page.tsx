import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RocketsTable } from "@/components/rockets/RocketsTable";
import { RocketsCards } from "@/components/rockets/RocketsCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, rocketDiscoveryPath } from "@/lib/routes";
import { ROCKET_DISCOVERIES, getRocketDiscovery } from "@/app/rockets/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return ROCKET_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rockets/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getRocketDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: rocketDiscoveryPath(slug) });
}

export default async function RocketDiscoverPage({ params }: PageProps<"/rockets/discover/[slug]">) {
  const { slug } = await params;
  const d = getRocketDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = rocketDiscoveryPath(slug);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Rockets", url: ROUTES.rockets },
    { name: d.title, url },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Rockets · {records.length} entries</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-sm text-muted">No entries match this view yet — figures that are not reliably known are left blank rather than invented, so some filters are intentionally empty.</p>
        ) : d.view === "table" ? (
          <RocketsTable records={records} />
        ) : (
          <RocketsCards records={records} />
        )}
      </Container>
    </>
  );
}
