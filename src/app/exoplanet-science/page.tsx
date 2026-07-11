import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ExoScienceCards } from "@/components/exoplanet-science/ExoScienceCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, exoplanetScienceDiscoveryPath } from "@/lib/routes";
import { CC_DISCOVERIES } from "@/app/exoplanet-science/discovery";

const DESCRIPTION =
  "How other worlds are found and studied — the methods and physics of exoplanet science, layered on the platform's exoplanet catalogue. Characterization methods: transmission and emission spectroscopy, the secondary eclipse, phase curves, atmospheric retrieval, high-resolution cross-correlation spectroscopy, and the Rossiter–McLaughlin effect. Atmospheres: clouds and hazes, thermal inversions, equilibrium temperature, and atmospheric metallicity and the C/O ratio. Planet formation: core accretion, disk instability, migration, the snow line, and pebble accretion. Plus the two dedicated exoplanet missions now being built — ESA's Ariel and PLATO. Reuses the eight detection methods, the planetary classes, the habitable zone, the biosignatures, the atmospheric processes, the protoplanetary disk, and JWST, Kepler, TESS, Roman, HWO, ELT, GMT and TMT already in the graph. Only well-established science is stated; missions not yet launched are flagged and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Exoplanet Science & Characterization", description: DESCRIPTION, path: ROUTES.exoplanetScience });

// Exoplanet-science entities already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "exoplanet_detection_method:transit",
  "exoplanet_detection_method:radial-velocity",
  "exoplanet_detection_method:direct-imaging",
  "space_telescope:james-webb-space-telescope",
  "space_telescope:nancy-grace-roman",
  "mission_concept:habitable-worlds-observatory",
  "telescope:extremely-large-telescope",
  "habitable_zone_candidate:habitable-zone",
  "biosignature:atmospheric-biosignature",
  "interstellar_environment:protoplanetary-disk",
  "planetary_process:atmospheric-escape",
  "planetary_class:hot-jupiter",
];

export default function ExoplanetScienceHubPage() {
  const e = engine.exoplanetScience;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Exoplanet Science", url: ROUTES.exoplanetScience },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Exoplanet Science & Characterization", description: DESCRIPTION, url: ROUTES.exoplanetScience })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Encyclopedia · {e.count} entries · how other worlds are read</span>}
        title="Exoplanet Science & Characterization"
        lead="Finding a planet around another star is only the beginning. Follow how starlight filtered through an atmosphere, the glow of a hidden dayside, and the changing phases of a distant world are turned into measured compositions — and how the same worlds trace their origins back to the disks and snow lines where they formed. Every method ties back to the detectors, telescopes, and planets already in the graph."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore exoplanet science</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CC_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={exoplanetScienceDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="char-heading">
          <h2 id="char-heading" className="font-display text-2xl font-bold">Characterization methods</h2>
          <div className="mt-4"><ExoScienceCards records={e.characterization()} /></div>
        </section>

        <section aria-labelledby="atm-heading">
          <h2 id="atm-heading" className="font-display text-2xl font-bold">Exoplanet atmospheres</h2>
          <div className="mt-4"><ExoScienceCards records={e.atmospheres()} /></div>
        </section>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="font-display text-2xl font-bold">Planet formation</h2>
          <div className="mt-4"><ExoScienceCards records={e.formation()} /></div>
        </section>

        <section aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="font-display text-2xl font-bold">Exoplanet missions</h2>
          <div className="mt-4"><ExoScienceCards records={e.missions()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The detection methods, telescopes, worlds, and processes these concepts build on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the eight detection methods, the planetary classes, the habitable zone, the biosignatures, the atmospheric processes, the protoplanetary disk, and JWST, Kepler, TESS, Roman, HWO, ELT, GMT and TMT already in the graph. Only well-established science is stated; missions not yet launched — Ariel and PLATO — are flagged as such, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
