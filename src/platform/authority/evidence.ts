import type { EntityDomain } from "@/knowledge-graph";

/**
 * Evidence framework.
 *
 * A standardized vocabulary for how strongly a statement is supported. The hard
 * rule: scientific domains use the scientific levels; interpretive traditions
 * (astrology, mythology) are ALWAYS "interpretive" and are never classified as
 * scientific evidence. Unknown stays unknown.
 */

export type EvidenceLevel =
  | "high"
  | "moderate"
  | "limited"
  | "historical"
  | "interpretive"
  | "unknown";

export const EVIDENCE_LEVELS: EvidenceLevel[] = [
  "high",
  "moderate",
  "limited",
  "historical",
  "interpretive",
  "unknown",
];

/** Levels permitted for scientific domains (interpretive is excluded). */
export const SCIENCE_EVIDENCE_LEVELS: EvidenceLevel[] = [
  "high",
  "moderate",
  "limited",
  "historical",
  "unknown",
];

/** The only level permitted for interpretive traditions. */
export const INTERPRETIVE_EVIDENCE_LEVEL: EvidenceLevel = "interpretive";

export const EVIDENCE_LABELS: Record<EvidenceLevel, string> = {
  high: "High",
  moderate: "Moderate",
  limited: "Limited",
  historical: "Historical",
  interpretive: "Interpretive",
  unknown: "Unknown",
};

export const EVIDENCE_DESCRIPTIONS: Record<EvidenceLevel, string> = {
  high: "Strongly supported by current peer-reviewed science and primary sources.",
  moderate: "Supported by good evidence; some details remain open or model-dependent.",
  limited: "Limited or preliminary evidence; treat with appropriate caution.",
  historical: "Established historical fact (events, dates, discoveries).",
  interpretive: "Cultural or symbolic tradition — not a scientific claim.",
  unknown: "Not yet determined; the honest answer is that it is unknown.",
};

/** Accent token for badges (kept subtle, not alarmist). */
export const EVIDENCE_ACCENT: Record<EvidenceLevel, string> = {
  high: "halo",
  moderate: "comet",
  limited: "stone",
  historical: "gold",
  interpretive: "plasma",
  unknown: "stone",
};

/** Which evidence levels a domain may use. */
export function allowedEvidenceForDomain(domain: EntityDomain): EvidenceLevel[] {
  return domain === "science" ? SCIENCE_EVIDENCE_LEVELS : [INTERPRETIVE_EVIDENCE_LEVEL];
}

export function isEvidenceValidForDomain(level: EvidenceLevel, domain: EntityDomain): boolean {
  return allowedEvidenceForDomain(domain).includes(level);
}

/**
 * Validate an evidence assignment. Rejects interpretive traditions marked as
 * scientific evidence, and science marked interpretive.
 */
export function validateEvidenceAssignment(
  level: EvidenceLevel,
  domain: EntityDomain,
  context = "evidence",
): string[] {
  const issues: string[] = [];
  if (!EVIDENCE_LEVELS.includes(level)) {
    issues.push(`${context}: invalid evidence level "${level}"`);
    return issues;
  }
  if (domain === "science" && level === "interpretive") {
    issues.push(`${context}: scientific domain cannot use the interpretive level`);
  }
  if (domain !== "science" && level !== "interpretive") {
    issues.push(`${context}: interpretive domain (${domain}) must use the interpretive level`);
  }
  return issues;
}
