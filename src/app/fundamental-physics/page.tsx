import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PhysicsCards } from "@/components/fundamental-physics/PhysicsCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, fundamentalPhysicsDiscoveryPath } from "@/lib/routes";
import { CA_DISCOVERIES } from "@/app/fundamental-physics/discovery";

const DESCRIPTION =
  "The physics that underpins the cosmos, told through its astronomical relevance. Quantum mechanics — the wave function, superposition, entanglement, the Heisenberg uncertainty principle that holds up white dwarfs and neutron stars, wave–particle duality, quantum spin and the 21-cm line, quantum tunnelling that lets the Sun's core fuse, zero-point energy, and decoherence. Particle physics — elementary particles and the four fundamental forces, the Higgs boson, the neutrino and its flavour oscillations, antimatter, and the matter–antimatter asymmetry. Relativity — mass–energy equivalence, time dilation, length contraction, and the equivalence principle. And quantum cosmology — quantum fluctuations as the seeds of galaxies, vacuum energy and the cosmological-constant problem, the cosmic neutrino background, and the GZK limit. Reuses special and general relativity, spacetime, cosmic inflation, dark matter and dark energy, the cosmological constant, the Standard Model, quantum gravity, the neutrino method, IceCube, cosmic rays, the CMB, and the Sun. Only well-established physics is stated; open questions are flagged and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Quantum & Fundamental Physics for Astronomy", description: DESCRIPTION, path: ROUTES.fundamentalPhysics });

// Physics already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "cosmology_concept:special-relativity",
  "astronomical_theory:general-relativity",
  "cosmology_concept:spacetime",
  "cosmology_concept:cosmic-inflation",
  "cosmology_concept:dark-matter",
  "cosmology_concept:dark-energy",
  "cosmology_concept:cosmological-constant",
  "cosmology_concept:standard-model-of-particle-physics",
  "cosmology_concept:quantum-gravity",
  "astronomy_method:neutrino-astronomy",
  "observatory:icecube",
  "radiation_environment:cosmic-rays",
];

export default function FundamentalPhysicsHubPage() {
  const e = engine.fundamentalPhysics;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Fundamental Physics", url: ROUTES.fundamentalPhysics },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Quantum & Fundamental Physics for Astronomy", description: DESCRIPTION, url: ROUTES.fundamentalPhysics })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="comet"
        eyebrow={<span>Encyclopedia · {e.count} entries · the physics beneath the cosmos</span>}
        title="Quantum & Fundamental Physics for Astronomy"
        lead="Every star, galaxy, and horizon runs on the same fundamental physics. Follow the quantum rules that light spectral lines and hold up neutron stars; the particles and forces that build matter; Einstein's relativity that turns mass into starlight and gravity into curved spacetime; and the quantum seeds that grew into galaxies — each concept framed by where it shapes the sky."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore fundamental physics</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CA_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={fundamentalPhysicsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-muted hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="quantum-heading">
          <h2 id="quantum-heading" className="font-display text-2xl font-bold">Quantum physics</h2>
          <div className="mt-4"><PhysicsCards records={e.quantum()} /></div>
        </section>

        <section aria-labelledby="particle-heading">
          <h2 id="particle-heading" className="font-display text-2xl font-bold">Particle physics</h2>
          <div className="mt-4"><PhysicsCards records={e.particle()} /></div>
        </section>

        <section aria-labelledby="relativity-heading">
          <h2 id="relativity-heading" className="font-display text-2xl font-bold">Relativity</h2>
          <div className="mt-4"><PhysicsCards records={e.relativity()} /></div>
        </section>

        <section aria-labelledby="cosmo-heading">
          <h2 id="cosmo-heading" className="font-display text-2xl font-bold">Quantum cosmology</h2>
          <div className="mt-4"><PhysicsCards records={e.cosmo()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The relativity, cosmology, and particle-physics entities this catalog builds on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing special and general relativity, spacetime, cosmic inflation, dark matter and dark energy, the cosmological constant, the Standard Model, quantum gravity, the neutrino method, IceCube, cosmic rays, the CMB, and the Sun already in the graph. Only well-established physics is stated; open questions — the cosmological-constant problem, the matter–antimatter asymmetry, the union of gravity with quantum theory — are flagged, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-faint underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
