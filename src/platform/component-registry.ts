/**
 * Component registry (metadata).
 *
 * A typed catalogue of the platform's reusable presentation modules. This is
 * METADATA only — it intentionally does not import the React components, so the
 * Registry layer never depends on the Presentation layer. The components
 * themselves live in src/components/platform/.
 */

export type ComponentKind =
  | "card"
  | "section"
  | "layout"
  | "primitive"
  | "navigation"
  | "seo";

export interface PlatformComponent {
  name: string;
  kind: ComponentKind;
  description: string;
  /** True for the reusable "card" family that every client can compose. */
  card: boolean;
}

export const PLATFORM_COMPONENTS: PlatformComponent[] = [
  // The card family — one consistent surface per entity/concept.
  { name: "KnowledgeCard", kind: "card", description: "Generic entity/concept card with domain accent and metadata.", card: true },
  { name: "RelationshipCard", kind: "card", description: "A single typed, direction-aware relationship between two entities.", card: true },
  { name: "DatasetCard", kind: "card", description: "An open dataset with entity count and formats.", card: true },
  { name: "TimelineCard", kind: "card", description: "A curated chronology summary.", card: true },
  { name: "MissionCard", kind: "card", description: "A space mission with agency and target.", card: true },
  { name: "AstronomerCard", kind: "card", description: "An astronomer with era and contributions.", card: true },
  { name: "GalleryCard", kind: "card", description: "A provenance-first image gallery entry.", card: true },
  { name: "ComparisonCard", kind: "card", description: "A side-by-side entity comparison summary.", card: true },
  { name: "ObservationCard", kind: "card", description: "An observation/event with date and target (architecture).", card: true },
  { name: "LearningCard", kind: "card", description: "A structured learning path summary.", card: true },
  { name: "ExplorerCard", kind: "card", description: "An entry point into a way of exploring the graph.", card: true },
  // Layout & sections
  { name: "Container", kind: "layout", description: "Max-width page container.", card: false },
  { name: "HeroSection", kind: "section", description: "Page hero with eyebrow, title, lead, and accent.", card: false },
  { name: "SectionGrid", kind: "section", description: "Responsive grid of cards.", card: false },
  // Navigation & SEO
  { name: "PlatformNav", kind: "navigation", description: "Premium grouped mega-menu navigation.", card: false },
  { name: "Breadcrumbs", kind: "navigation", description: "Breadcrumb trail with JSON-LD.", card: false },
  { name: "JsonLd", kind: "seo", description: "Structured-data injector.", card: false },
];

const BY_NAME = new Map(PLATFORM_COMPONENTS.map((c) => [c.name, c]));
export function getComponent(name: string): PlatformComponent | undefined {
  return BY_NAME.get(name);
}

export function getCardComponents(): PlatformComponent[] {
  return PLATFORM_COMPONENTS.filter((c) => c.card);
}

export function validateComponents(items = PLATFORM_COMPONENTS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const c of items) {
    if (seen.has(c.name)) issues.push(`duplicate component: ${c.name}`);
    seen.add(c.name);
    if (!c.description?.trim()) issues.push(`${c.name}: missing description`);
  }
  return issues;
}

export const COMPONENT_STATS = {
  total: PLATFORM_COMPONENTS.length,
  cards: getCardComponents().length,
} as const;
