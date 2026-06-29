import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { TimelineList } from "@/components/timeline/TimelineList";
import { JsonLd } from "@/components/seo/JsonLd";
import { TIMELINES, getTimeline } from "@/lib/timelines";
import { accentVars } from "@/lib/theme";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, timelinePath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return TIMELINES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/timelines/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTimeline(slug);
  if (!t) return {};
  return buildMetadata({ title: t.title, description: t.description, path: timelinePath(t.slug) });
}

export default async function TimelinePage({ params }: PageProps<"/timelines/[slug]">) {
  const { slug } = await params;
  const timeline = getTimeline(slug);
  if (!timeline) notFound();

  const url = timelinePath(timeline.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Timelines", url: ROUTES.timelines },
    { name: timeline.title, url },
  ];

  return (
    <div style={accentVars(timeline.accent)}>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: timeline.title, description: timeline.description, url }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent={timeline.accent}
        eyebrow={<span>Timeline · {timeline.events.length} events</span>}
        title={timeline.title}
        lead={timeline.description}
      />
      <Container size="narrow" className="mt-8 mb-12">
        <TimelineList events={timeline.events} />
        <div className="mt-12">
          <SourceList keys={timeline.sources} />
        </div>
      </Container>
    </div>
  );
}
