import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CalcCards } from "@/components/calculators/CalcCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, calculatorsDiscoveryPath } from "@/lib/routes";
import { BP_DISCOVERIES } from "@/app/calculators/discovery";

const DESCRIPTION =
  "Every astronomy calculator under one scientific platform. Interactive calculators for orbital mechanics (escape velocity, orbital period, surface gravity, the Schwarzschild radius, the Hill and Roche limits), stellar physics (luminosity, blackbody radiation, the mass–luminosity relation, stellar lifetimes), photometry and distance (magnitudes, distance modulus, parallax, angular size and separation), exoplanets (equilibrium temperature, transit probability, the habitable zone), cosmology (redshift and Hubble distance), and telescopes (resolution, magnification, image scale, field of view). Each computes its published formula live from CODATA 2018 and IAU 2015 constants and your inputs — nothing is fabricated, and every formula is validated against a known result on each build.";

export const metadata: Metadata = buildMetadata({ title: "Scientific Calculators & Simulation Platform", description: DESCRIPTION, path: ROUTES.calculators });

export default function CalculatorsHubPage() {
  const e = engine.scientificCalculators;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Calculators", url: ROUTES.calculators },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Scientific Calculators & Simulation Platform", description: DESCRIPTION, url: ROUTES.calculators })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Encyclopedia · {e.count} calculators · formulae validated on every build</span>} title="Scientific Calculators &amp; Simulation Platform" lead="Every astronomy calculator, unified — and honest. Each evaluates its published equation live from the real physical constants and your inputs, and every formula is checked against a known textbook result on each build, so you can trust the number as much as the physics behind it." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the calculators</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BP_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={calculatorsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} calculators</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="all-heading">
          <h2 id="all-heading" className="font-display text-2xl font-bold">All calculators</h2>
          <div className="mt-4"><CalcCards records={e.all()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each calculator is a first-class knowledge-graph entity resolved through the Scientific Data Engine, linked to the physics concept it rests on. Results are computed on the device from the CODATA 2018 fundamental constants and the IAU 2015 nominal solar and planetary values — no value is fabricated. The validator recomputes the worked example of every calculator against a known textbook result on each build, so the equations are validated, not merely stated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
