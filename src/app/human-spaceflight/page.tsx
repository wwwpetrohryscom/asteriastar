import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { HsfCards, type HsfCardItem } from "@/components/human-spaceflight/HsfCards";
import { engine } from "@/platform/data-engine";
import { HSF_DISCOVERIES } from "@/app/human-spaceflight/discovery";
import { KIND_LABEL } from "@/knowledge-graph/data/human-spaceflight-catalog/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, humanSpaceflightPath, humanSpaceflightDiscoveryPath } from "@/lib/routes";

const COUNT = engine.humanSpaceflight.count;
const STATIONS = engine.humanSpaceflight.byKind("station").length;
const DESCRIPTION = `How humans live and work in space: ${STATIONS} space stations, plus crewed spacecraft, ISS modules, expeditions, spacewalks, programs, and astronauts — ${COUNT} interconnected entities, from authoritative public sources.`;

export const metadata: Metadata = buildMetadata({ title: "Space Stations & Human Spaceflight", description: DESCRIPTION, path: ROUTES.humanSpaceflight });

export default function HumanSpaceflightHub() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Human Spaceflight", url: ROUTES.humanSpaceflight },
  ];
  const kinds = engine.humanSpaceflight.kinds();
  const stations: HsfCardItem[] = engine.humanSpaceflight.byKind("station").map((r) => ({
    id: r.id, name: r.name, href: humanSpaceflightPath(r.slug), kindLabel: KIND_LABEL[r.kind],
    meta: [r.country, r.operationalPeriod].filter(Boolean).join(" · "), description: r.description, status: r.status,
  }));

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Stations & Human Spaceflight", description: DESCRIPTION, url: ROUTES.humanSpaceflight })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="aurora"
        eyebrow={<span>Space Stations &amp; Human Spaceflight</span>}
        title="Living and working in space"
        lead={`How humans travel, live, and do science in orbit — ${STATIONS} space stations and ${COUNT} interconnected entities spanning crewed spacecraft, ISS modules, expeditions, spacewalks, programs, and the people who fly.`}
      >
        <p className="mt-6 text-sm text-faint">
          {kinds.map((k) => `${k.count} ${k.plural.toLowerCase()}`).join(" · ")}
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="stations">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="stations" className="font-display text-2xl font-bold">Space stations</h2>
            <Link href={humanSpaceflightDiscoveryPath("all-space-stations")} className="text-sm text-muted transition hover:text-fg">All stations →</Link>
          </div>
          <div className="mt-4"><HsfCards items={stations} /></div>
        </section>

        <section aria-labelledby="discover">
          <h2 id="discover" className="font-display text-2xl font-bold">Discover</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HSF_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={humanSpaceflightDiscoveryPath(d.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-1.5">
            The human-spaceflight encyclopedia is curated from authoritative public sources — NASA, ESA, Roscosmos, JAXA, CSA, and the Smithsonian. Crew rosters, launch and landing dates, EVA durations, and station modules are well-established public facts; uncertain values are omitted, and planned stations are clearly marked as not yet operational. See the{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link> page.
          </p>
        </section>
      </Container>
    </>
  );
}
