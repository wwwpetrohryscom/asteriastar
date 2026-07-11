import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { ReviewBadge, CoverageBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { ConsensusBadge, ConsensusCallout, ConsensusCard } from "@/components/cosmology/Consensus";
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath, getConnectionsByDomain } from "@/knowledge-graph";
import type { ConsensusLevel, Measurement } from "@/knowledge-graph/data/cosmology-catalog/types";
import { getSource } from "@/lib/sources";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, cosmologyPath } from "@/lib/routes";
import type { Ref } from "@/platform/data-engine/cosmology-engine";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.cosmology.allSlugs().map((slug) => ({ slug }));
}

type D = NonNullable<ReturnType<typeof engine.cosmology.resolve>>;

function consensusOf(d: D): ConsensusLevel | undefined {
  return d.kind === "concept" || d.kind === "model" || d.kind === "object" ? d.record.consensus : undefined;
}
function kindLabel(d: D): string {
  if (d.kind === "concept") {
    const cat = d.record.category;
    return cat === "epoch" ? "Cosmic epoch" : cat === "law" ? "Physical law" : cat === "theory" ? "Theory"
      : cat === "physical-concept" ? "Physical concept" : cat === "quantity" ? "Measured quantity" : "Cosmological concept";
  }
  return d.kind === "model" ? "Cosmological model" : d.kind === "object" ? "Astrophysical object"
    : d.kind === "program" ? programKind(d.record.kind) : "Physicist";
}
function programKind(k: string): string {
  return k === "space-mission" ? "Space mission" : k === "survey" ? "Sky survey" : "Observatory";
}
function descOf(d: D): string {
  return d.kind === "physicist" ? d.record.bio : d.record.definition;
}

export async function generateMetadata({ params }: PageProps<"/cosmology/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.cosmology.resolve(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: descOf(d).slice(0, 200), path: cosmologyPath(slug) });
}

export default async function CosmologyEntityPage({ params }: PageProps<"/cosmology/[slug]">) {
  const { slug } = await params;
  const d = engine.cosmology.resolve(slug);
  if (!d) notFound();

  const title = d.record.name;
  const url = cosmologyPath(slug);
  const consensus = consensusOf(d);
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Cosmology & Universe", url: ROUTES.cosmology }, { name: title, url }];
  const jsonLd = {
    "@context": "https://schema.org", "@type": d.kind === "physicist" ? "Person" : "DefinedTerm",
    name: title, description: descOf(d).slice(0, 300), url: absoluteUrl(url),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>{kindLabel(d)}{"field" in d.record && d.record.field ? ` · ${d.record.field}` : ""}</span>} title={title}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">Cosmology &amp; Universe</Badge>
          {consensus && <ConsensusBadge level={consensus} />}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {consensus && <ConsensusCallout level={consensus} status={"scientificStatus" in d.record ? d.record.scientificStatus : undefined} />}
            {d.kind === "concept" && <ConceptBody d={d} />}
            {d.kind === "model" && <ModelBody d={d} />}
            {d.kind === "object" && <ObjectBody d={d} />}
            {d.kind === "program" && <ProgramBody d={d} />}
            {d.kind === "physicist" && <PhysicistBody d={d} />}
            <ConnectionsSection id={connId(d, slug)} />
            <SourceList keys={d.record.sources} title="Sources & references" />
          </div>
          <aside className="space-y-6">
            <QuickFacts d={d} />
            {consensus && <ConsensusCard level={consensus} />}
            <QualityCard d={d} />
            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
          </aside>
        </div>
      </Container>
    </>
  );
}

function connId(d: D, slug: string): string {
  switch (d.kind) {
    case "concept": return `cosmology_concept:${slug}`;
    case "model": return `cosmological_model:${slug}`;
    case "object": return `astrophysical_object_class:${slug}`;
    case "program": return `observational_program:${slug}`;
    case "physicist": return `astronomer:${slug}`;
  }
}

/* --------------------------------------------------------------------- bodies */

