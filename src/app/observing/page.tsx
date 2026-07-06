import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OsCards } from "@/components/observing/OsCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, observingDiscoveryPath } from "@/lib/routes";
import { BQ_DISCOVERIES } from "@/app/observing/discovery";

const DESCRIPTION =
  "A professional observing platform built on the graph. The planners — tonight, visibility, target, Moon, planet, deep-sky, season, twilight, darkness, altitude, meridian-transit, equipment, astrophotography, and session — organise the platform's real computed twilight, Moon, and planet data and its observing equipment, sites, and techniques into an observing workflow. The data integrations — weather, seeing, transparency, cloud cover, and Bortle sky brightness — are architecture-ready interfaces wired into the planners, each awaiting a connected provider so that no observing conditions are ever invented. Reuses the platform's live-sky computations, the observing equipment, sites and techniques, and the Moon, Sun, planets, meteor showers and deep-sky objects. Privacy-first: an observer's location stays on their device.";

export const metadata: Metadata = buildMetadata({ title: "Professional Observatory Planning Suite", description: DESCRIPTION, path: ROUTES.observing });

export default function ObservingHubPage() {
  const e = engine.observingSuite;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observing Suite", url: ROUTES.observing },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Professional Observatory Planning Suite", description: DESCRIPTION, url: ROUTES.observing })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Encyclopedia · {e.count} tools · {e.plannerCount} planners</span>} title="Professional Observatory Planning Suite" lead="From catalogue to eyepiece. This suite turns the platform's computed twilight, Moon, and planet data into a night's observing plan — what to see, when it is highest, and when the sky is truly dark — while the conditions that decide whether a session happens come only from connected providers, never invented." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the suite</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BQ_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={observingDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-comet hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="planners-heading">
          <h2 id="planners-heading" className="font-display text-2xl font-bold">The planners</h2>
          <div className="mt-4"><OsCards records={e.planners()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each planner and integration is a first-class knowledge-graph entity resolved through the Scientific Data Engine. The planners reuse the computed live-sky data of the platform (twilight, the Moon, the planets) and its observing equipment, sites, and techniques — no ephemeris is re-implemented. The integrations are architecture-ready interfaces: weather, seeing, transparency, cloud, and Bortle data appear only from connected providers, never fabricated, following the same honesty envelope as the live-sky providers. The observing location stays on the device. See{" "}<Link href="/transparency/source-quality" className="text-comet underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
