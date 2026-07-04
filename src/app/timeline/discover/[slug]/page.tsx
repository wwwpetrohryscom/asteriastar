import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TimelineCards, TimelineList } from "@/components/timeline/TimelineCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceflightTimelineDiscoveryPath } from "@/lib/routes";
import { TIMELINE_DISCOVERIES, getTimelineDiscovery } from "@/app/timeline/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return TIMELINE_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/timeline/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getTimelineDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: spaceflightTimelineDiscoveryPath(slug) });
}

export default async function TimelineDiscoverPage({ params }: PageProps<"/timeline/discover/[slug]">) {
  const { slug } = await params;
  const d = getTimelineDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = spaceflightTimelineDiscoveryPath(slug);
  // Eras render as cards; chronological hubs render as a timeline rail.
  const chronological = slug !== "eras" && slug !== "records";
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Timeline", url: ROUTES.spaceflightTimeline },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Timeline · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        {chronological ? <TimelineList records={records} /> : <TimelineCards records={records} />}
      </Container>
    </>
  );
}
