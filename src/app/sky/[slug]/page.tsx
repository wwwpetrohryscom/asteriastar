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
import { MoonDataPanel } from "@/components/sky/MoonDataPanel";
import { MoonPositionPanel } from "@/components/sky/MoonPositionPanel";
import { SunCalculatorPanel } from "@/components/sky/SunCalculatorPanel";
import { PlanetVisibilityPanel } from "@/components/sky/PlanetVisibilityPanel";
import { TonightDashboardPanel } from "@/components/sky/TonightDashboardPanel";
import { engine } from "@/platform/data-engine";
import { type SkyEnvelope } from "@/platform/live-sky/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, softwareApplicationSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyPath } from "@/lib/routes";

const s = engine.liveSky;

/** A complete, self-contained meta description: whole words, ≤ ~160 chars. */
function metaDescription(lead: string): string {
  if (lead.length <= 160) return lead;
  const cut = lead.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export const dynamicParams = false;
export function generateStaticParams() {
  return s.skyPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/sky/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = s.skyPage(slug);
  if (!p) return {};
  return buildMetadata({ title: p.def.title, description: metaDescription(p.def.lead), path: skyPath(slug) });
}

export default async function SkyPageRoute({ params }: PageProps<"/sky/[slug]">) {
  const { slug } = await params;
  const p = s.skyPage(slug);
  if (!p) notFound();
  const { def, related, providers } = p;
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: def.title, url: skyPath(slug) }];
  const locationRelevant = ["iss", "aurora"].includes(def.content);
  const isMoon = def.content === "moon";
  const isSunOrTwilight = def.content === "sun" || def.content === "twilight";
  const isPlanets = def.content === "planets";
  const isTonight = def.content === "tonight";
  const isComputed = isMoon || isSunOrTwilight || isPlanets || isTonight;
  const skyEnvelope = preparedEnvelopeFor(def.content);
  const jsonLd: Record<string, unknown>[] = [
    breadcrumbSchema(crumbs),
    webPageSchema({ name: def.title, description: def.lead, url: skyPath(slug) }),
  ];
  if (isComputed) {
    jsonLd.push(softwareApplicationSchema({ name: def.title, description: def.lead, url: skyPath(slug), category: "Astronomy" }));
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>{def.eyebrow}</span>} title={def.title} lead={def.lead}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status={def.content === "observing-calendar" ? "reference" : isComputed ? "computed" : "prepared"} /></div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {isMoon && <MoonDataPanel />}
            {isMoon && <MoonPositionPanel />}
            {isSunOrTwilight && <SunCalculatorPanel />}
            {isPlanets && <PlanetVisibilityPanel />}
            {isTonight && <TonightDashboardPanel />}
            <ReferenceBlock content={def.content} />
            {def.content !== "observing-calendar" && !isComputed && <PreparedForIntegration providers={providers} envelope={skyEnvelope} />}
            {related.length > 0 && <SkySection id="related" title="Related in the Knowledge Graph"><RefCards refs={related} /></SkySection>}
            <SourceList keys={def.sourceKeys} title="Sources & references" />
          </div>
          <aside className="space-y-6">
            {!isComputed && skyEnvelope && <EnvelopeCard envelope={skyEnvelope} />}
            {isComputed && !isTonight && (
              <section className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.04] p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">See it all together</h2>
                <p className="mt-2 text-sm text-muted">The <Link href={skyPath("night-sky-tonight")} className="text-nebula hover:underline">Tonight Observing Dashboard</Link> composes the Sun, Moon, and planet tools into one view for your location.</p>
              </section>
            )}
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
    case "moon": return undefined; // computed — rendered by MoonDataPanel, not a prepared stub
    case "sun": return undefined; // computed — rendered by SunCalculatorPanel
    case "twilight": return undefined; // computed — rendered by SunCalculatorPanel
    case "planets": return undefined; // computed — rendered by PlanetVisibilityPanel
    case "comets": return s.comets.currentlyVisible()[0]?.envelope;
    case "asteroids": return s.asteroids.closeApproaches()[0]?.envelope;
    case "iss": return s.iss.passes()[0]?.envelope;
    case "aurora": return s.aurora.forecast().envelope;
    case "observing-calendar": return s.observingCalendar.envelope;
    case "tonight": return undefined; // computed composite — rendered by TonightDashboardPanel
    default: return undefined;
  }
}

