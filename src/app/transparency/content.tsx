import {
  EVIDENCE_LEVELS,
  EVIDENCE_LABELS,
  EVIDENCE_DESCRIPTIONS,
  SCIENCE_EVIDENCE_LEVELS,
  REVIEW_STATUSES,
  REVIEW_STATUS_LABELS,
  EDITORIAL_STATUSES,
  EDITORIAL_STATUS_LABELS,
  EDITORIAL_STATUS_DESCRIPTIONS,
  OBJECT_KINDS,
  computeAuthoritySnapshot,
} from "@/platform";
import { getAllSources, AUTHORITY_TYPE_LABELS } from "@/lib/sources";
import { CITATION_STYLES } from "@/lib/citations";

/** Transparency pages — each explains how the platform works, with live data. */

export type TransparencyWidget =
  | "evidence"
  | "sources"
  | "review"
  | "editorial"
  | "version"
  | "provenance"
  | "citation"
  | "authority";

export interface TransparencyPage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: { heading: string; body: string[]; list?: string[] }[];
  widget?: TransparencyWidget;
}

export const TRANSPARENCY_PAGES: TransparencyPage[] = [
  {
    slug: "scientific-methodology",
    title: "Scientific Methodology",
    description: "How Asteria Star sources, structures, and reviews scientific knowledge.",
    intro: "Science first. Evidence before opinion. Every scientific fact is tied to the knowledge graph and traceable to authoritative sources.",
    sections: [
      { heading: "Single source of truth", body: ["The knowledge graph is the canonical model. Pages are views over entities and typed relations; nothing is asserted outside it."] },
      { heading: "Evidence, not assertion", body: ["Every scientific statement is designed to carry an evidence level and source references. We never fabricate certainty — unknown stays unknown, disputed stays disputed."] },
      { heading: "Separation of domains", body: ["Astronomy is presented as evidence-based science. Astrology and mythology are presented as cultural tradition and are never classified as scientific evidence."] },
    ],
    widget: "authority",
  },
  {
    slug: "editorial-standards",
    title: "Editorial Standards",
    description: "The editorial lifecycle and the science/tradition boundary.",
    intro: "Editorial quality is part of scientific authority. Content moves through a defined lifecycle and respects a strict domain boundary.",
    sections: [
      { heading: "The boundary", body: ["Scientific and interpretive content are typed separately at every level — entity domain, relation domain, and evidence level. Interpretive content always carries its disclaimer."] },
      { heading: "Editorial lifecycle", body: ["Every page has an editorial status. The workflow itself is architecture only — there is no authoring backend yet."] },
    ],
    widget: "editorial",
  },
  {
    slug: "evidence-framework",
    title: "Evidence Framework",
    description: "The standardized evidence levels and how they map to domains.",
    intro: "A shared vocabulary for how strongly a statement is supported. Scientific domains use the scientific levels; interpretive traditions are always 'Interpretive'.",
    sections: [
      { heading: "Why levels", body: ["Evidence levels make the strength of a claim explicit and machine-readable, so readers and systems can weigh statements honestly."] },
      { heading: "Domain rules", body: [`Scientific domains may use: ${SCIENCE_EVIDENCE_LEVELS.map((l) => EVIDENCE_LABELS[l]).join(", ")}. Astrology and mythology must always use: Interpretive. Validation rejects any interpretive claim marked as scientific.`] },
    ],
    widget: "evidence",
  },
  {
    slug: "review-process",
    title: "Review Process",
    description: "How entities are reviewed for scientific and editorial accuracy.",
    intro: "Each entity can carry a review record: status, reviewer, date, version, and separate scientific and editorial accuracy. Architecture only — no fabricated review history.",
    sections: [
      { heading: "Honest defaults", body: ["An entity with no review record is shown as 'Unreviewed'. We do not invent reviewers or dates to look more authoritative than we are."] },
      { heading: "Verification levels", body: ["Verification ranges from none, to basic, to sourced, to peer-aligned — describing how thoroughly a claim has been checked against the literature."] },
    ],
    widget: "review",
  },
  {
    slug: "source-quality",
    title: "Source Quality",
    description: "The authoritative source registry and how sources are weighted.",
    intro: "Every factual page draws from a curated registry of primary agencies, observatories, databases, and reference works — each with a country, authority type, and reliability note.",
    sections: [
      { heading: "Primary vs secondary", body: ["Space agencies, observatories, scientific unions, databases, and peer-reviewed literature are treated as primary authority. Reference works and media repositories are secondary context."] },
      { heading: "No scraping", body: ["We reference and link to sources; we do not scrape them, and we do not publish unverified claims."] },
    ],
    widget: "sources",
  },
  {
    slug: "version-policy",
    title: "Version Policy",
    description: "How entities, datasets, articles, and other objects are versioned.",
    intro: "Long-term compatibility is a first-class concern. Objects carry version history; stable identifiers never change.",
    sections: [
      { heading: "Stable identifiers", body: ["Entity identifiers (type:slug) are permanent and never recycled, so external references stay valid as content evolves."] },
      { heading: "Object versioning", body: ["Entities, relationships, datasets, articles, learning paths, timeline entries, and images each support a version record with change history. Architecture only — no per-object history is persisted yet."] },
    ],
    widget: "version",
  },
  {
    slug: "data-provenance",
    title: "Data Provenance",
    description: "The typed model behind every scientific fact.",
    intro: "Provenance answers 'where does this come from?'. Each scientific statement can carry its evidence, primary and secondary sources, review, and full change history.",
    sections: [
      { heading: "Typed, never hardcoded", body: ["Provenance is a typed record linked to an entity (and optionally a relationship). The registry ships empty — records are added only when backed by real, verified sources."] },
      { heading: "Integrity", body: ["Validation rejects duplicate provenance ids, missing evidence levels, scientific facts without a source placeholder, interpretive facts marked scientific, and broken citation, version, or provenance references."] },
    ],
    widget: "provenance",
  },
  {
    slug: "scientific-scope",
    title: "Scientific Scope",
    description: "What counts as science on this platform.",
    intro: "Astronomy, space exploration, the physical night sky, and the history of astronomy are presented as evidence-based science.",
    sections: [
      { heading: "In scope", body: ["Stars, planets, moons, galaxies, nebulae, missions, telescopes, observatories, astronomers, and the events and instruments of observational astronomy."] },
      { heading: "How we treat it", body: ["Scientific claims are sourced and evidence-rated. Where the science is uncertain or disputed, we say so rather than fabricating certainty."] },
    ],
  },
  {
    slug: "interpretive-scope",
    title: "Interpretive Scope",
    description: "How astrology and mythology are presented — and kept separate.",
    intro: "Astrology and mythology are part of humanity's relationship with the sky. We present them as cultural and symbolic tradition, clearly and respectfully — never as science.",
    sections: [
      { heading: "Always interpretive", body: ["Interpretive content carries the 'Interpretive' evidence level and its disclaimer. It is typed in a separate domain and can never be classified as scientific evidence."] },
      { heading: "Why include it", body: ["The cultural history of the sky is real and worth documenting. Keeping it clearly separate from science is what makes including it honest."] },
    ],
  },
  {
    slug: "transparency-report",
    title: "Transparency Report",
    description: "A live, honest snapshot of the platform's coverage and gaps.",
    intro: "Authority is earned by being transparent about what we have — and what we don't. These numbers are computed from real registry data.",
    sections: [
      { heading: "Honest gaps", body: ["Review, image, and localization coverage are currently low: those registries are architecture-ready and ship empty. We would rather show the gap than fake the coverage."] },
    ],
    widget: "authority",
  },
];

