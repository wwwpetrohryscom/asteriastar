import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RocketsTable } from "@/components/rockets/RocketsTable";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, rocketDiscoveryPath } from "@/lib/routes";
import { ROCKET_DISCOVERIES } from "@/app/rockets/discovery";

const DESCRIPTION =
  "A comprehensive, source-backed encyclopedia of rockets and launch vehicles — families, vehicles, booster and upper stages, engines, propellants, launch providers, programs, and pads. Every specification comes from authoritative sources; unknown values are left blank, never invented.";

export const metadata: Metadata = buildMetadata({ title: "Rockets & Launch Vehicles", description: DESCRIPTION, path: ROUTES.rockets });

export default function RocketsHubPage() {
  const e = engine.launchVehicles;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Rockets & Launch Vehicles", url: ROUTES.rockets },
  ];
  const kinds = e.kinds();
  const featured = e.vehicles().filter((v) => /active/i.test(v.status ?? "")).slice(0, 12);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Rockets & Launch Vehicles", description: DESCRIPTION, url: ROUTES.rockets })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="comet"
        eyebrow={<span>Encyclopedia · {e.count} records</span>}
        title="Rockets & Launch Vehicles"
        lead="How humanity reaches orbit — the vehicles, families, stages, engines, and propellants that power spaceflight, connected to the missions, spacecraft, and crews they carry. Source-backed, with unknown figures left blank rather than invented."
      />

      <Container className="mt-8 mb-14 space-y-10">
        {/* Browse by kind */}
        <section aria-labelledby="kinds-heading">
          <h2 id="kinds-heading" className="font-display text-2xl font-bold">Browse the encyclopedia</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {kinds.map((k) => (
              <li key={k.kind} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="font-display text-2xl font-bold text-fg">{k.count}</div>
                <div className="text-sm text-muted">{k.plural}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Discovery hubs */}
        <section aria-labelledby="discover-heading">
          <h2 id="discover-heading" className="font-display text-2xl font-bold">Explore by theme</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROCKET_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={rocketDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Featured active vehicles */}
        <section aria-labelledby="active-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="active-heading" className="font-display text-2xl font-bold">Active launch vehicles</h2>
            <Link href={rocketDiscoveryPath("all-launch-vehicles")} className="text-sm text-nebula underline-offset-4 hover:underline">All launch vehicles →</Link>
          </div>
          <div className="mt-4"><RocketsTable records={featured} /></div>
        </section>

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Every rocket, engine, stage, and propellant is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Specifications are curated from agency user&apos;s manuals and manufacturer documentation; where a value is not reliably known it is omitted rather than estimated. See{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
