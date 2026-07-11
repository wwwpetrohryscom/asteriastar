import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OfCards } from "@/components/observatory-frontier/OfCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, observatoryFrontierDiscoveryPath } from "@/lib/routes";
import { AU_DISCOVERIES } from "@/app/observatory-frontier/discovery";

const DESCRIPTION =
  "The modern frontier of professional ground-based astronomy — the giant telescopes of the coming decade and the instrumentation that makes them see. The next-generation facilities still rising (the Giant Magellan Telescope, the ngVLA, and the Cherenkov Telescope Array); the adaptive-optics chain that beats the atmosphere (laser guide stars, wavefront sensors, deformable mirrors); the spectrographs, coronagraphs, and starshades; the detectors from the optical CCD to superconducting MKIDs and bolometers; the interferometry that gives astronomy its sharpest vision (radio, optical, and continent-spanning VLBI); and the ground observing techniques from lucky imaging to fringe tracking. Reuses the platform's ground observatories, the adaptive-optics/interferometry/spectroscopy methods, the SPHERE, MUSE and HIRES instruments, and the wavelength bands; facilities under construction are stated as such and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Ground-Based Observatories & Instrumentation Frontier", description: DESCRIPTION, path: ROUTES.observatoryFrontier });

export default function ObservatoryFrontierHubPage() {
  const e = engine.observatoryFrontier;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observatory Frontier", url: ROUTES.observatoryFrontier },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Ground-Based Observatories & Instrumentation Frontier", description: DESCRIPTION, url: ROUTES.observatoryFrontier })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Encyclopedia · {e.count} entries · {e.facilityCount} next-generation facilities</span>} title="Ground-Based Observatories &amp; Instrumentation Frontier" lead="The largest eyes humanity has ever built are rising on mountaintops in Chile and Hawaii, and the deserts of Australia and South Africa. This is the frontier that makes them work — the giant telescopes of the coming decade, the adaptive optics that erase the atmosphere, the detectors that count single photons, and the interferometers that see sharper than any single mirror could." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the frontier</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AU_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={observatoryFrontierDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-muted hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="facilities-heading">
          <h2 id="facilities-heading" className="font-display text-2xl font-bold">Next-generation facilities</h2>
          <div className="mt-4"><OfCards records={e.facilities()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each facility, instrumentation technique, detector, and observing method is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the ground observatories, the adaptive-optics, interferometry, and spectroscopy methods, the SPHERE, MUSE, and HIRES instruments, and the wavelength bands already in the graph. Curated from ESO, NOIRLab, NRAO, and NASA. Facilities under construction or proposed are stated as such. See{" "}<Link href="/transparency/source-quality" className="text-faint underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
