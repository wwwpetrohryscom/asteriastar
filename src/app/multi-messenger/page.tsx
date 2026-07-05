import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MmCards } from "@/components/multi-messenger/MmCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, multiMessengerDiscoveryPath } from "@/lib/routes";
import { AZ_DISCOVERIES } from "@/app/multi-messenger/discovery";

const DESCRIPTION =
  "The knowledge layer of modern multi-messenger astronomy — how the universe is now observed in gravitational waves, neutrinos, and light at once. The gravitational-wave observatories new to the graph — the operating GEO600 testbed, the proposed next-generation Einstein Telescope and Cosmic Explorer, and the space missions DECIGO, Taiji, and TianQin — alongside the reused LIGO, Virgo, and KAGRA detectors and the LISA concept. The detection methods, from ground and space laser interferometry to galaxy-sized pulsar timing arrays. The compact-binary-merger source classes — binary black holes, binary neutron stars, black hole–neutron star mergers — and their electromagnetic counterparts. The multi-messenger channels pairing gravitational waves with light, neutrinos, gamma rays, radio, and optical. The alert systems (the LVK public alerts and SCiMMA), the follow-up workflow from localization to counterpart search, and the scientific products — skymaps, waveforms, parameter estimation, and the GWTC catalog. Reuses the platform's detectors, methods, transient classes, alert systems, the standard-siren distance indicator, and the gravitational-wave and multi-messenger bands; proposed detectors are stated as such and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Multi-Messenger & Gravitational-Wave Operations", description: DESCRIPTION, path: ROUTES.multiMessenger });

export default function MultiMessengerHubPage() {
  const e = engine.multiMessenger;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Multi-Messenger", url: ROUTES.multiMessenger },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Multi-Messenger & Gravitational-Wave Operations", description: DESCRIPTION, url: ROUTES.multiMessenger })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Encyclopedia · {e.count} entries · {e.facilityCount} gravitational-wave detectors</span>} title="Multi-Messenger &amp; Gravitational-Wave Operations" lead="In 2015 humanity heard spacetime ring for the first time; in 2017 it saw and heard the same event at once. This is the operational science of the new astronomy — the detectors that feel a merger a billion light-years away, the alerts that race the news around the world, and the telescopes that chase the light before it fades." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore multi-messenger astronomy</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AZ_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={multiMessengerDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="font-display text-2xl font-bold">The sources that ring spacetime</h2>
          <div className="mt-4"><MmCards records={e.sources()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each detector, detection method, source class, alert system, channel, follow-up stage, and data product is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the LIGO, Virgo, and KAGRA detectors and the LISA concept, the gravitational-wave, multi-messenger, and neutrino methods, the transient classes, the alert systems, the standard-siren distance indicator, and the bands already in the graph. Curated from the LIGO–Virgo–KAGRA collaboration, NASA, and ESA. Proposed detectors are stated as such. See{" "}<Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
