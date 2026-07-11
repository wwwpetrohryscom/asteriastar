import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MissionsTable } from "@/components/small-body-missions/MissionsTable";
import { MissionsCards } from "@/components/small-body-missions/MissionsCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, smallBodyDiscoveryPath } from "@/lib/routes";
import { MISSION_DISCOVERIES, getMissionDiscovery } from "@/app/small-body-missions/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return MISSION_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/small-body-missions/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getMissionDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: smallBodyDiscoveryPath(slug) });
}

export default async function MissionDiscoverPage({ params }: PageProps<"/small-body-missions/discover/[slug]">) {
  const { slug } = await params;
  const d = getMissionDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = smallBodyDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Small-Body Missions", url: ROUTES.smallBodyMissions },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Small-Body Missions · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {records.length === 0 ? (
          <p className="scientific-card p-6 text-sm text-muted">No missions match this view yet.</p>
        ) : d.view === "table" ? (
          <MissionsTable records={records} />
        ) : (
          <MissionsCards records={records} />
        )}
      </Container>
    </>
  );
}
