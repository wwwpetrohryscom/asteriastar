import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { DataStatusBadge, EnvelopeCard, RefCards, SkySection } from "@/components/sky/SkyUI";
import { engine } from "@/platform/data-engine";
import { meteorShowers } from "@/platform/live-sky";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, skyPath, meteorShowerPath } from "@/lib/routes";

const s = engine.liveSky;

export const dynamicParams = false;
export function generateStaticParams() {
  return s.meteorShowerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/sky/meteor-showers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = s.meteorShower(slug);
  if (!r) return {};
  return buildMetadata({ title: `${r.record.name} — Meteor Shower Guide`, description: r.record.description.slice(0, 200), path: meteorShowerPath(slug) });
}

export default async function MeteorShowerPage({ params }: PageProps<"/sky/meteor-showers/[slug]">) {
  const { slug } = await params;
  const r = s.meteorShower(slug);
  if (!r) notFound();
  const m = r.record;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky },
    { name: "Meteor Showers", url: skyPath("meteor-showers") }, { name: m.name, url: meteorShowerPath(slug) },
  ];
  const facts: [string, string, string?][] = [
    ["Activity", m.activeWindow],
    ["Peak", m.peakLabel],
    ["Rate (ZHR)", `≈ ${m.zhr} / hour (ideal)`],
    ["Speed", `${m.velocityKmS} km/s`],
    ["Radiant", r.radiant?.name ?? m.radiantConstellationId, r.radiant?.href],
    ["Parent body", m.parentBodyName, r.parentBody?.href],
    ["Best from", m.bestHemisphere === "Both" ? "Both hemispheres" : `${m.bestHemisphere} Hemisphere`],
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), { "@context": "https://schema.org", "@type": "Event", name: m.name, description: m.description, url: absoluteUrl(meteorShowerPath(slug)), eventSchedule: { "@type": "Schedule", repeatFrequency: "P1Y", description: m.activeWindow } }]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Meteor Shower · peak {m.peakLabel}</span>} title={m.name}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <SkySection id="about" title="About the shower"><p className="leading-relaxed text-muted">{m.description}</p></SkySection>
            <SkySection id="observing" title="Observing notes">
              <p className="leading-relaxed text-muted">The {m.name} radiate from {r.radiant?.name ?? m.radiantConstellationId.replace("constellation:", "")}. For the best view, find a dark site away from city lights, let your eyes adapt for 20 minutes, and look up broadly rather than at the radiant itself. The listed rate is an ideal maximum under a dark sky; moonlight and light pollution reduce it. Exact peak dates and Moon interference for a given year require a connected almanac.</p>
            </SkySection>
            {r.related.length > 0 && <SkySection id="graph" title="In the Knowledge Graph"><RefCards refs={r.related} /></SkySection>}
            <SourceList keys={["imo"]} title="Sources & references" />
          </div>
          <aside className="space-y-6">
            <section aria-labelledby="facts" className="scientific-card p-5">
              <h2 id="facts" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5">
                {facts.map(([k, v, href]) => (
                  <div key={k} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{k}</dt>
                    <dd className="text-right font-medium text-fg">{href ? <Link href={href} className="hover:text-nasa">{v}</Link> : v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <EnvelopeCard envelope={meteorShowers.envelope} />
            <section className="scientific-card p-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Learn</h2>
              <p className="mt-2 text-sm text-muted"><Link href="/learn/observing-the-night-sky" className="text-nasa hover:underline">Observing the Night Sky →</Link></p>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