function ConceptBody({ d }: { d: Extract<D, { kind: "concept" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="definition" title="Definition"><p className="text-lg leading-relaxed text-fg">{r.definition}</p></Section>
      <Section id="overview" title="Scientific overview"><p className="leading-relaxed text-muted">{r.overview}</p></Section>
      {r.historicalDevelopment ? <Section id="history" title="Historical development"><p className="leading-relaxed text-muted">{r.historicalDevelopment}</p></Section> : null}
      {r.evidence?.length ? <Section id="evidence" title="Evidence"><Bullets items={r.evidence} /></Section> : null}
      {r.measurements?.length ? <Section id="measurements" title="Current measurements"><MeasurementTable rows={r.measurements} /></Section> : null}
      {r.currentResearch ? <Section id="research" title="Current research"><p className="leading-relaxed text-muted">{r.currentResearch}</p></Section> : null}
      {r.openQuestions?.length ? <Section id="open" title="Open questions"><Bullets items={r.openQuestions} /></Section> : null}
      {r.mathematics ? <Section id="math" title="Mathematics (overview)"><p className="leading-relaxed text-muted">{r.mathematics}</p></Section> : null}
      <LinkSections links={d.links} />
    </>
  );
}

function ModelBody({ d }: { d: Extract<D, { kind: "model" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="definition" title="Definition"><p className="text-lg leading-relaxed text-fg">{r.definition}</p></Section>
      <Section id="overview" title="Scientific overview"><p className="leading-relaxed text-muted">{r.overview}</p></Section>
      {r.historicalDevelopment ? <Section id="history" title="Historical development"><p className="leading-relaxed text-muted">{r.historicalDevelopment}</p></Section> : null}
      {r.evidence?.length ? <Section id="evidence" title="Evidence"><Bullets items={r.evidence} /></Section> : null}
      {r.measurements?.length ? <Section id="measurements" title="Parameters"><MeasurementTable rows={r.measurements} /></Section> : null}
      {d.components.length ? <Section id="components" title="Key ingredients"><RefGrid refs={d.components} /></Section> : null}
      {r.openQuestions?.length ? <Section id="open" title="Open questions"><Bullets items={r.openQuestions} /></Section> : null}
      <LinkSections links={d.links} />
    </>
  );
}

function ObjectBody({ d }: { d: Extract<D, { kind: "object" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="definition" title="Definition"><p className="text-lg leading-relaxed text-fg">{r.definition}</p></Section>
      <Section id="overview" title="Scientific overview"><p className="leading-relaxed text-muted">{r.overview}</p></Section>
      {r.evidence?.length ? <Section id="evidence" title="Evidence"><Bullets items={r.evidence} /></Section> : null}
      {r.measurements?.length ? <Section id="measurements" title="Measurements"><MeasurementTable rows={r.measurements} /></Section> : null}
      {r.openQuestions?.length ? <Section id="open" title="Open questions"><Bullets items={r.openQuestions} /></Section> : null}
      <LinkSections links={d.links} />
    </>
  );
}

function ProgramBody({ d }: { d: Extract<D, { kind: "program" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="definition" title="Definition"><p className="text-lg leading-relaxed text-fg">{r.definition}</p></Section>
      <Section id="overview" title="Overview"><p className="leading-relaxed text-muted">{r.overview}</p></Section>
      {d.operator ? <Section id="operator" title="Operated by"><RefGrid refs={[d.operator]} /></Section> : null}
      {d.measures.length ? <Section id="measures" title="What it measures"><RefGrid refs={d.measures} /></Section> : null}
    </>
  );
}

function PhysicistBody({ d }: { d: Extract<D, { kind: "physicist" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="biography" title="Biography"><p className="leading-relaxed text-muted">{r.bio}</p></Section>
      {d.developed.length ? <Section id="developed" title="Developed"><RefGrid refs={d.developed} /></Section> : null}
    </>
  );
}

/** The shared graph-link sections used by concepts, models, and objects. */
function LinkSections({ links }: { links: import("@/platform/data-engine/cosmology-engine").ResolvedLinks }) {
  return (
    <>
      {links.foundations.length ? <Section id="foundations" title="Rests on"><RefGrid refs={links.foundations} /></Section> : null}
      {links.predicts.length ? <Section id="predicts" title="Predicts"><RefGrid refs={links.predicts} /></Section> : null}
      {links.discoveries.length ? <Section id="discoveries" title="Related discoveries & objects"><RefGrid refs={links.discoveries} /></Section> : null}
      {links.facilities.length ? <Section id="facilities" title="Measured by"><RefGrid refs={links.facilities} /></Section> : null}
      {links.contains.length ? <Section id="contains" title="Contains"><RefGrid refs={links.contains} /></Section> : null}
      {links.scientists.length ? <Section id="scientists" title="Related scientists"><RefGrid refs={links.scientists} /></Section> : null}
      {links.related.length ? <Section id="related" title="Related topics"><RefGrid refs={links.related} /></Section> : null}
    </>
  );
}

/* --------------------------------------------------------------- quick facts */

type Row = { label: string; value: string; href?: string };
function QuickFacts({ d }: { d: D }) {
  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => { if (value != null && value !== "") facts.push({ label, value: String(value), href }); };
  if (d.kind === "concept") {
    push("Type", kindLabel(d)); push("Field", d.record.field);
    push("Consensus", d.consensusMeta.label);
    if (d.record.epochTime) push("When", d.record.epochTime);
    push("Part of model", d.links.model?.name, d.links.model?.href);
  } else if (d.kind === "model") {
    push("Standing", d.record.standing); push("Consensus", d.consensusMeta.label); push("Ingredients", d.components.length || undefined);
  } else if (d.kind === "object") {
    push("Consensus", d.consensusMeta.label);
  } else if (d.kind === "program") {
    push("Type", programKind(d.record.kind)); push("Years", d.record.years); push("Operator", d.operator?.name, d.operator?.href);
  } else if (d.kind === "physicist") {
    push("Lifespan", d.record.birthYear ? `${d.record.birthYear}–${d.record.deathYear ?? "present"}` : undefined);
    push("Nationality", d.record.nationality); push("Fields", d.record.fields?.join(", "));
  }
  if (!facts.length) return null;
  return (
    <section aria-labelledby="quick" className="scientific-card p-5">
      <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
      <dl className="mt-3 divide-y divide-white/5">
        {facts.map((f) => (
          <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
            <dt className="text-faint">{f.label}</dt>
            <dd className="text-right font-medium text-fg">{f.href ? <Link href={f.href} className="hover:text-nasa">{f.value}</Link> : f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function QualityCard({ d }: { d: D }) {
  const q = d.quality;
  if (!q) return null;
  return (
    <section aria-labelledby="quality" className="scientific-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="quality" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quality &amp; authority</h2>
        <span className="text-xs text-faint">{q.completenessPercent}%</span>
      </div>
      <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
      <dl className="mt-3 grid grid-cols-1 gap-y-1.5">
        {(Object.keys(q.indicators) as QualityDimension[]).slice(0, 6).map((dim) => (
          <div key={dim} className="flex items-center justify-between gap-2 text-sm">
            <dt className="text-muted">{QUALITY_DIMENSION_LABELS[dim]}</dt>
            <dd><CoverageBadge level={q.indicators[dim]} /></dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-faint">Curated from authoritative sources. See <Link href="/transparency/source-quality" className="text-nasa hover:underline">source quality</Link>.</p>
    </section>
  );
}

/* ------------------------------------------------------------------ helpers */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
function Bullets({ items }: { items: string[] }) {
  return <ul className="space-y-2">{items.map((x) => <li key={x} className="flex gap-2 text-muted"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nasa/70" />{x}</li>)}</ul>;
}
function MeasurementTable({ rows }: { rows: Measurement[] }) {
  return (
    <div className="overflow-hidden scientific-card">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-white/5">
          {rows.map((m) => (
            <tr key={m.label + m.value}>
              <td className="px-4 py-2.5 text-faint">{m.label}</td>
              <td className="px-4 py-2.5 text-right font-medium text-fg">{m.value}{m.note ? <span className="block text-xs font-normal text-faint">{m.note}</span> : null}</td>
              <td className="px-4 py-2.5 text-right text-xs text-faint">{m.source ? getSource(m.source).name : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function RefGrid({ refs }: { refs: Ref[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {refs.map((r) => (
        <Link key={r.id} href={r.href} className="scientific-card p-3 transition hover:border-white/25">
          <div className="font-medium text-fg">{r.name}</div>
        </Link>
      ))}
    </div>
  );
}
function ConnectionsSection({ id }: { id: string }) {
  const science = getConnectionsByDomain(id).science;
  if (!science.length) return null;
  return (
    <Section id="graph" title="Knowledge connections">
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {science.slice(0, 24).map((c) => (
          <li key={c.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
            <span className="text-faint">{c.outgoing ? RELATION_LABELS[c.relation.type] : INVERSE_RELATION_LABELS[c.relation.type]}</span>
            <Link href={entityGraphPath(c.other)} className="text-right font-medium text-fg hover:text-nasa">{c.other.name}</Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
