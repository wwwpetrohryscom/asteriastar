import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MissionsCards } from "@/components/small-body-missions/MissionsCards";
import { MissionsTable } from "@/components/small-body-missions/MissionsTable";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, smallBodyDiscoveryPath, smallBodyTypePath, smallBodySamplePath } from "@/lib/routes";
import { MISSION_DISCOVERIES } from "@/app/small-body-missions/discovery";

const DESCRIPTION =
  "A comprehensive, source-backed encyclopedia of the missions that explored, orbited, landed on, impacted, and returned samples from asteroids and comets — Hayabusa, OSIRIS-REx, Rosetta, DART, Lucy, and more. The engineering bridge across the small-body arc, reusing the platform's spacecraft, rockets, asteroids, and comets; every timeline, target, and sample mass is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Small-Body Missions & Sample Return", description: DESCRIPTION, path: ROUTES.smallBodyMissions });

export default function SmallBodyMissionsHubPage() {
  const e = engine.smallBodyMissions;
  const sampleReturn = e.sampleReturnMissions();
  const active = e.activeSmallBodyMissions();
  const classes = e.classes();
  const samples = e.returnedSamples();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Small-Body Missions", url: ROUTES.smallBodyMissions },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Small-Body Missions & Sample Return", description: DESCRIPTION, url: ROUTES.smallBodyMissions })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="halo"
        eyebrow={<span>Encyclopedia · {e.count} missions · {samples.length} returned samples</span>}
        title="Small-Body Missions &amp; Sample Return"
        lead="How we reached the asteroids and comets — the flybys, orbiters, landers, impactors, and sample-return missions that turned points of light into explored worlds. The engineering bridge across the small-body arc, connecting spacecraft and rockets to the asteroids, comets, and meteorites they studied."
      />

      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by theme</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MISSION_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={smallBodyDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-white hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} missions</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="classes-heading">
          <h2 id="classes-heading" className="font-display text-2xl font-bold">Mission classes</h2>
          <p className="mt-1 text-sm text-faint">The ways a spacecraft can explore a small body — most missions are more than one.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <li key={c.slug} className="scientific-card p-4">
                <Link href={smallBodyTypePath(c.slug)} className="font-medium text-fg hover:text-white">{c.name}</Link>
                <div className="text-xs text-faint">{e.byClass(c.slug).length} missions</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sample-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="sample-heading" className="font-display text-2xl font-bold">Sample return</h2>
            <Link href={smallBodyDiscoveryPath("sample-return")} className="text-sm text-white underline-offset-4 hover:underline">All sample-return →</Link>
          </div>
          <p className="mt-1 text-sm text-faint">The missions that brought pieces of other worlds home — and the samples they returned.</p>
          <div className="mt-4"><MissionsCards records={sampleReturn} /></div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {samples.map((s) => (
              <li key={s.slug}><Link href={smallBodySamplePath(s.slug)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{s.name}{s.massLabel ? ` · ${s.massLabel}` : ""}</Link></li>
            ))}
          </ul>
        </section>

        {active.length ? (
          <section aria-labelledby="active-heading">
            <h2 id="active-heading" className="font-display text-2xl font-bold">In flight now</h2>
            <div className="mt-4"><MissionsCards records={active} /></div>
          </section>
        ) : null}

        <section aria-labelledby="timeline-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="timeline-heading" className="font-display text-2xl font-bold">Mission timeline</h2>
            <Link href={smallBodyDiscoveryPath("mission-timeline")} className="text-sm text-white underline-offset-4 hover:underline">Full timeline →</Link>
          </div>
          <div className="mt-4"><MissionsTable records={e.missionTimeline()} /></div>
        </section>

        <section aria-labelledby="tech-heading" className="scientific-card p-5">
          <h2 id="tech-heading" className="font-display text-base font-semibold text-fg">Mission technologies</h2>
          <p className="mt-2 text-sm text-muted">Small-body missions pioneered technologies now used across deep space: ion (solar-electric) propulsion (Deep Space 1, Dawn, Hayabusa), autonomous optical navigation for close operations at low gravity, aerogel dust capture (Stardust), touch-and-go sampling (OSIRIS-REx), and kinetic-impactor guidance (DART). Every figure here is source-backed; nothing is fabricated.</p>
        </section>

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Each mission, mission class, returned sample, capsule, phase, and campaign is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Missions reuse the platform&apos;s existing spacecraft, rockets (Program V), asteroids (Program Y), comets (Program Z), and agencies — existing missions are enriched, never duplicated. Timelines, targets, launch vehicles, and sample masses come from NASA/JPL, ESA, and JAXA; planned missions assert no results they have not achieved. Unknown values are left blank. See{" "}
            <Link href="/transparency/source-quality" className="text-white underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
