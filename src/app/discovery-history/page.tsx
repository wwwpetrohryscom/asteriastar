import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DhCards } from "@/components/discovery-history/DhCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, discoveryHistoryDiscoveryPath } from "@/lib/routes";
import { BD_DISCOVERIES } from "@/app/discovery-history/discovery";

const DESCRIPTION =
  "How astronomy became modern science, and how it knows what it knows. The great arcs of discovery: the Copernican Revolution that moved the Earth from the centre, and the histories of the telescope, of spectroscopy and the birth of astrophysics, of radio astronomy, of cosmology, of exoplanets, of gravitational waves, and of black holes. The methodologies of discovery: the scientific method, paradigm shifts and scientific revolutions, instrumentation-driven discovery, observational bias, the interplay of theory and observation, Big Science, and the data and AI revolution. And the philosophy of science underneath it all: scientific realism, falsifiability, the nature of evidence, measurement uncertainty, replication, and open science. Reuses the platform's astronomers (Copernicus, Galileo, Kepler, Newton, Herschel, Hubble), the astronomy eras, the spectroscopy, gravitational-wave, and error-analysis methods, the transit method, the Hubble tension, Sagittarius A*, the radio band, and the reproducibility practice; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "History & Philosophy of Astronomical Discovery", description: DESCRIPTION, path: ROUTES.discoveryHistory });

export default function DiscoveryHistoryHubPage() {
  const e = engine.discoveryHistory;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "History of Discovery", url: ROUTES.discoveryHistory },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "History & Philosophy of Astronomical Discovery", description: DESCRIPTION, url: ROUTES.discoveryHistory })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Encyclopedia · {e.count} entries · {e.themeCount} histories of discovery</span>} title="History &amp; Philosophy of Astronomical Discovery" lead="Astronomy is the oldest science and, in a sense, the most audacious — it claims to know the composition of stars it can never touch and the history of a universe it can never rerun. This is the story of how it earned that confidence: the revolutions that remade our picture of the cosmos, the instruments that opened each new window, and the philosophy that tells us when a claim about the sky is really knowledge." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the history of discovery</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BD_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={discoveryHistoryDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-muted hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="histories-heading">
          <h2 id="histories-heading" className="font-display text-2xl font-bold">The great arcs of discovery</h2>
          <div className="mt-4"><DhCards records={e.themes()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each history, methodology, and philosophy concept is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the astronomers, the astronomy eras, the spectroscopy, gravitational-wave, and error-analysis methods, the transit method, the Hubble tension, Sagittarius A*, the radio band, and the reproducibility practice already in the graph. Curated from the history and philosophy of science and NASA. See{" "}<Link href="/transparency/source-quality" className="text-faint underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
