import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SatellitesCards } from "@/components/satellites/SatellitesCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, satelliteDiscoveryPath, satelliteOperatorPath, satelliteOrbitPath, satelliteNetworkPath } from "@/lib/routes";
import { SATELLITE_DISCOVERIES } from "@/app/satellites/discovery";

const DESCRIPTION =
  "A graph-driven encyclopedia of artificial satellites — communications, navigation, Earth-observation, weather, and scientific satellites and constellations, plus the orbits they fly, the agencies and companies that operate them, and the networks that track them. Reuses the platform's real agencies, rockets, and launch sites; unknown values are left blank and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Satellites", description: DESCRIPTION, path: ROUTES.satellites });

export default function SatellitesHubPage() {
  const e = engine.satellites;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Satellites", description: DESCRIPTION, url: ROUTES.satellites })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Encyclopedia · {e.count} satellites · {e.constellations().length} constellations</span>}
        title="Artificial Satellites"
        lead="The satellites that watch the Earth, connect the world, and navigate the planet — connected through the Knowledge Graph to the agencies that operate them, the rockets that launched them, the launch sites they flew from, and the orbits they occupy."
      />

      <Container className="mt-8 mb-14 space-y-10">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by theme</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SATELLITE_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={satelliteDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="orbits-heading">
          <h2 id="orbits-heading" className="font-display text-2xl font-bold">Orbit types</h2>
          <p className="mt-1 text-sm text-faint">Where satellites fly, and why it matters.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {e.orbits().map((o) => (
              <li key={o.slug} className="scientific-card p-4">
                <Link href={satelliteOrbitPath(o.slug)} className="font-medium text-fg hover:text-nasa">{o.name}</Link>
                <div className="text-xs text-faint">{e.byOrbit(o.slug).length} satellites &amp; constellations</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="operators-heading">
          <h2 id="operators-heading" className="font-display text-2xl font-bold">Operators</h2>
          <p className="mt-1 text-sm text-faint">The space agencies, civil bodies, and companies behind the satellites.</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {e.operators().map((o) => (
              <li key={o.slug} className="scientific-card p-4">
                <Link href={satelliteOperatorPath(o.slug)} className="font-medium text-fg hover:text-nasa">{o.name}</Link>
                <div className="text-xs text-faint">{e.byOperator(o.slug).length} in graph</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="networks-heading">
          <h2 id="networks-heading" className="font-display text-2xl font-bold">Tracking networks</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {e.networks().map((n) => (
              <li key={n.slug} className="scientific-card p-4">
                <Link href={satelliteNetworkPath(n.slug)} className="font-medium text-fg hover:text-nasa">{n.name}</Link>
                <div className="mt-1 text-xs text-faint">{n.country}</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="constellations-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="constellations-heading" className="font-display text-2xl font-bold">Satellite constellations</h2>
            <Link href={satelliteDiscoveryPath("all-satellites")} className="text-sm text-nasa underline-offset-4 hover:underline">All satellites →</Link>
          </div>
          <div className="mt-4"><SatellitesCards records={engine.satellites.constellations()} /></div>
        </section>

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Each satellite, constellation, orbit type, operator, and tracking network is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Agencies, launch vehicles, and launch sites are the platform&apos;s existing, source-backed entities — reused, never duplicated. This encyclopedia performs no real-time tracking and states no live positions; where a satellite is observable, it links to the computed{" "}
            <Link href={ROUTES.sky} className="text-nasa underline-offset-4 hover:underline">Live Sky</Link> tools. Unknown values are left blank. See{" "}
            <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
