import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AsteroidsTable } from "@/components/asteroids/AsteroidsTable";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, asteroidDiscoveryPath, asteroidFamilyPath, asteroidGroupPath, asteroidNearEarthPath, asteroidTrojanPath, asteroidResonancePath, asteroidImpactPath } from "@/lib/routes";
import { ASTEROID_DISCOVERIES } from "@/app/asteroids/discovery";

const DESCRIPTION =
  "A graph-driven encyclopedia of asteroids and minor planets — the main belt, near-Earth objects, Trojans, Centaurs, and the trans-Neptunian populations, plus dwarf planets, collisional families, orbital resonances, the missions that explore them, impact history, and planetary defense. Reuses the platform's real dwarf planets, asteroids, and missions; every figure is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Asteroids & Minor Planets", description: DESCRIPTION, path: ROUTES.asteroids });

export default function AsteroidsHubPage() {
  const e = engine.asteroids;
  const pd = e.resolvePlanetaryDefense();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Asteroids", url: ROUTES.asteroids },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Asteroids & Minor Planets", description: DESCRIPTION, url: ROUTES.asteroids })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Encyclopedia · {e.count} minor planets · {e.families().length} families · {e.groups().length} populations</span>}
        title="Asteroids & Minor Planets"
        lead="The rocky and icy small bodies of the Solar System — from the main belt and the near-Earth asteroids to the Trojans, Centaurs, and the frozen worlds beyond Neptune — connected through the Knowledge Graph to their families, orbital resonances, and the spacecraft that explore them."
      />

      <Container className="mt-8 mb-14 space-y-10">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by theme</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ASTEROID_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={asteroidDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} bodies</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="defense-heading" className="rounded-2xl border border-nasa/40 bg-nasa/10 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="defense-heading" className="font-display text-2xl font-bold">Planetary defense</h2>
            <Link href="/asteroids/planetary-defense" className="text-sm text-nasa underline-offset-4 hover:underline">Learn about planetary defense →</Link>
          </div>
          <p className="mt-2 text-sm text-muted">How near-Earth objects are discovered, tracked, and — if ever necessary — deflected. {pd.potentiallyHazardous.length} potentially hazardous asteroids and {pd.impactEvents.length} historic impact events are catalogued, alongside the DART and Hera deflection missions. This is a scientific monitoring topic, described without alarm.</p>
        </section>

        <section aria-labelledby="populations-heading">
          <h2 id="populations-heading" className="font-display text-2xl font-bold">Dynamical populations</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {e.groups().map((g) => (
              <li key={g.slug} className="scientific-card p-4">
                <Link href={asteroidGroupPath(g.slug)} className="font-medium text-fg hover:text-nasa">{g.name}</Link>
                {g.regionLabel && <div className="text-xs text-faint">{g.regionLabel}</div>}
              </li>
            ))}
            {e.neoClasses().map((n) => (
              <li key={n.slug} className="scientific-card p-4">
                <Link href={asteroidNearEarthPath(n.slug)} className="font-medium text-fg hover:text-nasa">{n.name}</Link>
                <div className="text-xs text-faint">Near-Earth class</div>
              </li>
            ))}
            {e.trojans().map((t) => (
              <li key={t.slug} className="scientific-card p-4">
                <Link href={asteroidTrojanPath(t.slug)} className="font-medium text-fg hover:text-nasa">{t.name}</Link>
                <div className="text-xs text-faint">Trojan population</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="resonances-heading">
          <h2 id="resonances-heading" className="font-display text-2xl font-bold">Orbital resonances</h2>
          <p className="mt-1 text-sm text-faint">The mean-motion resonances that sculpt the minor-planet populations.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {e.resonances().map((r) => (
              <li key={r.slug} className="scientific-card p-4">
                <Link href={asteroidResonancePath(r.slug)} className="font-medium text-fg hover:text-nasa">{r.name}</Link>
                {r.resonanceRatio && <div className="text-xs text-faint">Ratio {r.resonanceRatio}</div>}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="families-heading">
          <h2 id="families-heading" className="font-display text-2xl font-bold">Asteroid families</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {e.families().map((f) => (
              <li key={f.slug} className="scientific-card p-4">
                <Link href={asteroidFamilyPath(f.slug)} className="font-medium text-fg hover:text-nasa">{f.name}</Link>
                {f.spectralType && <div className="text-xs text-faint">{f.spectralType}-type</div>}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="impacts-heading">
          <h2 id="impacts-heading" className="font-display text-2xl font-bold">Impact events</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {e.impacts().map((i) => (
              <li key={i.slug} className="scientific-card p-4">
                <Link href={asteroidImpactPath(i.slug)} className="font-medium text-fg hover:text-nasa">{i.name}</Link>
                {i.impactDate && <div className="mt-1 text-xs text-faint">{i.impactDate}</div>}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="largest-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="largest-heading" className="font-display text-2xl font-bold">Largest minor planets</h2>
            <Link href={asteroidDiscoveryPath("all-asteroids")} className="text-sm text-nasa underline-offset-4 hover:underline">All minor planets →</Link>
          </div>
          <div className="mt-4"><AsteroidsTable records={e.largest(12)} /></div>
        </section>

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Each asteroid, family, population, near-Earth class, Trojan group, resonance, and impact event is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Designations follow the IAU Minor Planet Center; orbits and sizes come from the NASA/JPL Small-Body Database. The five dwarf planets, the previously-modelled asteroids, and the small-body missions are the platform&apos;s existing entities — reused, never duplicated, and their canonical pages are unchanged. Unknown values are left blank. See{" "}
            <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
