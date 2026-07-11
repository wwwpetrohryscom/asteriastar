import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { EntityImagery } from "@/components/media/EntityImagery";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { StatusBadge } from "@/components/interstellar/StatusBadge";
import type { ResolvedInterstellar } from "@/platform/data-engine/interstellar-engine";
import { KIND_LABEL } from "@/knowledge-graph/data/interstellar-catalog/types";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, interstellarObjectPath } from "@/lib/routes";

type Row = { label: string; value: string; href?: string };
type Ref = { id: string; name: string; href?: string };

export function InterstellarDetail({ d }: { d: ResolvedInterstellar }) {
  const o = d.record;
  const url = interstellarObjectPath(o.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Interstellar Objects", url: ROUTES.interstellarObjects },
    { name: o.name, url },
  ];

  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => {
    if (value !== undefined && value !== null && value !== "") facts.push({ label, value: String(value), href });
  };
  push("Designation", o.designation);
  push("Discovered", o.discoveryDate);
  push("Discovered by", o.discoveredBy);
  push("Survey / facility", o.discoverySurveyLabel);
  push("Eccentricity", o.eccentricity !== undefined ? `${o.eccentricity}${o.eccentricity > 1 ? " (hyperbolic)" : ""}` : undefined);
  push("Perihelion distance", o.perihelionAu !== undefined ? `${o.perihelionAu} AU` : undefined);
  push("Inclination", o.inclinationDeg !== undefined ? `${o.inclinationDeg}°` : undefined);
  push("Excess velocity", o.velocityLabel);
  push("Perihelion date", o.perihelionDate);
  push("Trajectory class", d.trajectoryClass?.name, d.trajectoryClass?.href);

  const science = d.connections.science;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: o.name,
    ...(o.altNames?.length ? { alternateName: o.altNames } : {}),
    description: o.description,
    url: absoluteUrl(url),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>{KIND_LABEL[o.kind]}{o.designation && o.designation !== o.name ? ` · ${o.designation}` : ""}</span>}
        title={o.name}
        lead={o.description}
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {o.status ? <StatusBadge status={o.status} /> : null}
          {o.trajectoryLabel ? <span className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-xs text-muted">{o.trajectoryLabel}</span> : null}
        </div>
      </HeroSection>

      <Container className="mt-6"><EntityImagery entityId={o.id} /></Container>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {o.uncertaintyNote ? (
              <section aria-labelledby="uncertainty" className={`rounded-2xl border p-5 ${o.status === "confirmed_interstellar" ? "border-white/10 bg-white/[0.02]" : "border-nasa/40 bg-nasa/10"}`}>
                <h2 id="uncertainty" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">
                  {o.status === "confirmed_interstellar" ? "Note" : "Status & uncertainty"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.uncertaintyNote}</p>
              </section>
            ) : null}

            {(o.sizeLabel || o.compositionLabel || o.activityLabel || o.originLabel) ? (
              <section aria-labelledby="physical">
                <h2 id="physical" className="font-display text-2xl font-bold">Physical &amp; orbital character</h2>
                <div className="mt-3 space-y-3 text-sm">
                  {o.originLabel ? <FactLine label="Origin" value={o.originLabel} /> : null}
                  {o.activityLabel ? <FactLine label="Activity" value={o.activityLabel} /> : null}
                  {o.sizeLabel ? <FactLine label="Size" value={o.sizeLabel} /> : null}
                  {o.compositionLabel ? <FactLine label="Composition" value={o.compositionLabel} /> : null}
                </div>
              </section>
            ) : null}

            {(d.methods.length || d.surveys.length || d.catalogues.length || d.cometClasses.length || d.related.length) ? (
              <section aria-labelledby="links">
                <h2 id="links" className="font-display text-2xl font-bold">How it was identified</h2>
                <div className="mt-3 space-y-3 text-sm">
                  {d.trajectoryClass ? <RefRow label="Trajectory class" refs={[d.trajectoryClass]} /> : null}
                  {d.methods.length ? <RefRow label="Detection methods" refs={d.methods} /> : null}
                  {d.surveys.length ? <RefRow label="Detected by survey" refs={d.surveys} /> : null}
                  {d.catalogues.length ? <RefRow label="Catalogued by" refs={d.catalogues} /> : null}
                  {d.cometClasses.length ? <RefRow label="Related comet class" refs={d.cometClasses} /> : null}
                  {d.related.length ? <RefRow label="Related" refs={d.related} /> : null}
                </div>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((cx) => (
                    <li key={cx.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{cx.outgoing ? RELATION_LABELS[cx.relation.type] : INVERSE_RELATION_LABELS[cx.relation.type]}</span>
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-nasa">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={o.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="quick" className="scientific-card p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              {o.status ? <div className="mt-3"><StatusBadge status={o.status} /></div> : null}
              <dl className="mt-3 divide-y divide-white/5">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
                    <dt className="text-faint">{f.label}</dt>
                    <dd className="text-right font-medium text-fg">{f.href ? <Link href={f.href} className="hover:text-nasa">{f.value}</Link> : f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="observing" className="rounded-2xl border border-white/20 bg-white/[0.045] p-5">
              <h2 id="observing" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">In the sky</h2>
              <p className="mt-2 text-xs text-muted">Interstellar objects pass through the Solar System once and do not return; this encyclopedia computes no live positions or visibility. For what is genuinely observable tonight, use the Live Sky tools.</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href="/sky/night-sky-tonight" className="text-nasa hover:underline">Tonight&apos;s sky →</Link></li>
                <li><Link href="/sky/observing-calendar" className="text-nasa hover:underline">Observing calendar →</Link></li>
              </ul>
            </section>

            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section aria-labelledby="quality" className="scientific-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="quality" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quality &amp; authority</h2>
                  <span className="text-xs text-faint">{d.quality.completenessPercent}%</span>
                </div>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
                <dl className="mt-3 grid grid-cols-1 gap-y-1.5">
                  {(Object.keys(d.quality.indicators) as QualityDimension[]).slice(0, 6).map((dim) => (
                    <div key={dim} className="flex items-center justify-between gap-2 text-sm">
                      <dt className="text-muted">{QUALITY_DIMENSION_LABELS[dim]}</dt>
                      <dd><CoverageBadge level={d.quality!.indicators[dim]} /></dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-faint">Orbits and designations from the IAU Minor Planet Center and the NASA/JPL Small-Body Database. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}

function FactLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="shrink-0 text-faint">{label}:</span>
      <span className="text-muted">{value}</span>
    </div>
  );
}

function RefRow({ label, refs }: { label: string; refs: Ref[] }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-faint">{label}:</span>
      {refs.map((x, i) => (
        <Link key={x.id || `${x.name}-${i}`} href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 font-medium text-fg hover:border-white/25">{x.name}</Link>
      ))}
    </div>
  );
}
