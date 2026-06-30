import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ExplorationTable } from "@/components/exploration/ExplorationTable";
import { engine } from "@/platform/data-engine";
import { EXPLORATION_DISCOVERIES } from "@/app/exploration/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, explorationDiscoveryPath } from "@/lib/routes";

const COUNT = engine.exploration.count;
const MISSIONS = engine.exploration.missionCount;
const DESCRIPTION = `The history of human space exploration as a knowledge graph: ${MISSIONS} missions, plus agencies, programs, launch vehicles, spacecraft, astronauts, and instruments — ${COUNT} interconnected entities, all from authoritative public sources.`;

export const metadata: Metadata = buildMetadata({ title: "Space Exploration Encyclopedia", description: DESCRIPTION, path: ROUTES.exploration });

export default function ExplorationHub() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Exploration", url: ROUTES.exploration },
  ];
  const kinds = engine.exploration.kinds();
  const featured = engine.exploration.missionTimeline().filter((m) => m.discoveries?.length).slice(0, 10);
  const agencies = engine.exploration.agencies().filter((a) => a.missionCount > 0).slice(0, 10);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Exploration Encyclopedia", description: DESCRIPTION, url: ROUTES.exploration })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="comet"
        eyebrow={<span>Space Exploration Encyclopedia</span>}
        title="The history of reaching into space"
        lead={`Every mission, spacecraft, launch vehicle, agency, astronaut, and instrument as a first-class knowledge-graph entity — ${MISSIONS} missions across ${COUNT} interconnected records, from Sputnik to the James Webb Space Telescope.`}
      >
        <p className="mt-6 text-sm text-faint">
          {kinds.map((k) => `${k.count} ${k.plural.toLowerCase()}`).join(" · ")}
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="featured">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="featured" className="font-display text-2xl font-bold">Landmark missions</h2>
            <Link href={explorationDiscoveryPath("all-missions")} className="text-sm text-muted transition hover:text-fg">All missions →</Link>
          </div>
          <div className="mt-4"><ExplorationTable records={featured} /></div>
        </section>

        <section aria-labelledby="discover">
          <h2 id="discover" className="font-display text-2xl font-bold">Discover</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPLORATION_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={explorationDiscoveryPath(d.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="agencies">
          <h2 id="agencies" className="font-display text-2xl font-bold">By agency</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {agencies.map((a) => (
              <li key={a.record.id}>
                <Link href={`/exploration/${a.record.slug}`} className="flex items-baseline justify-between gap-2 text-muted transition hover:text-fg">
                  <span>{a.record.name}</span>
                  <span className="text-xs text-faint">{a.missionCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-1.5">
            The exploration encyclopedia is curated from authoritative public sources — NASA, ESA, JPL, and the world&apos;s national space agencies. Mission histories, launch dates, and discoveries are well-established public facts; uncertain values are omitted rather than invented. See the{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link> page.
          </p>
        </section>
      </Container>
    </>
  );
}
