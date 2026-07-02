/**
 * Security & abuse model — ARCHITECTURE ONLY.
 *
 * Documents the controls a future review system will apply at each stage of the
 * workflow. Nothing here is implemented: there is no rate limiter, no spam
 * filter, no verification service. It is the design the workflow is built to
 * accept, so that opening real submissions later is safe by construction.
 */

export type ControlStage = "submission" | "triage" | "review" | "acceptance";

export interface SecurityControl {
  id: string;
  label: string;
  description: string;
  stage: ControlStage;
  /** Always false in this program — controls are designed, not implemented. */
  implemented: false;
}

export const SECURITY_CONTROLS: SecurityControl[] = [
  { id: "spam_prevention", label: "Spam prevention", stage: "submission", implemented: false, description: "Structural checks and (future) human triage keep low-effort or automated noise out of the review queue." },
  { id: "source_quality", label: "Source quality checks", stage: "review", implemented: false, description: "Sources must come from the authoritative registry or a proposed source a Source Reviewer verifies." },
  { id: "license_checks", label: "License checks", stage: "review", implemented: false, description: "Every image and dataset contribution is checked for a compatible, declared license before acceptance." },
  { id: "human_review", label: "Human review", stage: "review", implemented: false, description: "No contribution is ever auto-applied; an editor and, where required, a scientific reviewer must approve it." },
  { id: "scientific_review", label: "Scientific review", stage: "review", implemented: false, description: "Sourced factual claims in the science domain must pass scientific review by a domain expert." },
  { id: "conflict_detection", label: "Conflict detection", stage: "triage", implemented: false, description: "Overlapping edits to the same object are surfaced before either is accepted." },
  { id: "duplicate_detection", label: "Duplicate proposal detection", stage: "triage", implemented: false, description: "Open proposals targeting the same object with the same change are merged or superseded, not double-applied." },
  { id: "rate_limits", label: "Rate limits", stage: "submission", implemented: false, description: "Submission rate limits (per contributor and per institution) protect the queue. Designed, not enforced today." },
  { id: "institutional_verification", label: "Institutional verification", stage: "submission", implemented: false, description: "Observatories, universities, and agencies are verified before receiving the Institutional Partner role." },
];

export const CONTROL_STAGES: ControlStage[] = ["submission", "triage", "review", "acceptance"];

export function controlsForStage(stage: ControlStage): SecurityControl[] {
  return SECURITY_CONTROLS.filter((c) => c.stage === stage);
}

export function validateSecurityModel(): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const c of SECURITY_CONTROLS) {
    if (seen.has(c.id)) issues.push(`duplicate security control: ${c.id}`);
    seen.add(c.id);
    if (!CONTROL_STAGES.includes(c.stage)) issues.push(`security control ${c.id} has unknown stage ${c.stage}`);
    if (c.implemented !== false) issues.push(`security control ${c.id} must be architecture-only (implemented=false)`);
  }
  return issues;
}
