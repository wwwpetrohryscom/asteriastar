import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DSCommCards } from "@/components/deep-space-comms/DSCommCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, dsnDiscoveryPath, dsnBandPath, dsnNavigationPath } from "@/lib/routes";
import { DSCOMM_DISCOVERIES } from "@/app/deep-space-network/discovery";

const DESCRIPTION =
  "A graph-driven encyclopedia of the infrastructure that lets us talk to and navigate spacecraft across the Solar System — NASA's Deep Space Network, ESA's Estrack, the ground stations, giant antennas, signal bands, and the radiometric, optical, and autonomous navigation that keep missions in contact. The layer that connects nearly every space program; every figure is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Deep Space Communications & Navigation", description: DESCRIPTION, path: ROUTES.deepSpaceNetwork });

export default function DeepSpaceNetworkHubPage() {
  const e = engine.deepSpaceCommunications;
  const bands = e.signalBands();
  const nav = e.navigationMethods();
  const missions = e.supportedMissions();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep Space Network", url: ROUTES.deepSpaceNetwork },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Deep Space Communications & Navigation", description: DESCRIPTION, url: ROUTES.deepSpaceNetwork })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Encyclopedia · {e.count} networks · {e.allStations().length} stations</span>}
        title="Deep Space Communications &amp; Navigation"
        lead="How we stay in touch with spacecraft billions of kilometres away — the giant antennas, tracking stations, signal bands, and navigation systems that carry every command and every discovery. The infrastructure layer beneath nearly every space program."
      />

      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the infrastructure</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DSCOMM_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={dsnDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="networks-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="networks-heading" className="font-display text-2xl font-bold">The networks</h2>
            <Link href={dsnDiscoveryPath("networks")} className="text-sm text-nasa underline-offset-4 hover:underline">All networks →</Link>
          </div>
          <p className="mt-1 text-sm text-faint">The deep-space and near-Earth networks, from NASA&apos;s DSN to the national and commercial services.</p>
          <div className="mt-4"><DSCommCards records={e.networks()} /></div>
        </section>

        <section aria-labelledby="bands-heading">
          <h2 id="bands-heading" className="font-display text-2xl font-bold">Signal bands</h2>
          <p className="mt-1 text-sm text-faint">The radio and optical bands used to carry data across the Solar System.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {bands.map((b) => (
              <li key={b.slug}><Link href={dsnBandPath(b.slug)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{b.name}{b.frequencyLabel ? ` · ${b.frequencyLabel}` : ""}</Link></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="nav-heading">
          <h2 id="nav-heading" className="font-display text-2xl font-bold">Navigation</h2>
          <p className="mt-1 text-sm text-faint">How spacecraft know where they are and where they point.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nav.map((m) => (
              <li key={m.slug} className="scientific-card p-4">
                <Link href={dsnNavigationPath(m.slug)} className="font-medium text-fg hover:text-nasa">{m.name}</Link>
                {m.role ? <p className="mt-1 text-xs text-faint">{m.role}</p> : null}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="support-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="support-heading" className="font-display text-2xl font-bold">Missions supported</h2>
            <Link href="/small-body-missions" className="text-sm text-nasa underline-offset-4 hover:underline">Small-body missions →</Link>
          </div>
          <p className="mt-1 text-sm text-faint">The networks track spacecraft across the Solar System — from the Voyagers to Psyche.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {missions.map((m) => (
              <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Each network, station, antenna, signal band, and navigation and timing system is a first-class knowledge-graph entity resolved through the Scientific Data Engine. The Deep Space Network, Estrack, and Near Space Network reuse the platform&apos;s existing network entities — enriched, never duplicated — and mission-support links reuse the existing spacecraft. Capabilities and antenna sizes come from NASA/JPL, ESA, and JAXA; signal light-time is real physics (distance ÷ the speed of light), never a fabricated fixed delay. Unknown values are left blank. See{" "}
            <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
