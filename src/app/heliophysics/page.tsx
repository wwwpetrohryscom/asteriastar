import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { HpCards } from "@/components/heliophysics/HpCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, heliophysicsDiscoveryPath } from "@/lib/routes";
import { AW_DISCOVERIES } from "@/app/heliophysics/discovery";

const DESCRIPTION =
  "The operational layer of heliophysics — how the Sun drives space weather, and how that weather reaches technology and people. The solar sources: the solar cycle, sunspots, active regions, coronal holes, and the ionosphere they disturb, alongside the reused solar flares, CMEs, solar wind, and geomagnetic storms. The operational impacts: on satellites, GPS and navigation, aviation, human spaceflight, power grids, and radio communications. And the forecasting that watches for it all — NOAA's Space Weather Prediction Center and Europe's space-weather service network, using the Parker Solar Probe, Solar Orbiter, DSCOVR, and ACE. Reuses the platform's space-weather phenomena, the NOAA G/S/R scales, the solar-energetic-particle and Van Allen radiation environments, the heliophysics missions, and the Sun; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Heliophysics & Space Weather Operations", description: DESCRIPTION, path: ROUTES.heliophysics });

export default function HeliophysicsHubPage() {
  const e = engine.heliophysics;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Heliophysics", url: ROUTES.heliophysics },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Heliophysics & Space Weather Operations", description: DESCRIPTION, url: ROUTES.heliophysics })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Encyclopedia · {e.count} entries · {e.impactCount} operational impacts</span>} title="Heliophysics &amp; Space Weather Operations" lead="The Sun is not a constant. It flares, it flings billion-tonne clouds of plasma at the Earth, and it breathes on an eleven-year cycle — and when its weather reaches us, it can knock out radio, scramble GPS, endanger astronauts, and darken power grids. This is the operational science of watching the Sun and defending against it." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore space weather</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AW_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={heliophysicsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="impacts-heading">
          <h2 id="impacts-heading" className="font-display text-2xl font-bold">Operational impacts</h2>
          <div className="mt-4"><HpCards records={e.impacts()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each solar phenomenon, operational impact, and forecasting service is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the space-weather phenomena, the NOAA G/S/R scales, the solar-energetic-particle and Van Allen radiation environments, the Parker Solar Probe, Solar Orbiter, DSCOVR and ACE missions, and the SWPC already in the graph. Curated from NOAA SWPC, NASA, and ESA. Operational impacts are described from documented effects. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
