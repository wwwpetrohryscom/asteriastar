import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TimelineCards } from "@/components/timeline/TimelineCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceflightTimelineDiscoveryPath } from "@/lib/routes";
import { TIMELINE_DISCOVERIES } from "@/app/timeline/discovery";

const DESCRIPTION =
  "The definitive chronological history of spaceflight — from Sputnik and Gagarin to Apollo, the Space Shuttle, the ISS, Voyager, Cassini, New Horizons, and Artemis. Eras, dated events, milestone firsts, and standing records, each a first-class knowledge-graph entity linked to the missions, astronauts, agencies, and worlds it concerns. Reuses the platform's missions, programs, and people; every date is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Space Missions Timeline & Historical Events", description: DESCRIPTION, path: ROUTES.spaceflightTimeline });

export default function TimelineHubPage() {
  const e = engine.spaceflightHistory;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Timeline", url: ROUTES.spaceflightTimeline },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Missions Timeline & Historical Events", description: DESCRIPTION, url: ROUTES.spaceflightTimeline })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Encyclopedia · {e.eras().length} eras · {e.eventCount} events</span>} title="Space Missions Timeline &amp; Historical Events" lead="From the first beep of Sputnik to footprints on the Moon and robots at the edge of the Solar System — the history of spaceflight, told as a connected timeline of eras, events, milestones, and records." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the history</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TIMELINE_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={spaceflightTimelineDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-comet hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="eras-heading">
          <h2 id="eras-heading" className="font-display text-2xl font-bold">Eras of spaceflight</h2>
          <div className="mt-4"><TimelineCards records={e.eras()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each era, event, milestone, and record is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the missions, mission programs, astronauts, agencies, stations, telescopes, and worlds already in the graph. Curated from NASA, ESA, and national space-agency records. Dates are given only to the precision that is well established; unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-comet underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
