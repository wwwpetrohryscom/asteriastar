import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { DataStatusBadge, PreparedForIntegration, EnvelopeCard, RefCards, SkySection } from "@/components/sky/SkyUI";
import { engine } from "@/platform/data-engine";
import { getProvider } from "@/platform/live-sky";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyPath } from "@/lib/routes";

const s = engine.liveSky;
const DESCRIPTION = "Solar and lunar eclipses explained — the types, the geometry, and how to watch them safely. Specific eclipse dates and paths are prepared for published NASA predictions; none are fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Eclipses — Guide & Data Architecture", description: DESCRIPTION, path: skyPath("eclipses") });

export default function EclipsesPage() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "Eclipses", url: skyPath("eclipses") }];
  const eclipses = s.eclipses;
  const related = s.refs(eclipses.linkedEntityIds);
  const provider = getProvider("eclipse-catalogue");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Eclipses", description: DESCRIPTION, url: skyPath("eclipses") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Night Sky Platform</span>} title="Eclipses" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <aside role="note" className="rounded-xl border border-nasa-red/50 bg-nasa-red/[0.12] p-4">
              <p className="text-sm font-semibold text-nasa">Eye-safety</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">Never look at the Sun (or a partial/annular solar eclipse) without certified solar filters — ordinary sunglasses are not safe. A total lunar eclipse is completely safe to watch with the naked eye.</p>
            </aside>
            <SkySection id="solar" title="Solar eclipses">
              <p className="mb-3 text-sm text-muted">A solar eclipse happens at New Moon, when the Moon passes between Earth and the Sun. <Link href={skyPath("eclipses/solar")} className="text-nasa hover:underline">Solar eclipses in detail →</Link></p>
              <Types items={eclipses.solarTypes.map((t) => [t.name, t.description])} />
            </SkySection>
            <SkySection id="lunar" title="Lunar eclipses">
              <p className="mb-3 text-sm text-muted">A lunar eclipse happens at Full Moon, when the Moon passes through Earth&apos;s shadow. <Link href={skyPath("eclipses/lunar")} className="text-nasa hover:underline">Lunar eclipses in detail →</Link></p>
              <Types items={eclipses.lunarTypes.map((t) => [t.name, t.description])} />
            </SkySection>
            <PreparedForIntegration providers={provider ? [provider] : []} envelope={eclipses.upcoming()[0]?.envelope} />
            {related.length > 0 && <SkySection id="graph" title="Related in the Knowledge Graph"><RefCards refs={related} /></SkySection>}
            <SourceList keys={["nasa"]} title="Sources & references" />
          </div>
          <aside className="space-y-6">
            <EnvelopeCard envelope={eclipses.typesEnvelope} />
            <section className="scientific-card p-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Learn</h2>
              <p className="mt-2 text-sm text-muted"><Link href="/learn/observing-the-night-sky" className="text-nasa hover:underline">Observing the Night Sky →</Link></p>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}

export function Types({ items }: { items: [string, string][] }) {
  return (
    <dl className="divide-y divide-white/5 overflow-hidden scientific-card">
      {items.map(([term, def]) => (
        <div key={term} className="px-4 py-3">
          <dt className="font-medium text-fg">{term}</dt>
          <dd className="mt-1 text-sm text-muted">{def}</dd>
        </div>
      ))}
    </dl>
  );
}
