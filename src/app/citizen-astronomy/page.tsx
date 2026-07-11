import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CaCards } from "@/components/citizen-astronomy/CaCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, citizenAstronomyDiscoveryPath } from "@/lib/routes";
import { AY_DISCOVERIES } from "@/app/citizen-astronomy/discovery";

const DESCRIPTION =
  "The public participation layer of astronomy — how anyone can take part, and how amateurs still do real science. The citizen-science projects that turn volunteers into researchers: Zooniverse and Galaxy Zoo, Planet Hunters, Globe at Night, Aurorasaurus, and Stardust@home. The amateur observing activities, several of professional value: backyard observing, variable-star observing (with the AAVSO), asteroid and comet observing, occultation timing, and meteor observing (with the International Meteor Organization). The equipment, from a first pair of binoculars and a Dobsonian to an astrophotography rig. And the public outreach that shares the sky — star parties, public observatories, dark-sky parks, and astronomy education. Reuses the platform's aurora, the occultation and photometry methods, the meteor showers and constellations, the eruptive-variable-star class, the Stardust mission, the transit method, the galaxy-morphology-classification application, the Rubin Observatory, and the MAST archive; projects and organisations are named only where real.";

export const metadata: Metadata = buildMetadata({ title: "Citizen Science, Amateur Astronomy & Public Observing", description: DESCRIPTION, path: ROUTES.citizenAstronomy });

export default function CitizenAstronomyHubPage() {
  const e = engine.citizenAstronomy;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Citizen Astronomy", url: ROUTES.citizenAstronomy },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Citizen Science, Amateur Astronomy & Public Observing", description: DESCRIPTION, url: ROUTES.citizenAstronomy })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Encyclopedia · {e.count} entries · {e.projectCount} citizen-science projects</span>} title="Citizen Science, Amateur Astronomy &amp; Public Observing" lead="Astronomy is the rare science where an amateur in a backyard can still contribute to the research frontier — timing an occultation, catching a nova, or classifying a galaxy nobody has looked at before. This is the participation layer: the projects, the activities, the equipment, and the community that make the sky belong to everyone." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore public astronomy</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AY_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={citizenAstronomyDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="font-display text-2xl font-bold">Citizen-science projects</h2>
          <div className="mt-4"><CaCards records={e.projects()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each project, activity, piece of equipment, outreach effort, and organisation is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the aurora, the occultation and photometry methods, the meteor showers and constellations, the eruptive-variable-star class, the Stardust mission, the transit method, the galaxy-morphology-classification application, the Rubin Observatory, and the MAST archive already in the graph. Curated from NASA and the citizen-science and amateur-astronomy communities. Projects and organisations are named only where real. See{" "}<Link href="/transparency/source-quality" className="text-faint underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
