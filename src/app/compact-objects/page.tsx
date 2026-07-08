import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CompactCards } from "@/components/compact-objects/CompactCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, compactObjectsDiscoveryPath } from "@/lib/routes";
import { BZ_DISCOVERIES } from "@/app/compact-objects/discovery";

const DESCRIPTION =
  "The end-states of gravity — black holes and neutron stars. The physics of black holes (the ergosphere, photon sphere, innermost stable circular orbit, singularity, no-hair theorem, frame-dragging, gravitational redshift, spaghettification) and the processes around them (relativistic jets, the Blandford–Znajek mechanism, quasi-periodic oscillations, Bondi accretion); the physics of neutron stars (neutron degeneracy pressure, the equation of state, the pulsar mechanism, glitches, magnetar fields) and the pulsar family (ordinary, millisecond, X-ray, rotation-powered); and the classic objects — Cygnus X-1, V404 Cygni, and the Crab, Vela, first and most-massive pulsars. Reuses the black-hole and neutron-star classes, Sgr A* and M87*, the event horizon and accretion disk, the merger and tidal-disruption transients, the Event Horizon Telescope and the gravitational-wave methods. Only well-established astrophysics is stated; open questions are flagged and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Black Holes, Neutron Stars & Compact Objects", description: DESCRIPTION, path: ROUTES.compactObjects });

// Compact objects and classes already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "black_hole:sagittarius-a-star",
  "black_hole:m87-star",
  "astrophysical_object_class:supermassive-black-hole",
  "astrophysical_object_class:intermediate-mass-black-hole",
  "astrophysical_object_class:primordial-black-hole",
  "astrophysical_object_class:magnetar",
  "cosmology_concept:event-horizon",
  "cosmology_concept:hawking-radiation",
  "transient_class:binary-black-hole-merger",
  "transient_class:tidal-disruption-event",
];

export default function CompactObjectsHubPage() {
  const e = engine.compactObjects;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Compact Objects", url: ROUTES.compactObjects },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Black Holes, Neutron Stars & Compact Objects", description: DESCRIPTION, url: ROUTES.compactObjects })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Encyclopedia · {e.count} entries · the end-states of gravity</span>}
        title="Black Holes, Neutron Stars & Compact Objects"
        lead="Where matter is crushed past every limit. Look into the geometry of a black hole — its horizon, ergosphere, and photon ring — and the jets it launches; then to the neutron star, a Sun's mass in a city-sized sphere, spinning as a pulsar and holding matter denser than an atomic nucleus. The classic objects, from Cygnus X-1 to the Crab, ground it in the real sky."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore compact objects</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {BZ_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={compactObjectsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-plasma hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="bh-heading">
          <h2 id="bh-heading" className="font-display text-2xl font-bold">Black-hole physics</h2>
          <div className="mt-4"><CompactCards records={e.blackHolePhysics()} /></div>
        </section>

        <section aria-labelledby="ns-heading">
          <h2 id="ns-heading" className="font-display text-2xl font-bold">Neutron stars &amp; pulsars</h2>
          <div className="mt-4"><CompactCards records={e.neutronStarPhysics()} /></div>
        </section>

        <section aria-labelledby="obj-heading">
          <h2 id="obj-heading" className="font-display text-2xl font-bold">Named objects</h2>
          <div className="mt-4"><CompactCards records={e.objects()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The supermassive black holes, classes, and phenomena this catalog builds on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the black-hole and neutron-star classes, Sgr A* and M87*, the event horizon and accretion disk, the merger and tidal-disruption transients, and the Event Horizon Telescope and gravitational-wave methods already in the graph. Only well-established astrophysics is stated; open questions — the neutron-star equation of state, how jets are launched, the singularity — are flagged, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
