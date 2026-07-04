import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MethodCards } from "@/components/methods/MethodCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, methodDiscoveryPath } from "@/lib/routes";
import { METHOD_DISCOVERIES, reusedForMethodDiscovery } from "@/app/methods/discovery";

const DESCRIPTION =
  "How astronomy actually works — the methods, measurements, and techniques behind the science. Astrometry and parallax; photometry and spectroscopy; the cosmic distance ladder from Cepheids to redshift; exoplanet detection; helioseismology; gravitational lensing, gravitational-wave detection, neutrino and multi-messenger astronomy; and the calibration, error analysis, and honest uncertainty that make a measurement science. Reuses the platform's exoplanet-detection methods, cosmology concepts, observing bands, and the Gaia telescope; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Astronomy Methods, Measurements & Scientific Techniques", description: DESCRIPTION, path: ROUTES.methods });

export default function MethodsHubPage() {
  const e = engine.astronomyMethods;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Methods", url: ROUTES.methods },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Astronomy Methods, Measurements & Scientific Techniques", description: DESCRIPTION, url: ROUTES.methods })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Encyclopedia · {e.categories().length} categories · {e.methodCount} techniques</span>} title="Astronomy Methods, Measurements &amp; Scientific Techniques" lead="Everything astronomy knows, it knows through a method. This encyclopedia explains how — how we measure a distance, weigh a black hole, read a spectrum, and detect a ripple in spacetime — and how uncertainty is measured, not hidden." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the methods</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {METHOD_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={methodDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length + reusedForMethodDiscovery(d).length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="cats-heading">
          <h2 id="cats-heading" className="font-display text-2xl font-bold">Method categories</h2>
          <div className="mt-4"><MethodCards records={e.categories()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each method category and technique is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the exoplanet-detection methods, cosmology concepts, observing bands, the Gaia telescope, and the Harvard classification already in the graph. Curated from NASA and ESA. Every method carries its uncertainties — a measurement without an error bar is not a measurement. See{" "}<Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
