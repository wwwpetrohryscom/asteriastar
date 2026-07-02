import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { DataStatusBadge, PreparedForIntegration, SkySection } from "@/components/sky/SkyUI";
import { engine } from "@/platform/data-engine";
import { getProvider, monthName } from "@/platform/live-sky";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, skyPath, meteorShowerPath } from "@/lib/routes";

const s = engine.liveSky;
const DESCRIPTION = "A month-by-month planning aid for the observing year. The platform does not assume today's date — a live 'this month' view is prepared for a connected date-and-location provider; here is the perennial guide instead.";
export const metadata: Metadata = buildMetadata({ title: "This Month in the Sky — Planning Guide", description: DESCRIPTION, path: skyPath("this-month") });

export default function ThisMonthPage() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "This Month", url: skyPath("this-month") }];
  const highlights = [1, 4, 8, 12].map((m) => ({ m, events: s.observingCalendar.forMonth(m) }));
  const provider = getProvider("usno");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), { "@context": "https://schema.org", "@type": "WebPage", name: "This Month in the Sky", description: DESCRIPTION, url: absoluteUrl(skyPath("this-month")) }]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Night Sky Platform</span>} title="This Month in the Sky" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="prepared" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14 max-w-3xl space-y-8">
        <PreparedForIntegration providers={provider ? [provider] : []} envelope={undefined} />
        <SkySection id="planning" title="Planning an observing month">
          <p className="leading-relaxed text-muted">To plan a month of observing: check the Moon&apos;s phase (a bright Moon washes out faint objects and meteors), note any meteor-shower peaks, and find a dark site with a clear horizon in the right direction. The highlights of the year fall in these months:</p>
          <div className="mt-4 space-y-4">
            {highlights.map(({ m, events }) => (
              <div key={m} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="font-display font-semibold text-fg">{monthName(m)}</h3>
                <ul className="mt-2 space-y-1.5">
                  {events.map((e) => (
                    <li key={e.slug} className="text-sm text-muted">
                      <span className="font-medium text-fg">{e.kind === "meteor-shower" ? <Link href={meteorShowerPath(e.slug.replace(/-peak$/, ""))} className="hover:text-nebula">{e.name}</Link> : e.name}</span> — {e.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">For the full year, see the <Link href={skyPath("events")} className="text-nebula hover:underline">observing year</Link> and the <Link href={skyPath("observing-calendar")} className="text-nebula hover:underline">observing calendar</Link>.</p>
        </SkySection>
      </Container>
    </>
  );
}
