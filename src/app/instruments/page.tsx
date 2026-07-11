import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InstCards } from "@/components/instruments/InstCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, instrumentsDiscoveryPath } from "@/lib/routes";
import { INST_DISCOVERIES } from "@/app/instruments/discovery";

const DESCRIPTION =
  "An encyclopedia of the scientific instruments and payloads that do the science of space — cameras, spectrometers, magnetometers, particle and dust detectors, radars, laser altimeters, seismometers, and radio science — grouped by class and linked to the missions that carry them. Reuses and enriches the platform's existing instruments; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Scientific Instruments & Payloads", description: DESCRIPTION, path: ROUTES.instruments });

export default function InstrumentsHubPage() {
  const e = engine.instruments;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Instruments", url: ROUTES.instruments },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Scientific Instruments & Payloads", description: DESCRIPTION, url: ROUTES.instruments })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Encyclopedia · {e.classes().length} classes · {e.newInstrumentCount} instruments</span>} title="Scientific Instruments &amp; Payloads" lead="The science of space is done by instruments — cameras that map worlds, spectrometers that read composition in light, magnetometers that feel hidden oceans, and seismometers that listen to a planet's interior. This encyclopedia maps the payloads and the classes they belong to." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by class</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INST_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={instrumentsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="classes-heading">
          <h2 id="classes-heading" className="font-display text-2xl font-bold">Instrument classes</h2>
          <div className="mt-4"><InstCards records={e.classes()} /></div>
        </section>
        <section aria-labelledby="instruments-heading">
          <h2 id="instruments-heading" className="font-display text-2xl font-bold">Notable instruments</h2>
          <div className="mt-4"><InstCards records={e.instruments()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each instrument class and instrument is a first-class knowledge-graph entity resolved through the Scientific Data Engine. The many instruments already in the graph (Mars, JWST, Hubble, Juno, and ground-telescope instruments) are reused and enriched with their class, never duplicated; new instruments link to their host missions. Curated from NASA, ESA, and mission references. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
