import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { DataStatusBadge } from "@/components/sky/SkyUI";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyPath, meteorShowerPath } from "@/lib/routes";

const s = engine.liveSky;
const DESCRIPTION = "The Night Sky Platform — architecture for a daily-use observing dashboard. Meteor-shower guides and reference data are source-backed; the current Moon phase and location-aware sunrise, sunset, and twilight times are computed and timestamped; other live, location-aware sky data (planets, ISS, aurora, space weather) is prepared for integration. Nothing here fabricates current conditions.";

export const metadata: Metadata = buildMetadata({ title: "Night Sky Platform", description: DESCRIPTION, path: ROUTES.sky });

const SECTIONS: { title: string; href: string; blurb: string }[] = [
  { title: "The Night Sky Tonight", href: skyPath("night-sky-tonight"), blurb: "A location-aware view of what's up — prepared for integration." },
  { title: "Moon Phase", href: skyPath("moon"), blurb: "Current phase & illumination — computed and timestamped." },
  { title: "Sun & Twilight", href: skyPath("sun"), blurb: "Sunrise, sunset & twilight for any location — computed." },
  { title: "Twilight Times", href: skyPath("twilight"), blurb: "Civil, nautical & astronomical twilight explained." },
  { title: "Planet Visibility", href: skyPath("planet-visibility"), blurb: "How the naked-eye planets appear through the year." },
  { title: "Meteor Showers", href: skyPath("meteor-showers"), blurb: "Guides to the eight major annual showers." },
  { title: "Eclipses", href: skyPath("eclipses"), blurb: "Solar and lunar eclipse types and safety." },
  { title: "Comets", href: skyPath("comets"), blurb: "What makes comets visible, and notable comets." },
  { title: "Asteroid Close Approaches", href: skyPath("asteroid-close-approaches"), blurb: "What a close approach means — prepared." },
  { title: "ISS Tracker", href: skyPath("iss-tracker"), blurb: "How ISS passes work; live tracking prepared." },
  { title: "Aurora", href: skyPath("aurora"), blurb: "What causes aurora and the Kp index." },
  { title: "Space Weather", href: skyPath("space-weather"), blurb: "Solar flares and geomagnetic storms." },
  { title: "Observing Calendar", href: skyPath("observing-calendar"), blurb: "A month-by-month guide to recurring events." },
  { title: "Sky Events", href: skyPath("events"), blurb: "Recurring annual sky events at a glance." },
];

export default function SkyHub() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }];
  const showers = s.meteorShowers();

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Night Sky Platform", description: DESCRIPTION, url: ROUTES.sky })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="aurora"
        eyebrow={<span>Night Sky Platform</span>}
        title="A serious observatory dashboard"
        lead="The foundation of a daily-use observing platform, built on the Knowledge Graph and Scientific Data Engine. Meteor-shower parameters and reference data are source-backed and timeless; live, location-aware data is prepared for integration."
      >
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Night Sky</Badge>
          <DataStatusBadge status="reference" />
          <DataStatusBadge status="computed" />
          <DataStatusBadge status="prepared" />
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14 space-y-12">
        <aside role="note" className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-5">
          <p className="text-sm font-semibold text-amber-200">No fabricated live data</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            This platform never invents current sky conditions, positions, forecasts, ISS locations, solar activity, or eclipse dates. Data is <strong className="text-fg">reference</strong> (timeless, source-backed facts), <strong className="text-fg">computed</strong> (a deterministic, source-backed calculation, timestamped — currently the Moon phase), or <strong className="text-fg">prepared</strong> (architecture ready for a named provider, with no values shown). Every datum is clearly labelled with its status and source.
          </p>
        </aside>

        <section aria-labelledby="modules-heading">
          <h2 id="modules-heading" className="font-display text-2xl font-bold">Sky modules</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((sec) => (
              <li key={sec.href}>
                <Link href={sec.href} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{sec.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{sec.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="showers-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="showers-heading" className="font-display text-2xl font-bold">Major meteor showers</h2>
            <Link href={skyPath("meteor-showers")} className="text-sm text-muted transition hover:text-fg">All showers →</Link>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {showers.map((sh) => (
              <li key={sh.slug}>
                <Link href={meteorShowerPath(sh.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/25">
                  <h3 className="font-display font-semibold text-fg group-hover:text-nebula">{sh.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-faint">Peak {sh.peakLabel}</p>
                  <p className="mt-1 text-sm text-muted">ZHR ≈ {sh.zhr}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-faint">Annual parameters from the IMO Meteor Shower Calendar. ZHR is an ideal-condition maximum, not a live count.</p>
        </section>

        <section aria-labelledby="providers-heading">
          <h2 id="providers-heading" className="font-display text-2xl font-bold">Data-provider architecture</h2>
          <p className="mt-2 text-sm text-muted">Typed provider interfaces are in place for the sources a live sky platform would draw on. All are <strong className="text-fg">planned</strong> — none is connected, and no live external API is called from these pages.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.providers().map((p) => (
              <li key={p.key} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-baseline justify-between gap-2"><span className="font-medium text-fg">{p.name}</span><span className="text-xs text-faint">{p.status}</span></div>
                <p className="mt-1 text-sm text-muted">{p.dataKinds.slice(0, 3).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Foundation &amp; provenance</h2>
          <p className="mt-1.5">
            Static knowledge remains the foundation: the Live Sky platform is a set of data clients on top of the <Link href={ROUTES.explore} className="text-nebula hover:underline">Knowledge Graph</Link>. Every sky module links to real entities (the Moon, planets, comets, the ISS, the Sun), and every datum is timestamped and source-labelled. Learn to observe with the <Link href="/learn/observing-the-night-sky" className="text-nebula hover:underline">Observing the Night Sky</Link> path.
          </p>
        </section>
      </Container>
    </>
  );
}
