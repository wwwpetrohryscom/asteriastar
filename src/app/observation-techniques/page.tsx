import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TechniqueCards } from "@/components/observation-techniques/TechniqueCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, observationTechniquesDiscoveryPath } from "@/lib/routes";
import { CG_DISCOVERIES } from "@/app/observation-techniques/discovery";

const DESCRIPTION =
  "The practical craft of observing — how the sky is turned into data and images. New capture-to-image techniques: visual astronomy, astrophotography and its planetary, deep-sky, and narrowband variants, autoguiding, the bias/dark/flat calibration frames, image processing, drizzle, plate solving, and the end-to-end imaging workflow. Reuses the frontier techniques (lucky and speckle imaging, image stacking, the adaptive-optics chain), the CCD and CMOS detectors, the measurement methods (photometry, spectroscopy, polarimetry, astrometry, occultations, calibration), the amateur equipment and observing planners, and the telescopes already in the graph. Only well-established observing practice is stated; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Professional Observation Techniques", description: DESCRIPTION, path: ROUTES.observationTechniques });

// Techniques, detectors, methods and equipment already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "observing_technique:lucky-imaging",
  "observing_technique:speckle-imaging",
  "observing_technique:image-stacking",
  "detector_technology:ccd",
  "detector_technology:cmos",
  "astronomy_method:adaptive-optics",
  "astronomy_method:photometry",
  "astronomy_method:spectroscopy",
  "instrument_technique:coronagraph",
  "observing_equipment:equatorial-mount",
  "observing_planner:astrophotography-planner",
  "exoplanet_detection_method:direct-imaging",
];

export default function ObservationTechniquesHubPage() {
  const e = engine.observationTechniques;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observation Techniques", url: ROUTES.observationTechniques },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Professional Observation Techniques", description: DESCRIPTION, url: ROUTES.observationTechniques })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Encyclopedia · {e.count} entries · turning the sky into images</span>}
        title="Professional Observation Techniques"
        lead="Between a telescope and a finished image lies a craft: seeing faint detail by eye, capturing light with a camera, freezing the atmosphere for planetary detail, tracking faint galaxies for hours, and calibrating, stacking, and processing the raw frames into a faithful picture. These are the techniques of observing, each tied to the detectors, methods, and equipment already in the graph."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the craft</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CG_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={observationTechniquesDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="visual-heading">
          <h2 id="visual-heading" className="font-display text-2xl font-bold">Visual observing</h2>
          <div className="mt-4"><TechniqueCards records={e.visual()} /></div>
        </section>

        <section aria-labelledby="imaging-heading">
          <h2 id="imaging-heading" className="font-display text-2xl font-bold">Imaging techniques</h2>
          <div className="mt-4"><TechniqueCards records={e.imaging()} /></div>
        </section>

        <section aria-labelledby="processing-heading">
          <h2 id="processing-heading" className="font-display text-2xl font-bold">Processing techniques</h2>
          <div className="mt-4"><TechniqueCards records={e.processing()} /></div>
        </section>

        <section aria-labelledby="workflow-heading">
          <h2 id="workflow-heading" className="font-display text-2xl font-bold">Observing workflow</h2>
          <div className="mt-4"><TechniqueCards records={e.workflow()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The frontier techniques, detectors, methods, and equipment these build on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the frontier techniques (lucky and speckle imaging, image stacking, the adaptive-optics chain), the CCD and CMOS detectors, the measurement methods, the amateur equipment and observing planners, and the telescopes already in the graph. Only well-established observing practice is stated; image processing is described as representing real signal, not inventing it, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
