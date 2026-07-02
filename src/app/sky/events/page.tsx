import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { DataStatusBadge, EnvelopeCard, SkySection } from "@/components/sky/SkyUI";
import { engine } from "@/platform/data-engine";
import { monthName } from "@/platform/live-sky";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyPath, meteorShowerPath } from "@/lib/routes";

const s = engine.liveSky;
const DESCRIPTION = "The recurring events of the observing year — meteor-shower peaks, equinoxes, and solstices — as a perennial guide. These recur annually; exact dates for a given year are prepared for a connected almanac.";
export const metadata: Metadata = buildMetadata({ title: "Sky Events — The Observing Year", description: DESCRIPTION, path: skyPath("events") });

export default function SkyEventsPage() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "Sky Events", url: skyPath("events") }];
  const byMonth = Array.from({ length: 12 }, (_, i) => ({ m: i + 1, events: s.observingCalendar.forMonth(i + 1) })).filter((x) => x.events.length);
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Sky Events", description: DESCRIPTION, url: skyPath("events") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Night Sky Platform</span>} title="The Observing Year" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {byMonth.map(({ m, events }) => (
              <SkySection key={m} id={`month-${m}`} title={monthName(m)}>
                <ul className="space-y-2">
                  {events.map((e) => (
                    <li key={e.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-fg">{e.kind === "meteor-shower" ? <Link href={meteorShowerPath(e.slug.replace(/-peak$/, ""))} className="hover:text-nebula">{e.name}</Link> : e.name}</span>
                        <span className="text-xs uppercase tracking-wide text-faint">{e.kind.replace("-", " ")}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted">{e.description}</p>
                    </li>
                  ))}
                </ul>
              </SkySection>
            ))}
          </div>
          <aside className="space-y-6">
            <EnvelopeCard envelope={s.observingCalendar.envelope} />
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">More</h2>
              <p className="mt-2 text-sm text-muted"><Link href={skyPath("this-month")} className="text-nebula hover:underline">This month in the sky →</Link></p>
              <p className="mt-1 text-sm text-muted"><Link href={skyPath("observing-calendar")} className="text-nebula hover:underline">Observing calendar →</Link></p>
            </section>
          </aside>
        </div>
        <div className="mt-8"><SourceList keys={["imo", "usno"]} title="Sources & references" /></div>
      </Container>
    </>
  );
}
