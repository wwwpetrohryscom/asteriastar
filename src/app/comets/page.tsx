import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CometsTable } from "@/components/comets/CometsTable";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, cometDiscoveryPath, cometClassPath, cometFamilyPath, cometReservoirPath } from "@/lib/routes";
import { COMET_DISCOVERIES } from "@/app/comets/discovery";

const DESCRIPTION =
  "A graph-driven encyclopedia of comets and their source reservoirs — periodic and long-period comets, the great comets, sungrazers, the Jupiter-family and Halley-type classes, the Oort cloud and Kuiper Belt, comet missions, and the parent bodies of the meteor showers. Reuses the platform's real comets, meteor showers, missions, and Program Y's small-body reservoirs; every figure is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Comets & Small-Body Reservoirs", description: DESCRIPTION, path: ROUTES.comets });

/** A reused Program Y reservoir, linked to its existing /asteroids page. */
function reusedReservoir(id: string) {
  const e = getEntityById(id);
  return e ? { name: e.name, href: entityGraphPath(e) } : null;
}

export default function CometsHubPage() {
  const e = engine.comets;
  const reused = ["minor_planet_group:kuiper-belt", "minor_planet_group:scattered-disc", "minor_planet_group:centaurs"].map(reusedReservoir).filter(Boolean) as { name: string; href: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Comets", url: ROUTES.comets },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Comets & Small-Body Reservoirs", description: DESCRIPTION, url: ROUTES.comets })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Encyclopedia · {e.count} comets &amp; transition objects</span>}
        title="Comets & Small-Body Reservoirs"
        lead="The icy wanderers of the Solar System — from the short-period comets shepherded by Jupiter to the great comets that fall in from the Oort cloud — connected through the Knowledge Graph to their source reservoirs, the missions that explored them, and the meteor showers they leave behind."
      />

      <Container className="mt-8 mb-14 space-y-10">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by theme</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMET_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={cometDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="classes-heading">
          <h2 id="classes-heading" className="font-display text-2xl font-bold">Comet classes</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {e.classes().map((c) => (
              <li key={c.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={cometClassPath(c.slug)} className="font-medium text-fg hover:text-nebula">{c.name}</Link>
                <div className="text-xs text-faint">{e.byClass(c.slug).length} modelled</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="reservoirs-heading">
          <h2 id="reservoirs-heading" className="font-display text-2xl font-bold">Source reservoirs</h2>
          <p className="mt-1 text-sm text-faint">Where comets come from — the two Oort-cloud regions modelled here, plus Program Y&apos;s trans-Neptunian populations, reused.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {e.reservoirs().map((r) => (
              <li key={r.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={cometReservoirPath(r.slug)} className="font-medium text-fg hover:text-nebula">{r.name}</Link>
                {r.regionLabel && <div className="text-xs text-faint">{r.regionLabel}</div>}
              </li>
            ))}
            {reused.map((r) => (
              <li key={r.href} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={r.href} className="font-medium text-fg hover:text-nebula">{r.name}</Link>
                <div className="text-xs text-faint">Reused from the asteroid encyclopedia</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="families-heading">
          <h2 id="families-heading" className="font-display text-2xl font-bold">Comet families &amp; transition objects</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {e.families().map((f) => (
              <li key={f.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={cometFamilyPath(f.slug)} className="font-medium text-fg hover:text-nebula">{f.name}</Link>
                <div className="text-xs text-faint">Genetic family</div>
              </li>
            ))}
            <li className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <Link href={cometDiscoveryPath("active-asteroids")} className="font-medium text-fg hover:text-nebula">Active asteroids</Link>
              <div className="text-xs text-faint">{e.activeAsteroids().length} modelled</div>
            </li>
            <li className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <Link href={cometDiscoveryPath("dormant-comets")} className="font-medium text-fg hover:text-nebula">Dormant comets</Link>
              <div className="text-xs text-faint">{e.dormantComets().length} modelled</div>
            </li>
          </ul>
        </section>

        <section aria-labelledby="periodic-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="periodic-heading" className="font-display text-2xl font-bold">Periodic comets by orbit</h2>
            <Link href={cometDiscoveryPath("all-comets")} className="text-sm text-nebula underline-offset-4 hover:underline">All comets →</Link>
          </div>
          <div className="mt-4"><CometsTable records={e.periodicComets()} /></div>
        </section>

        <section aria-labelledby="livesky-heading" className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.04] p-5">
          <h2 id="livesky-heading" className="font-display text-base font-semibold text-fg">Live Sky</h2>
          <p className="mt-2 text-sm text-muted">
            This encyclopedia describes comets and their orbits; it computes no live visibility and states no current brightness. For what is genuinely observable, see the computed{" "}
            <Link href="/sky/comets" className="text-nebula underline-offset-4 hover:underline">comets</Link>,{" "}
            <Link href="/sky/meteor-showers" className="text-nebula underline-offset-4 hover:underline">meteor showers</Link>, and{" "}
            <Link href="/sky/observing-calendar" className="text-nebula underline-offset-4 hover:underline">observing calendar</Link> in the Live Sky.
          </p>
        </section>

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Each comet, class, family, reservoir, and transition object is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Designations and orbits come from the IAU Minor Planet Center and the NASA/JPL Small-Body Database. The ten comets already modelled, the meteor showers, the missions, and Program Y&apos;s trans-Neptunian reservoirs are reused — never duplicated. Unknown values are left blank. See{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