function ReferenceBlock({ content }: { content: string }) {
  if (content === "moon") {
    return (
      <SkySection id="phases" title="The phases of the Moon">
        <p className="mb-3 text-sm text-muted">The Moon cycles through its phases every {s.moon.synodicMonthDays} days (the synodic month). These are timeless facts; the <strong className="text-fg">current phase and illumination — and, for your location, moonrise, moonset, and the Moon&apos;s position — are computed above</strong> from public-domain formulae and timestamped.</p>
        <Definitions items={s.moon.phases.map((ph) => [ph.name, ph.meaning])} />
      </SkySection>
    );
  }
  if (content === "sun") {
    return (
      <>
        <SkySection id="about" title="How these times are found">
          <p className="leading-relaxed text-muted">Sunrise and sunset are the moments the Sun&apos;s centre sits 0.833° below the horizon — allowing for atmospheric refraction and the Sun&apos;s radius. Solar noon is when the Sun crosses your meridian, and day length is the time it spends above that horizon. The <strong className="text-fg">times above are computed</strong> from public-domain solar formulae and timestamped; they assume a flat, sea-level horizon and do not model local terrain.</p>
        </SkySection>
        <SkySection id="twilight-bands" title="The twilight phases">
          <p className="mb-3 text-sm text-muted">Between day and full darkness the sky passes through three twilight phases. Their times for your location appear in the calculator above; see the <Link href={skyPath("twilight")} className="text-nebula hover:underline">twilight page</Link> for more.</p>
          <Definitions items={s.twilight.bands.map((b) => [b.name, b.meaning])} />
        </SkySection>
      </>
    );
  }
  if (content === "twilight") {
    return (
      <>
        <SkySection id="bands" title="The three twilight phases">
          <p className="mb-3 text-sm text-muted">Twilight is the time when the sky is lit by the Sun below the horizon. It is divided into three phases by how far below the horizon the Sun sits. Times for your location and date are <strong className="text-fg">computed in the calculator above</strong>; the definitions are timeless.</p>
          <Definitions items={s.twilight.bands.map((b) => [b.name, `${b.meaning} (Sun ${b.upperDeg}° to ${b.lowerDeg}°.)`])} />
        </SkySection>
        <SkySection id="conditions" title="When twilight behaves differently">
          <p className="mb-3 text-sm text-muted">Near the poles and in high-latitude summers, the Sun may never rise, never set, or never get dark enough for a given phase. The calculator reports these honestly and shows the affected times as unavailable rather than inventing them.</p>
          <Definitions items={(["polar_day", "polar_night", "no_civil_twilight", "no_nautical_twilight", "no_astronomical_twilight"] as const).map((k) => [k.replace(/_/g, " "), s.twilight.conditionMeaning[k]])} />
        </SkySection>
      </>
    );
  }
  if (content === "planets") {
    return (
      <SkySection id="planets" title="The naked-eye planets">
        <p className="mb-3 text-sm text-muted">These are timeless facts about how each planet behaves; <strong className="text-fg">tonight&apos;s specific rise, set, and visibility for your location are computed in the calculator above</strong> from public-domain planetary elements.</p>
        <Definitions items={s.planets.nakedEye.map((pl) => [pl.name, pl.behaviour])} />
        <p className="mt-3 text-sm text-faint">Uranus and Neptune require binoculars or a telescope (add <code className="text-muted">?planet=uranus</code> to the API).</p>
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
    <SkySection id="tonight" title="What this dashboard composes — and what it doesn't">
      <p className="leading-relaxed text-muted">The dashboard above is a <strong className="text-fg">composite</strong> of the computed Sun &amp; Twilight, Moon, and Planet tools — it adds no new astronomy, only aggregates and ranks. It does <strong className="text-fg">not</strong> include weather, cloud cover, seeing, transparency, or light pollution, and it does not show live ISS passes, aurora, meteor showers, or comets. Each underlying tool stands on its own:</p>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[["Sun & twilight", skyPath("sun")], ["Moon phase & position", skyPath("moon")], ["Planet visibility", skyPath("planet-visibility")], ["Meteor showers (reference)", skyPath("meteor-showers")]].map(([label, href]) => (
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
