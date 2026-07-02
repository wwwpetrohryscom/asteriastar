import type { ContributionType } from "@/platform/contributions/schema";

/**
 * Contribution portal metadata — the static pages of /contribute and the
 * copyable proposal templates. Content-only, no fabricated activity. The
 * templates are examples to copy; they never submit anything.
 */

export type SectionKind = "guide" | "reference" | "dashboard";

export interface ContributeSection {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  kind: SectionKind;
}

/** The guide/reference pages of the portal. */
export const CONTRIBUTE_SECTIONS: ContributeSection[] = [
  { slug: "how-it-works", title: "How it works", eyebrow: "Overview", kind: "guide", description: "The review-first lifecycle every contribution follows, from proposal to a versioned graph update." },
  { slug: "guidelines", title: "Guidelines", eyebrow: "Standards", kind: "guide", description: "What makes a good, sourced, reviewable contribution — and what the review looks for." },
  { slug: "sources", title: "Contributing sources", eyebrow: "Track", kind: "guide", description: "Add or strengthen the authoritative sources and citations behind entities and relationships." },
  { slug: "images", title: "Contributing images", eyebrow: "Track", kind: "guide", description: "Submit verified scientific images and correct image metadata — provenance required." },
  { slug: "translations", title: "Contributing translations", eyebrow: "Track", kind: "guide", description: "Suggest localized titles and descriptions so the platform reads in more languages." },
  { slug: "scientific-review", title: "Scientific review", eyebrow: "Review", kind: "guide", description: "How domain experts verify accuracy and evidence before a factual change is accepted." },
  { slug: "editorial-review", title: "Editorial review", eyebrow: "Review", kind: "guide", description: "How editors check scope, clarity, policy, and route proposals to the right track." },
  { slug: "standards", title: "Standards", eyebrow: "Reference", kind: "reference", description: "Evidence levels, domain separation, licensing, and the quality dimensions contributions improve." },
  { slug: "templates", title: "Proposal templates", eyebrow: "Reference", kind: "reference", description: "Copyable, non-submitting templates for the most common kinds of contribution." },
  { slug: "roadmap", title: "Roadmap", eyebrow: "Reference", kind: "reference", description: "What exists today (architecture) and what a future review system will add." },
];

/** The architecture-preview dashboards (all honest empty states). */
export const DASHBOARD_PAGES: ContributeSection[] = [
  { slug: "review-dashboard", title: "Review dashboard", eyebrow: "Preview", kind: "dashboard", description: "How reviewers will see coverage, tracks, and open work. Empty today — no fabricated metrics." },
  { slug: "review-queue", title: "Review queue", eyebrow: "Preview", kind: "dashboard", description: "Where submitted proposals will await triage and review. Empty today — no fabricated tickets." },
  { slug: "change-log", title: "Change log", eyebrow: "Preview", kind: "dashboard", description: "The versioned record of accepted changes. Empty today — no fabricated approvals." },
  { slug: "audit-trail", title: "Audit trail", eyebrow: "Preview", kind: "dashboard", description: "The immutable, per-proposal history of every state change. Empty today — no fabricated history." },
];

export const ALL_CONTRIBUTE_SECTIONS: ContributeSection[] = [...CONTRIBUTE_SECTIONS, ...DASHBOARD_PAGES];
export const CONTRIBUTE_SLUGS = ALL_CONTRIBUTE_SECTIONS.map((s) => s.slug);

export function getContributeSection(slug: string): ContributeSection | undefined {
  return ALL_CONTRIBUTE_SECTIONS.find((s) => s.slug === slug);
}

/* ------------------------------------------------------ copyable templates */
export interface ProposalTemplate {
  id: string;
  title: string;
  type: ContributionType;
  summary: string;
  /** A copyable proposal skeleton (placeholders, never real data). */
  body: string;
}

export const CONTRIBUTE_TEMPLATES: ProposalTemplate[] = [
  {
    id: "entity-correction",
    title: "Entity Correction",
    type: "entity_correction",
    summary: "Correct a field on an existing entity, backed by a source.",
    body: [
      "type: entity_correction",
      "target:",
      "  kind: entity",
      "  id: <type:slug>          # a real entity id, e.g. planet:mars",
      "field: <field name>        # e.g. radius",
      "proposed: <new value>",
      "evidence:",
      "  rationale: <why this is correct>",
      "  evidenceLevel: high | moderate | limited | historical",
      "  sources: [<source key>]  # e.g. nasa (must resolve in the source registry)",
    ].join("\n"),
  },
  {
    id: "source-addition",
    title: "Source Addition",
    type: "source_addition",
    summary: "Add an authoritative source that supports an entity or relationship.",
    body: [
      "type: source_addition",
      "target:",
      "  kind: entity | relationship",
      "  id: <entity id or from|type|to>",
      "source:",
      "  key: <existing source key>     # or:",
      "  proposed: { name, organization, url }   # for a new source (reviewed)",
      "evidence:",
      "  rationale: <what this source supports>",
    ].join("\n"),
  },
  {
    id: "relationship-suggestion",
    title: "Relationship Suggestion",
    type: "new_relationship",
    summary: "Propose a new typed relationship between two existing entities.",
    body: [
      "type: new_relationship",
      "targets:",
      "  - { kind: entity, id: <from id> }   # e.g. space_telescope:jwst",
      "  - { kind: entity, id: <to id> }     # e.g. nebula:carina-nebula",
      "relationship:",
      "  type: <relation type>               # e.g. observed_object",
      "  domain: science | culture | astrology",
      "  confidence: confirmed | likely | interpretive",
      "evidence:",
      "  rationale: <why this relationship holds>",
      "  sources: [<source key>]",
    ].join("\n"),
  },
  {
    id: "image-provenance",
    title: "Image Provenance",
    type: "image_metadata_correction",
    summary: "Correct or complete the provenance of an existing image.",
    body: [
      "type: image_metadata_correction",
      "target:",
      "  kind: image",
      "  id: <image slug>          # e.g. webb-first-deep-field",
      "provenance:",
      "  license: <license>        # required",
      "  credit: <credit line>     # required",
      "  source: <source>          # required",
      "evidence:",
      "  rationale: <what is being corrected>",
    ].join("\n"),
  },
  {
    id: "translation-suggestion",
    title: "Translation Suggestion",
    type: "translation_suggestion",
    summary: "Suggest a localized title/description for an entity.",
    body: [
      "type: translation_suggestion",
      "target:",
      "  kind: entity",
      "  id: <type:slug>           # e.g. star:sirius",
      "locale: <bcp-47 tag>        # e.g. es, fr, de",
      "localized:",
      "  title: <translated title>",
      "  description: <translated description>",
      "evidence:",
      "  rationale: <translator note>",
    ].join("\n"),
  },
  {
    id: "dataset-issue",
    title: "Dataset Issue",
    type: "dataset_issue",
    summary: "Report a completeness or correctness issue with a dataset.",
    body: [
      "type: dataset_issue",
      "target:",
      "  kind: dataset",
      "  id: <dataset slug>        # e.g. exoplanets",
      "issue: <what is wrong or missing>",
      "evidence:",
      "  rationale: <details, with any affected entity ids>",
    ].join("\n"),
  },
];