const BY_SLUG = new Map(TRANSPARENCY_PAGES.map((p) => [p.slug, p]));
export function getTransparencyPage(slug: string): TransparencyPage | undefined {
  return BY_SLUG.get(slug);
}

/* ------------------------------------------------------------------ widgets */

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.03] text-faint">
          <tr>{head.map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r, i) => (
            <tr key={i} className="transition hover:bg-white/[0.02]">
              {r.map((c, j) => <td key={j} className="px-4 py-2.5 text-muted">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TransparencyWidgetView({ widget }: { widget: TransparencyWidget }) {
  switch (widget) {
    case "evidence":
      return (
        <Table
          head={["Level", "Meaning"]}
          rows={EVIDENCE_LEVELS.map((l) => [<span key="l" className="font-medium text-fg">{EVIDENCE_LABELS[l]}</span>, EVIDENCE_DESCRIPTIONS[l]])}
        />
      );
    case "review":
      return (
        <Table head={["Status", "Use"]} rows={REVIEW_STATUSES.map((s) => [<span key="s" className="font-medium text-fg">{REVIEW_STATUS_LABELS[s]}</span>, s === "unreviewed" ? "Default for every entity until reviewed." : "Set when a review record exists."])} />
      );
    case "editorial":
      return (
        <Table head={["Status", "Meaning"]} rows={EDITORIAL_STATUSES.map((s) => [<span key="s" className="font-medium text-fg">{EDITORIAL_STATUS_LABELS[s]}</span>, EDITORIAL_STATUS_DESCRIPTIONS[s]])} />
      );
    case "sources":
      return (
        <Table
          head={["Source", "Country", "Authority"]}
          rows={getAllSources().map((s) => [
            <a key="a" href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-fg hover:text-nasa">{s.name}</a>,
            s.country,
            AUTHORITY_TYPE_LABELS[s.authorityType],
          ])}
        />
      );
    case "version":
      return (
        <Table head={["Object kind", "Versioned"]} rows={OBJECT_KINDS.map((k) => [<span key="k" className="font-medium capitalize text-fg">{k.replace(/-/g, " ")}</span>, "Version record + change history"])} />
      );
    case "citation":
      return (
        <Table head={["Style", "Supported"]} rows={CITATION_STYLES.map((c) => [<span key="c" className="font-medium text-fg">{c.name}</span>, "Generated from structured metadata"])} />
      );
    case "provenance":
      return (
        <Table
          head={["Field", "Purpose"]}
          rows={[
            ["Statement", "The scientific claim being substantiated"],
            ["Evidence level", "How strongly it is supported"],
            ["Primary / secondary sources", "Where it comes from"],
            ["Review date / reviewer", "Who checked it and when"],
            ["Version / change history", "How it has evolved"],
          ].map((r) => [<span key="f" className="font-medium text-fg">{r[0]}</span>, r[1]])}
        />
      );
    case "authority": {
      const s = computeAuthoritySnapshot();
      const stats = [
        { label: "Entities", value: s.entities },
        { label: "Relationships", value: s.relationships },
        { label: "Sources", value: s.sourcesTotal },
        { label: "Reviewed", value: s.reviewed },
        { label: "Awaiting review", value: s.awaitingReview },
        { label: "With sources", value: s.coverage.withSources },
      ];
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map((m) => (
            <div key={m.label} className="scientific-card p-4">
              <div className="font-display text-2xl font-bold text-fg">{m.value.toLocaleString()}</div>
              <div className="mt-1 text-xs text-faint">{m.label}</div>
            </div>
          ))}
        </div>
      );
    }
  }
}
