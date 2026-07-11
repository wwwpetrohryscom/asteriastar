import Link from "next/link";
import {
  entityGraphPath,
  relationLabel,
  ENTITY_TYPE_LABELS,
  type GraphEntity,
  type Connection,
} from "@/knowledge-graph";
import { datasetPath, comparePath, learnPath, timelinePath } from "@/lib/routes";
import type { Dataset } from "@/lib/datasets";
import type { LearningPath } from "@/lib/learn";
import type { Timeline } from "@/lib/timelines";
import type { Comparison } from "@/lib/compare";

/**
 * The platform card family — one consistent, reusable surface that every client
 * can compose. Each card is a thin, typed view over a graph-derived object; they
 * all share PlatformCard so spacing, borders, and hover behavior stay uniform.
 * Minimal motion, dark scientific styling, no decorative gradients.
 */

type Accent = "nebula" | "halo" | "aurora" | "gold" | "ember" | "stone" | "comet" | "plasma";

const ACCENT_RING: Record<Accent, string> = {
  nebula: "hover:border-nasa/40",
  halo: "hover:border-white/40",
  aurora: "hover:border-white/40",
  gold: "hover:border-nasa/40",
  ember: "hover:border-nasa/40",
  stone: "hover:border-white/40",
  comet: "hover:border-white/40",
  plasma: "hover:border-white/40",
};

const DOMAIN_ACCENT: Record<string, Accent> = {
  science: "halo",
  culture: "gold",
  astrology: "plasma",
};

const DOMAIN_DOT: Record<string, string> = {
  science: "bg-white",
  culture: "bg-nasa",
  astrology: "bg-white",
};

/** Shared base surface for every platform card. */
export function PlatformCard({
  href,
  accent = "nebula",
  eyebrow,
  title,
  children,
  meta,
}: {
  href: string;
  accent?: Accent;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col scientific-card p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.04] ${ACCENT_RING[accent]}`}
    >
      {eyebrow != null && (
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-faint">{eyebrow}</p>
      )}
      <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-fg">{title}</h3>
      {children}
      {meta != null && <div className="mt-auto pt-3 text-xs text-faint">{meta}</div>}
    </Link>
  );
}

export function KnowledgeCard({ entity, relationCount }: { entity: GraphEntity; relationCount?: number }) {
  return (
    <PlatformCard
      href={entityGraphPath(entity)}
      accent={DOMAIN_ACCENT[entity.domain] ?? "nebula"}
      eyebrow={
        <span className="inline-flex items-center gap-1.5">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${DOMAIN_DOT[entity.domain] ?? "bg-nasa"}`} />
          {ENTITY_TYPE_LABELS[entity.type]}
        </span>
      }
      title={entity.name}
      meta={typeof relationCount === "number" ? `${relationCount} connection${relationCount === 1 ? "" : "s"}` : undefined}
    >
      {entity.description && <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{entity.description}</p>}
    </PlatformCard>
  );
}

export function RelationshipCard({ connection, accent = "stone" }: { connection: Connection; accent?: Accent }) {
  const { relation, other, outgoing } = connection;
  return (
    <PlatformCard
      href={entityGraphPath(other)}
      accent={accent}
      eyebrow={relationLabel(relation.type, outgoing)}
      title={other.name}
      meta={`${relation.domain} · ${relation.confidence}`}
    >
      {other.description && <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-2">{other.description}</p>}
    </PlatformCard>
  );
}

export function DatasetCard({ dataset }: { dataset: Dataset }) {
  return (
    <PlatformCard
      href={datasetPath(dataset.slug)}
      accent="comet"
      eyebrow="Dataset"
      title={dataset.title}
      meta={`${dataset.entityCount} entities · v${dataset.version}`}
    >
      <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{dataset.description}</p>
    </PlatformCard>
  );
}

export function MissionCard({ entity, detail }: { entity: GraphEntity; detail?: string }) {
  return (
    <PlatformCard href={entityGraphPath(entity)} accent="ember" eyebrow="Space mission" title={entity.name} meta={detail}>
      {entity.description && <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{entity.description}</p>}
    </PlatformCard>
  );
}

export function AstronomerCard({ entity, era }: { entity: GraphEntity; era?: string }) {
  return (
    <PlatformCard href={entityGraphPath(entity)} accent="gold" eyebrow={era ?? "Astronomer"} title={entity.name}>
      {entity.description && <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{entity.description}</p>}
    </PlatformCard>
  );
}

export function ComparisonCard({ comparison }: { comparison: Comparison }) {
  return (
    <PlatformCard href={comparePath(comparison.slug)} accent="aurora" eyebrow="Comparison" title={comparison.title}>
      {comparison.description && <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{comparison.description}</p>}
    </PlatformCard>
  );
}

export function LearningCard({ path }: { path: LearningPath }) {
  return (
    <PlatformCard href={learnPath(path.slug)} accent="halo" eyebrow="Learning path" title={path.title} meta={`${path.stages.length} stages`}>
      {path.description && <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{path.description}</p>}
    </PlatformCard>
  );
}

export function TimelineCard({ timeline }: { timeline: Timeline }) {
  return (
    <PlatformCard href={timelinePath(timeline.slug)} accent="nebula" eyebrow="Timeline" title={timeline.title} meta={`${timeline.events.length} events`}>
      {timeline.description && <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{timeline.description}</p>}
    </PlatformCard>
  );
}

export function ExplorerCard({ title, description, href, accent = "nebula", eyebrow = "Explorer" }: { title: string; description: string; href: string; accent?: Accent; eyebrow?: string }) {
  return (
    <PlatformCard href={href} accent={accent} eyebrow={eyebrow} title={title}>
      <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-3">{description}</p>
    </PlatformCard>
  );
}

export function GalleryCard({ entity }: { entity: GraphEntity }) {
  return (
    <PlatformCard href={entityGraphPath(entity)} accent="plasma" eyebrow="Gallery" title={entity.name} meta="Provenance-first imagery">
      <p className="mt-1.5 text-sm leading-relaxed text-muted">Verified, openly-licensed imagery is added with full provenance.</p>
    </PlatformCard>
  );
}

export function ObservationCard({ title, target, date }: { title: string; target: string; date?: string }) {
  return (
    <PlatformCard href="/observatory" accent="stone" eyebrow={date ?? "Observation"} title={title} meta="Architecture — not yet open">
      <p className="mt-1.5 text-sm leading-relaxed text-muted">Target: {target}</p>
    </PlatformCard>
  );
}
