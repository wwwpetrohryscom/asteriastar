import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConceptCards } from "@/components/future-exploration/ConceptCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, futureExplorationDiscoveryPath } from "@/lib/routes";
import { FUTURE_DISCOVERIES } from "@/app/future-exploration/discovery";

const DESCRIPTION =
  "A future-exploration authority — official and credible planned missions and mission concepts. The Artemis return to the Moon, Mars Sample Return, the Venus fleet (DAVINCI, VERITAS, EnVision), the ocean worlds (Dragonfly, Europa Clipper, JUICE), the next great observatories (Roman, Habitable Worlds Observatory, LISA, Athena), planetary defence (NEO Surveyor), and the outer Solar System. Each concept states its status, agency, timeline, goals, target, technology, and uncertainties honestly. Reuses the platform's in-development missions and agencies; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Future Space Exploration & Mission Concepts", description: DESCRIPTION, path: ROUTES.futureExploration });

export default function FutureExplorationHubPage() {
  const e = engine.futureMissions;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Future Exploration", url: ROUTES.futureExploration },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Future Space Exploration & Mission Concepts", description: DESCRIPTION, url: ROUTES.futureExploration })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Encyclopedia · {e.themes().length} themes · {e.conceptCount} concepts</span>} title="Future Space Exploration &amp; Mission Concepts" lead="What comes next — the missions being built and the concepts being studied to return humans to the Moon, bring Mars rocks to Earth, explore the ocean worlds, and search other stars for life. Every mission's real status and open questions are stated plainly." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore what&apos;s next</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FUTURE_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={futureExplorationDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-ember hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="themes-heading">
          <h2 id="themes-heading" className="font-display text-2xl font-bold">Themes</h2>
          <div className="mt-4"><ConceptCards records={e.themes()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each theme and mission concept is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the in-development missions, agencies, and target worlds already in the graph. Only official or credible concepts are included. Curated from NASA and ESA. Status and uncertainties are stated honestly; launch dates are given only when publicly stated. See{" "}<Link href="/transparency/source-quality" className="text-ember underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
