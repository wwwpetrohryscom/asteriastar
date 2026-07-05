import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MlCards } from "@/components/astro-ml/MlCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astroMlDiscoveryPath } from "@/lib/routes";
import { AX_DISCOVERIES } from "@/app/astro-ml/discovery";

const DESCRIPTION =
  "The computational layer of modern astronomy — how data science, artificial intelligence, and machine learning turn the flood of survey data into discovery. The machine-learning methods astronomy borrows and adapts: classification, regression, clustering, representation and self-supervised learning, foundation models, and anomaly detection. The applications where they meet the sky: galaxy morphology, supernova classification, photometric redshifts, transit and strong-lens finding, source extraction, and real-time alert classification. The community alert brokers — ALeRCE, ANTARES, Fink, and Lasair — that classify the Rubin alert stream as it arrives. And the data engineering that makes it trustworthy: training and benchmark datasets, feature extraction, and honest model evaluation. Reuses the platform's Rubin Observatory and alert stream, the alert systems, the photometry and lensing methods, the galaxy morphologies, the transit method, the Type Ia supernova class, the redshift concept, and the reproducibility and data-pipeline practices; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Data Science, AI & Machine Learning in Astronomy", description: DESCRIPTION, path: ROUTES.astroMl });

export default function AstroMlHubPage() {
  const e = engine.astroMl;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astronomy & ML", url: ROUTES.astroMl },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Data Science, AI & Machine Learning in Astronomy", description: DESCRIPTION, url: ROUTES.astroMl })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Encyclopedia · {e.count} entries · {e.applicationCount} applications</span>} title="Data Science, AI &amp; Machine Learning in Astronomy" lead="A modern survey sees more of the sky in a night than an astronomer could study in a lifetime — millions of alerts, billions of objects, petabytes of images. This is how astronomy keeps up: the machine-learning methods that classify and discover at scale, the brokers that triage the alert stream in real time, and the data engineering that keeps it all honest." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore astronomy &amp; ML</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AX_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={astroMlDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-plasma hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="apps-heading">
          <h2 id="apps-heading" className="font-display text-2xl font-bold">Applications on the sky</h2>
          <div className="mt-4"><MlCards records={e.applications()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each ML method, application, workflow, and alert broker is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the Rubin Observatory and alert stream, the alert systems, the photometry and lensing methods, the galaxy morphologies, the transit method, the Type Ia supernova class, the redshift concept, and the reproducibility and data-pipeline practices already in the graph. Curated from NASA, NOIRLab, and the Rubin/LSST community. Benchmark datasets and brokers are named only where real. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
