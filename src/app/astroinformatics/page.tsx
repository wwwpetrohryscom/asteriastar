import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AiCards } from "@/components/astroinformatics/AiCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astroinformaticsDiscoveryPath } from "@/lib/routes";
import { BH_DISCOVERIES } from "@/app/astroinformatics/discovery";

const DESCRIPTION =
  "The software, computing, and data practices that turn astronomical data into science. The research software: the scientific Python ecosystem, Astropy and SunPy, Jupyter notebooks, Astroquery, and scientific visualisation. The research computing: high-performance, GPU, cloud, and distributed computing, the science platforms that bring analysis to the data, and containerised reproducible environments. And the concepts of data-intensive astronomy: scientific workflows, data provenance, the astronomical query languages, big-data astronomy in the petabyte era, and the integrated virtual research environment. Reuses the platform's Virtual Observatory and TAP protocol, the FITS and VOTable standards, the MAST/VizieR/SIMBAD archives, the reproducibility, persistent-identifier and data-pipeline practices, the machine-learning methods, and the Rubin, LSST, SKA and Gaia facilities; only well-established practice is stated and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Astroinformatics & the Virtual Research Ecosystem", description: DESCRIPTION, path: ROUTES.astroinformatics });

export default function AstroinformaticsHubPage() {
  const e = engine.astroinformatics;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astroinformatics", url: ROUTES.astroinformatics },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Astroinformatics & the Virtual Research Ecosystem", description: DESCRIPTION, url: ROUTES.astroinformatics })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Encyclopedia · {e.count} entries · {e.softwareCount} software packages</span>} title="Astroinformatics &amp; the Virtual Research Ecosystem" lead="Astronomy has become a data-intensive science. Behind every survey result is a stack of open-source software, elastic computing, and shared data infrastructure — the scientific Python ecosystem, cloud science platforms, and the Virtual Observatory that let a researcher find, access, and analyse petabytes of data without ever leaving the browser." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore astroinformatics</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BH_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={astroinformaticsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-stone hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="software-heading">
          <h2 id="software-heading" className="font-display text-2xl font-bold">The software astronomers compute with</h2>
          <div className="mt-4"><AiCards records={e.software()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each software package, computing infrastructure, and astroinformatics concept is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the Virtual Observatory, the TAP protocol, the FITS standard, the archives, the open-science practices, the machine-learning methods, and the Rubin, LSST, SKA and Gaia facilities already in the graph. Curated from NASA, STScI, and NOIRLab. Only well-established practice is stated. See{" "}<Link href="/transparency/source-quality" className="text-stone underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
