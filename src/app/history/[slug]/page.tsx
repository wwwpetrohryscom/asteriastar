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
import { engine } from "@/platform/data-engine";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath, getConnectionsByDomain } from "@/knowledge-graph";
import { formatHistYear } from "@/knowledge-graph/data/history-catalog/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, historyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.history.allSlugs().map((slug) => ({ slug }));
}

type D = NonNullable<ReturnType<typeof engine.history.resolve>>;

function titleOf(d: D): string {
  return d.record.name;
}
function kindLabel(d: D): string {
  switch (d.kind) {
    case "astronomer": return "Astronomer";
    case "discovery": return "Discovery";
    case "publication": return "Publication";
    case "theory": return "Theory";
    case "catalogue": return "Catalogue";
    case "era": return d.record.kind === "tradition" ? "Astronomical tradition" : "Era";
    case "event": return "Historical event";
    case "award": return "Award";
  }
}
function descOf(d: D): string {
  if (d.kind === "astronomer") return d.record.bio;
  return d.record.description;
}

export async function generateMetadata({ params }: PageProps<"/history/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.history.resolve(slug);
  if (!d) return {};
  return buildMetadata({ title: titleOf(d), description: descOf(d).slice(0, 200), path: historyPath(slug) });
}

export default async function HistoryEntityPage({ params }: PageProps<"/history/[slug]">) {
  const { slug } = await params;
  const d = engine.history.resolve(slug);
  if (!d) notFound();

  const title = titleOf(d);
  const url = historyPath(slug);
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "History of Astronomy", url: ROUTES.history }, { name: title, url }];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": d.kind === "astronomer" ? "Person" : d.kind === "publication" ? "Book" : "CreativeWork",
    name: title, description: descOf(d).slice(0, 300), url: absoluteUrl(url),
  };
  const eyebrow = eyebrowText(d);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>{eyebrow}</span>} title={title}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">History of Astronomy</Badge>
          {d.kind === "astronomer" && d.era && <Link href={d.era.href} className="text-sm text-faint hover:text-nebula">{d.era.name}</Link>}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {d.kind === "astronomer" && <AstronomerBody d={d} />}
            {d.kind === "discovery" && <DiscoveryBody d={d} />}
            {d.kind === "publication" && <PublicationBody d={d} />}
            {d.kind === "theory" && <TheoryBody d={d} />}
            {d.kind === "catalogue" && <CatalogueBody d={d} />}
            {d.kind === "era" && <EraBody d={d} />}
            {d.kind === "event" && <EventBody d={d} />}
            {d.kind === "award" && <AwardBody d={d} />}
            <ConnectionsSection id={connId(d, slug)} />
            <SourceList keys={d.record.sources} title="Sources & references" />
          </div>
          <aside className="space-y-6">
            <QuickFacts d={d} />
            <QualityCard d={d} />
          </aside>
        </div>
      </Container>
    </>
  );
}

function connId(d: D, slug: string): string {
  switch (d.kind) {
    case "astronomer": return `astronomer:${slug}`;
    case "discovery": return `historical_discovery:${slug}`;
    case "publication": return `publication:${slug}`;
    case "theory": return `astronomical_theory:${slug}`;
    case "catalogue": return `catalog:${slug}`;
    case "era": return `astronomy_era:${slug}`;
    case "event": return `historical_event:${slug}`;
    case "award": return `scientific_award:${slug}`;
  }
}

function eyebrowText(d: D): string {
  const label = kindLabel(d);
  if (d.kind === "astronomer") return d.lifespan ? `${label} · ${d.lifespan}` : d.record.nationality ? `${label} · ${d.record.nationality}` : label;
  if (d.kind === "discovery" && d.yearLabel) return `${label} · ${d.yearLabel}`;
  if (d.kind === "publication" && d.yearLabel) return `${label} · ${d.yearLabel}`;
  if (d.kind === "theory" && d.yearLabel) return `${label} · proposed ${d.yearLabel}`;
  if (d.kind === "catalogue" && d.yearLabel) return `${label} · ${d.yearLabel}`;
  if (d.kind === "event" && d.yearLabel) return `${label} · ${d.yearLabel}`;
  if (d.kind === "era") { const r = eraRange(d.record.startYear, d.record.endYear); return r ? `${label} · ${r}` : label; }
  return label;
}

