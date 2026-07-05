import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SaCards } from "@/components/stellar-astrophysics/SaCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, stellarAstrophysicsDiscoveryPath } from "@/lib/routes";
import { BF_DISCOVERIES } from "@/app/stellar-astrophysics/discovery";

const DESCRIPTION =
  "How stars form, live, forge the elements, and die. The lives of stars: the collapse of molecular clouds into protostars, the pre-main-sequence and main-sequence phases, the red-giant and asymptotic-giant branches, the helium flash and horizontal branch, mass loss and planetary-nebula ejection, and the core collapse of massive stars. The forging of the elements: the proton–proton chain and CNO cycle, the triple-alpha process, the slow and rapid neutron-capture processes, and the advanced burning stages that end in iron. And the physics of stars: the Hertzsprung–Russell diagram, stellar structure, electron degeneracy pressure, the initial mass function, metallicity, stellar populations, luminosity classes, and binary systems. Reuses the platform's white-dwarf, neutron-star, magnetar and black-hole classes, the supernova, kilonova and variable-star classes, the spectral-classification and asteroseismology methods, Big Bang nucleosynthesis, and real example stars, clusters and nebulae; only well-established astrophysics is stated and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Stellar Astrophysics Deep-Dive", description: DESCRIPTION, path: ROUTES.stellarAstrophysics });

export default function StellarAstrophysicsHubPage() {
  const e = engine.stellarAstrophysics;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Stellar Astrophysics", url: ROUTES.stellarAstrophysics },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Stellar Astrophysics Deep-Dive", description: DESCRIPTION, url: ROUTES.stellarAstrophysics })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Encyclopedia · {e.count} entries · {e.processCount} stellar processes</span>} title="Stellar Astrophysics Deep-Dive" lead="A star is a sphere of plasma balanced for millions or billions of years between gravity and its own fire. This is the story of how one is born from a collapsing cloud, how it forges the elements of the periodic table in its core, and how it ends — as a fading white dwarf, a spinning neutron star, or a black hole." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore stellar astrophysics</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BF_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={stellarAstrophysicsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-plasma hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="processes-heading">
          <h2 id="processes-heading" className="font-display text-2xl font-bold">The lives of stars</h2>
          <div className="mt-4"><SaCards records={e.processes()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each stellar process, nucleosynthesis pathway, and physics concept is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the white-dwarf, neutron-star, magnetar and black-hole classes, the supernova, kilonova and variable-star classes, the spectral-classification and asteroseismology methods, Big Bang nucleosynthesis, and the example stars, clusters and nebulae already in the graph. Curated from NASA, ESO, and the astrophysics literature. Only well-established astrophysics is stated. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
