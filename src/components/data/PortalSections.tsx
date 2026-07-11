import Link from "next/link";
import { StatusBadge } from "@/components/data/StatusBadge";
import { DatasetCard } from "@/components/data/DatasetCard";
import {
  CATALOGUE,
  CATALOGUE_STATS,
  EXPORT_MANIFEST,
  ALL_LICENSES,
  CHANGELOG,
  VERSIONING_POLICY,
  API_ATTRIBUTION,
  API_SOURCE,
  DATA_GENERATED_AT,
} from "@/platform/open-data";
import {
  GRAPH_STATS,
  getEntityTypeCounts,
  getGraphEntitiesByType,
  ENTITY_TYPES,
  RELATION_TYPES,
  CONFIDENCES,
} from "@/knowledge-graph";
import { SOURCES } from "@/lib/sources";
import { CITATIONS } from "@/lib/citations";
import { EVIDENCE_LEVELS, EVIDENCE_LABELS, EVIDENCE_DESCRIPTIONS } from "@/platform/authority/evidence";

/* --------------------------------------------------------------- helpers */
function bytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MiB`;
}
const card = "scientific-card p-5";
const mono = "rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-xs text-faint";

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="max-w-2xl text-sm leading-relaxed text-muted">{children}</p>;
}
function ApiLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-nasa underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

/* --------------------------------------------------------------- datasets */
function Datasets() {
  const meta = CATALOGUE.filter((c) => ["knowledge-graph-entities", "knowledge-graph-relationships", "source-registry", "scientific-images", "live-sky-providers", "citation-registry", "evidence-framework"].includes(c.id));
  const domain = CATALOGUE.filter((c) => !meta.includes(c));
  return (
    <div className="min-w-0 space-y-10">
      <Prose>
        The unified catalogue: {CATALOGUE_STATS.total} datasets in total — {CATALOGUE_STATS.stable} stable,
        {" "}{CATALOGUE_STATS.prepared} prepared, {CATALOGUE_STATS.planned} planned, and {CATALOGUE_STATS.architecture} methodology.
        Every record count is computed from the engine; {CATALOGUE_STATS.withDownload} datasets carry a real, checksummed download.
        Full list also available at <ApiLink href="/api/v0/datasets">/api/v0/datasets</ApiLink>.
      </Prose>
      <section>
        <h2 className="font-display text-xl font-bold">Graph-level datasets</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {meta.map((e) => <DatasetCard key={e.id} entry={e} />)}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Domain datasets</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {domain.map((e) => <DatasetCard key={e.id} entry={e} />)}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------- entities */
function Entities() {
  const counts = getEntityTypeCounts().slice().sort((a, b) => b.count - a.count);
  return (
    <div className="space-y-8">
      <Prose>
        Every entity has a permanent <span className="font-mono text-fg">type:slug</span> identifier and belongs to exactly
        one type and domain. Read them via <ApiLink href="/api/v0/entities">/api/v0/entities</ApiLink>,{" "}
        <ApiLink href="/api/v0/entities/planet:mars">/api/v0/entities/&#123;id&#125;</ApiLink>, the{" "}
        <ApiLink href="/exports/entities-index.json">entities index export</ApiLink>, or the human{" "}
        <ApiLink href="/entity-index">entity index</ApiLink>.
      </Prose>
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(GRAPH_STATS.entitiesByDomain).map(([domain, n]) => (
          <div key={domain} className={card}>
            <p className="text-xs uppercase tracking-wider text-faint">{domain}</p>
            <p className="mt-1 font-display text-2xl font-bold text-fg">{n.toLocaleString()}</p>
            <p className="text-xs text-faint">entities</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="font-display text-xl font-bold">Entity types</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-faint">
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Count</th>
                <th className="pb-2 font-medium">Example id</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {counts.map(({ type, count }) => (
                <tr key={type}>
                  <td className="py-1.5 pr-4 font-mono text-xs text-fg">{type}</td>
                  <td className="py-1.5 pr-4 text-muted">{count.toLocaleString()}</td>
                  <td className="py-1.5 font-mono text-xs text-faint">{getGraphEntitiesByType(type)[0]?.id ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------- relationships */
function Relationships() {
  const CONF_MEANING: Record<string, string> = {
    confirmed: "Established by current peer-reviewed science or historical record.",
    likely: "Well-supported, but with some remaining uncertainty.",
    interpretive: "A cultural or symbolic association — never a scientific claim.",
  };
  return (
    <div className="space-y-8">
      <Prose>
        Relationships are typed and tagged with a domain and a confidence level. Interpretive links (culture, astrology) are
        never presented as confirmed science. Read them via{" "}
        <ApiLink href="/api/v0/relationships">/api/v0/relationships</ApiLink> (filter by <span className="font-mono">from</span>,{" "}
        <span className="font-mono">to</span>, <span className="font-mono">type</span>, <span className="font-mono">domain</span>),
        traverse with <ApiLink href="/api/v0/traversal?start=star:sirius">/api/v0/traversal</ApiLink>, or download the{" "}
        <ApiLink href="/exports/relationships-index.json">relationships index</ApiLink>.
      </Prose>
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(GRAPH_STATS.relationsByDomain).map(([domain, n]) => (
          <div key={domain} className={card}>
            <p className="text-xs uppercase tracking-wider text-faint">{domain}</p>
            <p className="mt-1 font-display text-2xl font-bold text-fg">{n.toLocaleString()}</p>
            <p className="text-xs text-faint">relationships</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="font-display text-xl font-bold">Confidence levels</h2>
        <div className="mt-4 space-y-2">
          {CONFIDENCES.map((c) => (
            <div key={c} className={card}>
              <span className="font-mono text-sm text-fg">{c}</span>
              <span className="ml-3 text-sm text-muted">{CONF_MEANING[c]}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Relationship types ({RELATION_TYPES.length})</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {RELATION_TYPES.map((t) => (
            <span key={t} className={mono}>{t}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------- schemas & ids */
function Schemas() {
  const RULES = [
    "Every entity has a permanent identifier of the form type:slug (e.g. star:sirius).",
    "Identifiers are never recycled — a retired id is never reassigned to a different entity.",
    "Identifiers are never renamed after publication — the slug is stable even if the display name changes.",
    "Deprecated identifiers are redirected or aliased to their replacement, never silently dropped.",
    "Aliases are alternate labels for search and lookup; an alias never becomes a new canonical id.",
  ];
  return (
    <div className="space-y-8">
      <Prose>
        The schema gives the graph long-term, machine-readable compatibility. Types and identifiers are stable; breaking
        changes bump the schema version. The full registry of types lives at <ApiLink href="/registry">/registry</ApiLink>.
      </Prose>
      <section>
        <h2 className="font-display text-xl font-bold">Versions</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody className="divide-y divide-white/5">
              {VERSIONING_POLICY.map((v) => (
                <tr key={v.name}>
                  <td className="py-2 pr-4 font-medium text-fg">{v.name}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-nasa">{v.current}</td>
                  <td className="py-2 text-xs text-muted">{v.bumps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Stable-identifier guide</h2>
        <ul className="mt-4 space-y-2">
          {RULES.map((r) => (
            <li key={r} className="flex gap-2 text-sm text-muted">
              <span aria-hidden className="mt-1 text-success-strong">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ENTITY_TYPES.map((t) => {
            const ex = getGraphEntitiesByType(t)[0]?.id;
            if (!ex) return null;
            return <div key={t} className={mono}>{ex}</div>;
          })}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Entity &amp; relationship shape</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className={card}>
            <p className="font-medium text-fg">Entity</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-faint">id · type · name · domain · path · description? · aliases? · scientificName? · catalogNumbers? · sources?</p>
          </div>
          <div className={card}>
            <p className="font-medium text-fg">Relationship</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-faint">id · from · type · to · confidence · domain · note? · sources?</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- exports */
function Exports() {
  const rows = Object.entries(EXPORT_MANIFEST.exports);
  return (
    <div className="space-y-6">
      <Prose>
        These are the only pre-generated downloads: small, truthful files derived from the graph, serialized deterministically.
        Each SHA-256 is computed from the exact bytes of the file — verify with{" "}
        <span className="font-mono text-fg">shasum -a 256 &lt;file&gt;</span>. Regenerate locally with{" "}
        <span className="font-mono text-fg">npm run exports:generate</span>. Generated {DATA_GENERATED_AT}.
      </Prose>
      <div className="space-y-3">
        {rows.map(([id, m]) => (
          <div key={id} className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <a href={m.file} className="font-mono text-sm text-nasa underline-offset-4 hover:underline">{m.file}</a>
              <div className="flex items-center gap-3 text-xs text-faint">
                <span>{m.recordCount.toLocaleString()} records</span>
                <span>{bytes(m.bytes)}</span>
                <StatusBadge status="available" />
              </div>
            </div>
            <p className="mt-2 break-all font-mono text-[0.7rem] text-faint">sha256: {m.sha256}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-faint">
        Larger data is served through the <ApiLink href="/api/v0/entities">API</ApiLink> and the full{" "}
        <ApiLink href="/data/graph.json">graph.json</ApiLink> / <ApiLink href="/data/graph.jsonld">graph.jsonld</ApiLink> exports,
        not pre-generated here. No file is faked and no checksum is fabricated.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------- changelog */
function Changelog() {
  return (
    <div className="space-y-8">
      <Prose>
        Everything is at its initial public version. There is no invented version history; this is the first release, and no
        breaking changes have been made yet.
      </Prose>
      <section>
        <h2 className="font-display text-xl font-bold">Versioning policy</h2>
        <div className="mt-4 space-y-2">
          {VERSIONING_POLICY.map((v) => (
            <div key={v.name} className={card}>
              <span className="font-medium text-fg">{v.name}</span>
              <span className="ml-2 font-mono text-xs text-nasa">{v.current}</span>
              <p className="mt-1 text-sm text-muted">{v.bumps}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Releases</h2>
        <div className="mt-4 space-y-4">
          {CHANGELOG.map((e) => (
            <div key={`${e.area}-${e.version}`} className={card}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display font-semibold text-fg">{e.title}</span>
                <span className="font-mono text-xs text-faint">{e.area} {e.version} · {e.date}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {e.changes.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-muted"><span aria-hidden className="mt-1 text-faint">–</span><span>{c}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------- licensing */
function Licensing() {
  return (
    <div className="space-y-8">
      <Prose>
        Different sources carry different terms. Asteria&apos;s own compiled metadata — the graph structure, relationships,
        and editorial text — is <strong className="text-fg">CC BY-SA 4.0</strong>; upstream scientific data and imagery retain
        their own licenses. Licenses are never mixed silently: every dataset declares exactly one primary license
        (see <ApiLink href="/data/datasets">Datasets</ApiLink>).
      </Prose>
      <div className="grid gap-4 lg:grid-cols-2">
        {ALL_LICENSES.map((l) => (
          <div key={l.id} className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              {l.url ? (
                <a href={l.url} target="_blank" rel="noreferrer nofollow" className="font-medium text-fg underline-offset-4 hover:text-nasa hover:underline">{l.name}</a>
              ) : (
                <span className="font-medium text-fg">{l.name}</span>
              )}
              <span className="font-mono text-[0.65rem] text-faint">{l.id}</span>
            </div>
            <p className="mt-1.5 text-sm text-muted">{l.summary}</p>
            <p className="mt-2 text-xs text-faint">
              {l.attributionRequired ? "Attribution required" : "Attribution not required"} ·{" "}
              {l.shareAlike ? "Share-alike" : "No share-alike"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ attribution */
function Attribution() {
  return (
    <div className="space-y-8">
      <Prose>Credit Asteria Star and, where a dataset draws on upstream sources, those sources too.</Prose>
      <section>
        <h2 className="font-display text-xl font-bold">Required attribution</h2>
        <div className={`mt-3 ${card}`}>
          <p className="font-mono text-xs leading-relaxed text-muted">{API_ATTRIBUTION}</p>
        </div>
        <p className="mt-2 text-xs text-faint">Every API response echoes this string in its <span className="font-mono">meta.attribution</span> field; <span className="font-mono">meta.source</span> is &ldquo;{API_SOURCE}&rdquo;.</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Source attribution</h2>
        <Prose>
          When you reuse data derived from a specific authority, credit that authority using its registry entry
          (<ApiLink href="/data/provenance">provenance</ApiLink> explains the flow). A few examples:
        </Prose>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {Object.values(SOURCES).slice(0, 6).map((s) => (
            <div key={s.key} className={card}>
              <span className="font-medium text-fg">{s.name}</span>
              <span className="ml-2 text-xs text-faint">{s.organization}</span>
              <p className="mt-1 text-xs text-muted">{s.scope}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------- provenance */
function Provenance() {
  const ENVELOPE = [
    ["apiVersion", "The API version (v0)."],
    ["schemaVersion", "Schema version the data conforms to."],
    ["dataVersion", "Graph data version."],
    ["generatedAt", "Fixed graph-release timestamp — deterministic, not per-request."],
    ["source", "The engine that produced the response."],
    ["license", "License for this response's data."],
    ["attribution", "How to credit the data."],
    ["provenance", "A note on how this specific response was derived."],
  ];
  const FLOW = ["Authoritative sources (NASA, ESA, IAU, …)", "Canonical knowledge graph (typed entities + relationships)", "Scientific Data Engine (resolve, relate, traverse, search)", "Public API & checksummed exports"];
  return (
    <div className="space-y-8">
      <Prose>
        Public data and APIs never bypass the engine. Data flows in one direction, and every response records where it came
        from.
      </Prose>
      <section>
        <h2 className="font-display text-xl font-bold">The path of a fact</h2>
        <ol className="mt-4 space-y-2">
          {FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs text-faint">{i + 1}</span>
              <span className="text-sm text-muted">{step}</span>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">The provenance envelope</h2>
        <Prose>Every API response wraps its data in a <span className="font-mono text-fg">meta</span> object:</Prose>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <tbody className="divide-y divide-white/5">
              {ENVELOPE.map(([k, d]) => (
                <tr key={k}>
                  <td className="py-2 pr-4 font-mono text-xs text-fg">{k}</td>
                  <td className="py-2 text-sm text-muted">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- quality */
function Quality() {
  const coverage = [
    { label: "Entities", value: GRAPH_STATS.entityCount.toLocaleString() },
    { label: "Relationships", value: GRAPH_STATS.relationCount.toLocaleString() },
    { label: "Authoritative sources", value: String(Object.keys(SOURCES).length) },
    { label: "Published citations", value: String(CITATIONS.length) },
  ];
  const LIMITS = [
    "Citation coverage is a framework: 0 citations are published in this phase, and the count is reported honestly rather than inflated.",
    "Live-sky data is not served — provider integrations are prepared, not connected.",
    "Quality indicators are deterministic completeness signals, not invented authority scores.",
  ];
  return (
    <div className="space-y-8">
      <Prose>
        Quality is shown as deterministic completeness signals and honest limitations — never as invented authority scores.
        Coverage and review methodology are detailed at <ApiLink href="/authority">/authority</ApiLink> and{" "}
        <ApiLink href="/transparency">/transparency</ApiLink>.
      </Prose>
      <div className="grid gap-4 sm:grid-cols-4">
        {coverage.map((c) => (
          <div key={c.label} className={card}>
            <p className="font-display text-2xl font-bold text-fg">{c.value}</p>
            <p className="text-xs text-faint">{c.label}</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="font-display text-xl font-bold">Evidence framework</h2>
        <Prose>Every scientific fact is classified by how well-supported it is; interpretive traditions are labelled as such.</Prose>
        <div className="mt-4 space-y-2">
          {EVIDENCE_LEVELS.map((lvl) => (
            <div key={lvl} className={card}>
              <span className="font-medium text-fg">{EVIDENCE_LABELS[lvl]}</span>
              <span className="ml-3 text-sm text-muted">{EVIDENCE_DESCRIPTIONS[lvl]}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Known limitations</h2>
        <ul className="mt-4 space-y-2">
          {LIMITS.map((l) => (
            <li key={l} className="flex gap-2 text-sm text-nasa/80"><span aria-hidden className="mt-1">!</span><span>{l}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const BODIES: Record<string, () => React.ReactElement> = {
  datasets: Datasets,
  entities: Entities,
  relationships: Relationships,
  schemas: Schemas,
  exports: Exports,
  changelog: Changelog,
  licensing: Licensing,
  attribution: Attribution,
  provenance: Provenance,
  quality: Quality,
};

export function PortalSectionBody({ slug }: { slug: string }) {
  const Body = BODIES[slug];
  return Body ? <Body /> : null;
}
