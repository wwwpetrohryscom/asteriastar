import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { DataStatusBadge, PreparedForIntegration, EnvelopeCard, LocationPlaceholder, RefCards, SkySection } from "@/components/sky/SkyUI";
import { engine } from "@/platform/data-engine";
import type { SkyEnvelope } from "@/platform/live-sky/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, skyPath } from "@/lib/routes";

const s = engine.liveSky;

export const dynamicParams = false;
export function generateStaticParams() {
  return s.skyPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/sky/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = s.skyPage(slug);
  if (!p) return {};
  return buildMetadata({ title: p.def.title, description: p.def.lead.slice(0, 200), path: skyPath(slug) });
}

export default async function SkyPageRoute({ params }: PageProps<"/sky/[slug]">) {
  const { slug } = await params;
  const p = s.skyPage(slug);
  if (!p) notFound();
  const { def, related, providers } = p;
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: def.title, url: skyPath(slug) }];
  const locationRelevant = ["tonight", "iss", "moon", "planets", "aurora"].includes(def.content);
  const preparedEnvelope = preparedEnvelopeFor(def.content);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), { "@context": "https://schema.org", "@type": "WebPage", name: def.title, description: def.lead, url: absoluteUrl(skyPath(slug)) }]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>{def.eyebrow}</span>} title={def.title} lead={def.lead}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status={def.content === "observing-calendar" ? "reference" : "prepared"} /></div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <ReferenceBlock content={def.content} />
            {def.content !== "observing-calendar" && <PreparedForIntegration providers={providers} envelope={preparedEnvelope} />}
            {related.length > 0 && <SkySection id="related" title="Related in the Knowledge Graph"><RefCards refs={related} /></SkySection>}
            <SourceList keys={def.sourceKeys} title="Sources & references" />
          </div>
          <aside className="space-y-6">
            {preparedEnvelope && <EnvelopeCard envelope={preparedEnvelope} />}
            {locationRelevant && <LocationPlaceholder />}
            {def.learnHref && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Learn</h2>
                <p className="mt-2 text-sm text-muted"><Link href={def.learnHref} className="text-nebula hover:underline">Observing the Night Sky →</Link></p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

function preparedEnvelopeFor(content: string): SkyEnvelope | undefined {
  switch (content) {
    case "moon": return s.moon.currentPhase().envelope;
    case "planets": return s.planets.currentVisibility()[0]?.envelope;
    case "comets": return s.comets.currentlyVisible()[0]?.envelope;
    case "asteroids": return s.asteroids.closeApproaches()[0]?.envelope;
    case "iss": return s.iss.passes()[0]?.envelope;
    case "aurora": return s.aurora.forecast().envelope;
    case "observing-calendar": return s.observingCalendar.envelope;
    case "tonight": return s.moon.currentPhase().envelope;
    default: return undefined;
  }
}

function ReferenceBlock({ content }: { content: string }) {
  if (content === "moon") {
    return (
      <SkySection id="phases" title="The phases of the Moon">
        <p className="mb-3 text-sm text-muted">The Moon cycles through its phases every {s.moon.synodicMonthDays} days (the synodic month). These are timeless facts; the current phase requires a connected almanac.</p>
        <Definitions items={s.moon.phases.map((ph) => [ph.name, ph.meaning])} />
      </SkySection>
    );
  }
  if (content === "planets") {
    return (
      <SkySection id="planets" title="The naked-eye planets">
        <Definitions items={s.planets.nakedEye.map((pl) => [pl.name, pl.behaviour])} />
        <p className="mt-3 text-sm text-faint">Uranus and Neptune require binoculars or a telescope.</p>
      </SkySection>
    );
  }
  if (content === "comets") {
    return <SkySection id="comets" title="What makes a comet visible"><p className="leading-relaxed text-muted">{s.comets.reference.whatMakesThemVisible}</p></SkySection>;
  }
  if (content === "asteroids") {
    return (
      <SkySection id="approach" title="What a close approach means">
        <p className="leading-relaxed text-muted">{s.asteroids.reference.closeIsNotCollision}</p>
        <p className="mt-3 leading-relaxed text-muted">{s.asteroids.reference.lunarDistance}</p>
      </SkySection>
    );
  }
  if (content === "iss") {
    return (
      <SkySection id="iss" title="The International Space Station">
        <p className="leading-relaxed text-muted">{s.iss.reference.whatItIs}</p>
        <p className="mt-3 leading-relaxed text-muted">{s.iss.reference.howPassesWork}</p>
      </SkySection>
    );
  }
  if (content === "aurora") {
    return (
      <>
        <SkySection id="cause" title="What causes the aurora"><p className="leading-relaxed text-muted">{s.aurora.reference.cause}</p></SkySection>
        <SkySection id="kp" title="The Kp index"><Definitions items={s.aurora.kpScale.map((k) => [`Kp ${k.kp}`, k.meaning])} /></SkySection>
      </>
    );
  }
  if (content === "observing-calendar") {
    const byMonth = Array.from({ length: 12 }, (_, i) => ({ m: i + 1, events: s.observingCalendar.forMonth(i + 1) })).filter((x) => x.events.length);
    return (
      <SkySection id="calendar" title="A month-by-month guide">
        <p className="mb-4 text-sm text-muted">Recurring sky events by month. These repeat annually; exact dates and times for your year and location are prepared for a connected almanac provider.</p>
        <div className="space-y-4">
          {byMonth.map(({ m, events }) => (
            <div key={m} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="font-display font-semibold text-fg">{events[0].monthLabel}</h3>
              <ul className="mt-2 space-y-1.5">
                {events.map((e) => <li key={e.slug} className="text-sm text-muted"><span className="font-medium text-fg">{e.name}</span> — {e.description}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </SkySection>
    );
  }
  // "tonight"
  return (
    <SkySection id="tonight" title="What tonight's sky page will show">
      <p className="leading-relaxed text-muted">Once a location and ephemeris providers are connected, this page will show the Moon&apos;s phase, which planets are visible and where, any bright ISS passes, and active meteor showers — each clearly timestamped and sourced. For now, explore the reference guides:</p>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[["Moon phase", skyPath("moon")], ["Planet visibility", skyPath("planet-visibility")], ["Meteor showers", skyPath("meteor-showers")], ["ISS passes", skyPath("iss-tracker")]].map(([label, href]) => (
          <li key={href}><Link href={href} className="text-nebula hover:underline">{label} →</Link></li>
        ))}
      </ul>
    </SkySection>
  );
}

function Definitions({ items }: { items: [string, string][] }) {
  return (
    <dl className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      {items.map(([term, def]) => (
        <div key={term} className="grid gap-1 px-4 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
          <dt className="font-medium text-fg">{term}</dt>
          <dd className="text-sm text-muted">{def}</dd>
        </div>
      ))}
    </dl>
  );
}
