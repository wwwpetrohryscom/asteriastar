import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DlCards } from "@/components/distance-ladder/DlCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, distanceLadderDiscoveryPath } from "@/lib/routes";
import { AV_DISCOVERIES } from "@/app/distance-ladder/discovery";

const DESCRIPTION =
  "The complete distance-measurement layer of modern cosmology — how the universe is measured, and the tension that measurement has revealed. The distance ladder rung by rung: parallax and the Cepheids that anchor it, then RR Lyrae, the tip of the red giant branch, surface brightness fluctuations, the Tully–Fisher and Faber–Jackson relations, water megamasers, standard sirens, Type Ia supernovae, baryon acoustic oscillations, and the cosmic microwave background. The cosmological parameters — the matter and dark-energy densities, the amplitude of fluctuations, the spectral tilt, and the Hubble constant. And the Hubble tension: the persistent gap between the local ladder (the SH0ES programme) and the early universe (Planck), with proposed but unconfirmed resolutions such as early dark energy. Reuses the platform's methods, the Hubble constant and tension, dark energy and dark matter, and the Planck, Gaia, Hubble, and JWST facilities; measured values are not invented.";

export const metadata: Metadata = buildMetadata({ title: "Cosmic Distance Ladder & Cosmological Tensions", description: DESCRIPTION, path: ROUTES.distanceLadder });

export default function DistanceLadderHubPage() {
  const e = engine.distanceLadder;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Distance Ladder", url: ROUTES.distanceLadder },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Cosmic Distance Ladder & Cosmological Tensions", description: DESCRIPTION, url: ROUTES.distanceLadder })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Encyclopedia · {e.count} entries · the ladder &amp; the tension</span>} title="Cosmic Distance Ladder &amp; Cosmological Tensions" lead="Every distance in the universe beyond the nearest stars is measured by a ladder — each rung calibrated by the one below it, from the geometry of parallax to the exploding stars that reach across the cosmos. Follow the ladder to its top and it reveals a crack in cosmology: the universe seems to be expanding faster nearby than the early universe says it should." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the ladder</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AV_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={distanceLadderDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-halo hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="rungs-heading">
          <h2 id="rungs-heading" className="font-display text-2xl font-bold">The rungs of the ladder</h2>
          <div className="mt-4"><DlCards records={e.indicators()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each distance indicator, cosmological parameter, measurement programme, and concept is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the parallax, Cepheid, standard-candle, and distance-ladder methods, the Hubble constant and tension, dark energy and dark matter, and the Planck, Gaia, Hubble, and JWST facilities already in the graph. Curated from Planck, the SH0ES programme, and the gravitational-wave observatories. Measured values are not invented; proposed resolutions of the Hubble tension are labelled unconfirmed. See{" "}<Link href="/transparency/source-quality" className="text-halo underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
