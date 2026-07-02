import { getEntityById, getRelationsForEntity } from "@/knowledge-graph";
import { getDataset } from "@/lib/datasets";
import { SOURCES, type SourceKey } from "@/lib/sources";
import { CITATIONS } from "@/lib/citations";
import { getTimeline } from "@/lib/timelines";
import { LEARNING_PATHS } from "@/lib/learn";
import { IMAGE_BY_SLUG } from "@/knowledge-graph/data/image-catalog";
import { ENDPOINTS } from "@/platform/open-data/endpoints";
import {
  CONTRIBUTION_TYPE_BY_ID,
  type Contribution,
  type ContributionType,
  type TargetKind,
  type TargetRef,
} from "@/platform/contributions/schema";

/**
 * Proposal reference resolution — the graph-aware layer.
 *
 * Every contribution must attach to REAL platform objects (no orphans). These
 * resolvers check a target id against the live graph, source registry, image
 * catalogue, datasets, timelines, learning paths, and API endpoint registry.
 * Nothing is fabricated: a reference either resolves against real data or fails.
 */

/** Does a relationship id (`from|type|to`) exist in the graph? */
export function relationshipExists(id: string): boolean {
  const from = id.split("|")[0];
  if (!from) return false;
  return getRelationsForEntity(from).some((r) => r.id === id);
}

const RESOLVERS: Record<TargetKind, (id: string) => boolean> = {
  entity: (id) => Boolean(getEntityById(id)),
  relationship: (id) => relationshipExists(id),
  dataset: (id) => Boolean(getDataset(id)),
  source: (id) => Object.prototype.hasOwnProperty.call(SOURCES, id as SourceKey),
  citation: (id) => CITATIONS.some((c) => c.id === id),
  image: (id) => IMAGE_BY_SLUG.has(id) || IMAGE_BY_SLUG.has(id.replace(/^scientific_image:/, "")),
  timeline: (id) => Boolean(getTimeline(id)),
  learning_path: (id) => LEARNING_PATHS.some((p) => p.slug === id),
  api: (id) => ENDPOINTS.some((e) => e.path === id),
};

/** True when a single target reference resolves to a real platform object. */
export function targetResolves(ref: TargetRef): boolean {
  const resolver = RESOLVERS[ref.kind];
  return resolver ? resolver(ref.id) : false;
}

export interface TargetRequirements {
  required: TargetKind[];
  optional: TargetKind[];
  /** True when the type proposes a not-yet-existing object. */
  proposesNew: boolean;
}

export function targetRequirements(type: ContributionType): TargetRequirements {
  const def = CONTRIBUTION_TYPE_BY_ID[type];
  return { required: def.requiredTargets, optional: def.optionalTargets, proposesNew: def.proposesNew };
}

/**
 * Validate a contribution's targets: every referenced target must resolve, and
 * at least one target of a required kind must be present (unless the type
 * proposes something new, e.g. a new entity). Returns human-readable issues.
 */
export function validateTargets(contribution: Contribution): string[] {
  const issues: string[] = [];
  const def = CONTRIBUTION_TYPE_BY_ID[contribution.type];
  if (!def) {
    issues.push(`unknown contribution type: ${contribution.type}`);
    return issues;
  }

  const allowed = new Set<TargetKind>([...def.requiredTargets, ...def.optionalTargets]);
  for (const ref of contribution.targets) {
    if (!allowed.has(ref.kind)) {
      issues.push(`${contribution.id}: target kind '${ref.kind}' is not allowed for ${contribution.type}`);
    }
    if (!targetResolves(ref)) {
      issues.push(`${contribution.id}: ${ref.kind} target '${ref.id}' does not resolve to a real object (orphan reference)`);
    }
  }

  // At least one required-kind target must be present, unless a new object is proposed.
  if (def.requiredTargets.length > 0) {
    const kinds = new Set(contribution.targets.map((t) => t.kind));
    const hasRequired = def.requiredTargets.some((k) => kinds.has(k));
    if (!hasRequired) {
      issues.push(`${contribution.id}: ${contribution.type} requires a target of kind: ${def.requiredTargets.join(" or ")}`);
    }
  }

  // A new relationship needs two existing entity endpoints.
  if (contribution.type === "new_relationship") {
    const entities = contribution.targets.filter((t) => t.kind === "entity");
    if (entities.length < 2) issues.push(`${contribution.id}: new_relationship needs two existing entity endpoints (from and to)`);
  }

  return issues;
}