function eraRange(start?: number, end?: number): string | undefined {
  const s = formatHistYear(start); const e = end != null ? formatHistYear(end) : "present";
  return s ? `${s} – ${e}` : undefined;
}

/* ------------------------------------------------------------------- bodies */

function AstronomerBody({ d }: { d: Extract<D, { kind: "astronomer" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="biography" title="Biography"><p className="leading-relaxed text-muted">{r.bio}</p></Section>
      {r.contributions?.length ? (
        <Section id="contributions" title="Scientific contributions">
          <ul className="space-y-2">{r.contributions.map((c) => <li key={c} className="flex gap-2 text-muted"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nebula/70" />{c}</li>)}</ul>
        </Section>
      ) : null}
      {d.discoveries.length ? <Section id="discoveries" title="Major discoveries"><ItemList items={d.discoveries.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
      {d.publications.length ? <Section id="publications" title="Major publications"><ItemList items={d.publications.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
      {d.theories.length ? <Section id="theories" title="Theories developed"><ItemList items={d.theories.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
      {d.catalogues.length ? <Section id="catalogues" title="Catalogues"><ItemList items={d.catalogues.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
      {(d.studentOf.length || d.collaborators.length || d.influenced.length) ? (
        <Section id="people" title="Related scientists">
          <RefGrid refs={[...d.studentOf.map((x) => ({ ...x, tag: "Teacher" })), ...d.collaborators.map((x) => ({ ...x, tag: "Collaborator" })), ...d.influenced.map((x) => ({ ...x, tag: "Influenced" }))]} />
        </Section>
      ) : null}
      {(d.workedAt.length || d.observed.length) ? (
        <Section id="places" title="Observatories, instruments & objects">
          <RefGrid refs={[...d.workedAt.map((x) => ({ ...x, tag: "Worked at" })), ...d.observed.map((x) => ({ ...x, tag: "Observed" }))]} />
        </Section>
      ) : null}
      {d.awards.length ? (
        <Section id="awards" title="Awards">
          <ItemList items={d.awards.map((a) => ({ name: a.name, meta: a.year ? String(a.year) : undefined, href: a.href }))} />
        </Section>
      ) : null}
    </>
  );
}

function DiscoveryBody({ d }: { d: Extract<D, { kind: "discovery" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="overview" title="Overview"><p className="leading-relaxed text-muted">{r.description}</p></Section>
      {r.significance ? <Section id="significance" title="Why it matters"><p className="leading-relaxed text-muted">{r.significance}</p></Section> : null}
      {(d.by.length || d.predictedBy.length || d.firstObservedBy.length) ? (
        <Section id="credit" title="Credit">
          <RefGrid refs={[...d.by.map((x) => ({ ...x, tag: "Discovered by" })), ...d.predictedBy.map((x) => ({ ...x, tag: "Predicted by" })), ...d.firstObservedBy.map((x) => ({ ...x, tag: "First observed by" }))]} />
        </Section>
      ) : null}
      {(d.related.length || d.facilities.length) ? (
        <Section id="connections" title="Objects & facilities">
          <RefGrid refs={[...d.related.map((x) => ({ ...x, tag: "Concerns" })), ...d.facilities.map((x) => ({ ...x, tag: "Observed at" }))]} />
        </Section>
      ) : null}
      {(d.confirms || d.refutes) ? (
        <Section id="theory" title="Bearing on theory">
          <RefGrid refs={[...(d.confirms ? [{ ...d.confirms, tag: "Confirmed" }] : []), ...(d.refutes ? [{ ...d.refutes, tag: "Refuted" }] : [])]} />
        </Section>
      ) : null}
      {d.publications.length ? <Section id="publications" title="Reported in"><ItemList items={d.publications.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
    </>
  );
}

function PublicationBody({ d }: { d: Extract<D, { kind: "publication" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="overview" title="About the work"><p className="leading-relaxed text-muted">{r.description}</p></Section>
      {d.authors.length ? <Section id="authors" title="Author"><RefGrid refs={d.authors.map((x) => ({ ...x, tag: "By" }))} /></Section> : null}
      {d.introduces.length ? <Section id="introduces" title="Introduced"><RefGrid refs={d.introduces.map((x) => ({ ...x, tag: "Presents" }))} /></Section> : null}
    </>
  );
}

function TheoryBody({ d }: { d: Extract<D, { kind: "theory" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="overview" title="The theory"><p className="leading-relaxed text-muted">{r.description}</p></Section>
      {d.by.length ? <Section id="by" title="Developed by"><RefGrid refs={d.by.map((x) => ({ ...x, tag: "By" }))} /></Section> : null}
      {r.attributedTo && !d.by.length ? <Section id="attributed" title="Originated by"><p className="text-muted">{r.attributedTo}</p></Section> : null}
      {d.confirmedBy.length ? <Section id="confirmed" title="Confirmed by"><ItemList items={d.confirmedBy.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
      {d.refutedBy.length ? <Section id="refuted" title="Refuted by"><ItemList items={d.refutedBy.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
      {d.publications.length ? <Section id="publications" title="Presented in"><ItemList items={d.publications.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
    </>
  );
}

function CatalogueBody({ d }: { d: Extract<D, { kind: "catalogue" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="overview" title="About the catalogue"><p className="leading-relaxed text-muted">{r.description}</p></Section>
      {d.by.length ? <Section id="by" title="Compiled by"><RefGrid refs={d.by.map((x) => ({ ...x, tag: "By" }))} /></Section> : null}
      {d.mission ? <Section id="mission" title="Behind the catalogue"><RefGrid refs={[{ ...d.mission, tag: "Produced by" }]} /></Section> : null}
    </>
  );
}

function EraBody({ d }: { d: Extract<D, { kind: "era" }> }) {
  const r = d.record;
  const m = d.members;
  return (
    <>
      <Section id="overview" title="Overview"><p className="leading-relaxed text-muted">{r.description}</p></Section>
      {d.subEras.length ? <Section id="traditions" title="Traditions"><RefGrid refs={d.subEras.map((x) => ({ ...x, tag: "Tradition" }))} /></Section> : null}
      {m.astronomers.length ? <Section id="astronomers" title="Astronomers"><ItemList items={m.astronomers.slice().sort((a, b) => (a.birthYear ?? 9e9) - (b.birthYear ?? 9e9)).map((x) => ({ name: x.name, meta: x.nationality, href: historyPath(x.slug) }))} /></Section> : null}
      {m.discoveries.length ? <Section id="discoveries" title="Discoveries"><ItemList items={m.discoveries.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
      {m.publications.length ? <Section id="publications" title="Publications"><ItemList items={m.publications.map((x) => ({ name: x.name, meta: formatHistYear(x.year, x.yearApprox), href: historyPath(x.slug) }))} /></Section> : null}
    </>
  );
}

function EventBody({ d }: { d: Extract<D, { kind: "event" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="overview" title="What happened"><p className="leading-relaxed text-muted">{r.description}</p></Section>
      {(d.related.length || d.people.length) ? <Section id="connections" title="Connections"><RefGrid refs={[...d.people.map((x) => ({ ...x, tag: "Involved" })), ...d.related.map((x) => ({ ...x, tag: "Related" }))]} /></Section> : null}
    </>
  );
}

function AwardBody({ d }: { d: Extract<D, { kind: "award" }> }) {
  const r = d.record;
  return (
    <>
      <Section id="overview" title="About the award"><p className="leading-relaxed text-muted">{r.description}</p></Section>
      {d.recipients.length ? <Section id="recipients" title="Recipients in this encyclopedia"><ItemList items={d.recipients.map((x) => ({ name: x.record.name, meta: x.year ? String(x.year) : undefined, href: historyPath(x.record.slug) }))} /></Section> : null}
    </>
  );
}

/* ------------------------------------------------------------- quick facts */

type Row = { label: string; value: string; href?: string };

function QuickFacts({ d }: { d: D }) {
  const facts: Row[] = [];
  const push = (label: string, value?: string | number | null, href?: string) => { if (value != null && value !== "") facts.push({ label, value: String(value), href }); };
  if (d.kind === "astronomer") {
    const r = d.record;
    push("Lifespan", d.lifespan); push("Nationality", r.nationality);
    push("Era", d.era?.name, d.era?.href); push("Fields", r.fields?.join(", "));
    push("Institutions", r.institutions?.join("; "));
    push("Discoveries", d.discoveries.length || undefined); push("Publications", d.publications.length || undefined);
    push("Awards", d.awards.map((a) => a.year ? `${a.name} (${a.year})` : a.name).join("; ") || undefined);
  } else if (d.kind === "discovery") {
    push("Year", d.yearLabel); push("Era", d.era?.name, d.era?.href);
    push("Credited to", [...d.by, ...d.predictedBy, ...d.firstObservedBy].map((x) => x.name).join(", ") || undefined);
  } else if (d.kind === "publication") {
    push("Year", d.yearLabel); push("Author", d.authors.map((a) => a.name).join(", ") || undefined);
    push("Language", d.record.language); push("Era", d.era?.name, d.era?.href);
  } else if (d.kind === "theory") {
    push("Proposed", d.yearLabel); push("By", d.by.map((a) => a.name).join(", ") || d.record.attributedTo);
    push("Status", d.record.status); push("Era", d.era?.name, d.era?.href);
  } else if (d.kind === "catalogue") {
    push("Year", d.yearLabel); push("Compiled by", d.by.map((a) => a.name).join(", ") || undefined);
    push("Objects", d.record.count); push("Era", d.era?.name, d.era?.href);
  } else if (d.kind === "era") {
    push("Type", d.record.kind === "tradition" ? "Astronomical tradition" : "Historical period");
    push("Period", eraRange(d.record.startYear, d.record.endYear)); push("Region", d.record.region);
    push("Astronomers", d.members.astronomers.length || undefined);
  } else if (d.kind === "event") {
    push("Year", d.yearLabel); push("Era", d.era?.name, d.era?.href);
  } else if (d.kind === "award") {
    push("Recipients here", d.recipients.length || undefined);
  }
  if (!facts.length) return null;
  return (
    <section aria-labelledby="quick" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
      <dl className="mt-3 divide-y divide-white/5">
        {facts.map((f) => (
          <div key={f.label} className="flex justify-between gap-3 py-2 text-sm">
            <dt className="text-faint">{f.label}</dt>
            <dd className="text-right font-medium text-fg">{f.href ? <Link href={f.href} className="hover:text-nebula">{f.value}</Link> : f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function QualityCard({ d }: { d: D }) {
  if (!("quality" in d) || !d.quality) return null;
  const q = d.quality;
  const reviewStatus = "reviewStatus" in d ? d.reviewStatus : undefined;
  return (
    <section aria-labelledby="quality" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="quality" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quality &amp; authority</h2>
        <span className="text-xs text-faint">{q.completenessPercent}%</span>
      </div>
      {reviewStatus && <div className="mt-3"><ReviewBadge status={reviewStatus} /></div>}
      <dl className="mt-3 grid grid-cols-1 gap-y-1.5">
        {(Object.keys(q.indicators) as QualityDimension[]).slice(0, 6).map((dim) => (
          <div key={dim} className="flex items-center justify-between gap-2 text-sm">
            <dt className="text-muted">{QUALITY_DIMENSION_LABELS[dim]}</dt>
            <dd><CoverageBadge level={q.indicators[dim]} /></dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-faint">Curated from authoritative reference sources. See <Link href="/transparency/source-quality" className="text-nebula hover:underline">source quality</Link>.</p>
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

function ItemList({ items }: { items: { name: string; meta?: string; href: string }[] }) {
  return (
    <ul className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      {items.map((it) => (
        <li key={it.href + it.name}>
          <Link href={it.href} className="flex items-baseline justify-between gap-3 px-4 py-2.5 transition hover:bg-white/[0.03]">
            <span className="font-medium text-fg">{it.name}</span>
            {it.meta && <span className="shrink-0 text-sm text-faint">{it.meta}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function RefGrid({ refs }: { refs: { id: string; name: string; href: string; tag?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {refs.map((r) => (
        <Link key={r.tag + r.id} href={r.href} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/25">
          {r.tag && <div className="text-xs text-faint">{r.tag}</div>}
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
            <Link href={entityGraphPath(c.other)} className="text-right font-medium text-fg hover:text-nebula">{c.other.name}</Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
