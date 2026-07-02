import {
  getAllGraphEntities,
  GRAPH_STATS,
  GRAPH_VERSION_INFO,
} from "@/knowledge-graph";
import { DATASETS } from "@/lib/datasets";
import { getAllSources, type AuthorityType } from "@/lib/sources";
import { computeEntityQuality, type CoverageLevel } from "@/platform/authority/quality";
import { reviewStatusFor } from "@/platform/authority/review";
import { PROVENANCE } from "@/platform/authority/provenance";
import { CITATIONS } from "@/lib/citations";

/**
 * Authority snapshot — a transparent, fully-derived view of the platform's
 * scientific coverage. Every number is computed from real registry data; there
 * are no fabricated statistics and no fake review history.
 */

const PRIMARY_AUTHORITY = new Set<AuthorityType>([
  "space-agency",
  "observatory",
  "union",
  "database",
  "literature",
]);

export interface AuthoritySnapshot {
  entities: number;
  relationships: number;
  datasets: number;
  reviewed: number;
  awaitingReview: number;
  provenanceRecords: number;
  citations: number;
  withProvenance: number;
  sourcesTotal: number;
  primarySources: number;
  secondarySources: number;
  sourcesConnected: number;
  coverage: {
    withSources: number;
    withTimeline: number;
    withImages: number;
    localized: number;
    reviewed: number;
  };
  qualityDistribution: Record<CoverageLevel, number>;
  version: typeof GRAPH_VERSION_INFO;
}

export function computeAuthoritySnapshot(): AuthoritySnapshot {
  const entities = getAllGraphEntities();
  const sources = getAllSources();

  let reviewed = 0;
  let withSources = 0;
  let withTimeline = 0;
  let withImages = 0;
  let localized = 0;
  const quality: Record<CoverageLevel, number> = { complete: 0, partial: 0, none: 0 };
  const connected = new Set<string>();

  for (const e of entities) {
    if (reviewStatusFor(e.id) === "reviewed" || reviewStatusFor(e.id) === "verified") reviewed++;
    for (const s of e.sources ?? []) connected.add(s);
    const q = computeEntityQuality(e);
    if (q.indicators.sourceCoverage !== "none") withSources++;
    if (q.indicators.timelineCoverage !== "none") withTimeline++;
    if (q.indicators.imageCoverage !== "none") withImages++;
    if (q.indicators.localizationCoverage !== "none") localized++;
    quality[q.overall]++;
  }

  return {
    entities: entities.length,
    relationships: GRAPH_STATS.relationCount,
    datasets: DATASETS.length,
    reviewed,
    awaitingReview: entities.length - reviewed,
    provenanceRecords: PROVENANCE.length,
    citations: CITATIONS.length,
    withProvenance: new Set(PROVENANCE.map((p) => p.entityId)).size,
    sourcesTotal: sources.length,
    primarySources: sources.filter((s) => PRIMARY_AUTHORITY.has(s.authorityType)).length,
    secondarySources: sources.filter((s) => !PRIMARY_AUTHORITY.has(s.authorityType)).length,
    sourcesConnected: connected.size,
    coverage: {
      withSources,
      withTimeline,
      withImages,
      localized,
      reviewed,
    },
    qualityDistribution: quality,
    version: GRAPH_VERSION_INFO,
  };
}
