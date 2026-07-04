import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Multi-Wavelength & Time-Domain Astronomy Atlas data model (Program AP) — how the dynamic
 * universe is observed across every wavelength and messenger. It REUSES the wavelength/messenger
 * bands (radio → gamma-ray, gravitational waves, neutrinos, multi-messenger), the multi-messenger
 * methods, the surveys and observatories (Rubin, Pan-STARRS, ATLAS, Catalina), the Minor Planet
 * Center, and the magnetar object class already in the graph; the new entities are the transient
 * classes, the alert-infrastructure systems, and the transient-workflow stages. Nothing is
 * fabricated; the multi-wavelength axis is the existing set of bands, not a parallel one.
 */

export type TimeDomainKind =
  | "transient" // a class of transient / time-domain phenomenon
  | "alert" // an alert-infrastructure system or broker
  | "stage"; // a stage of the transient observation workflow

export const KIND_ENTITY_TYPE: Record<TimeDomainKind, EntityType> = {
  transient: "transient_class",
  alert: "alert_system",
  stage: "observation_stage",
};

export const KIND_LABEL: Record<TimeDomainKind, string> = {
  transient: "Transient class",
  alert: "Alert system",
  stage: "Workflow stage",
};

export type TransientCategory =
  | "explosive"
  | "relativistic"
  | "merger"
  | "tidal"
  | "radio"
  | "variable"
  | "infrastructure"
  | "workflow";

export interface TimeDomainRecord {
  id: string;
  slug: string;
  name: string;
  kind: TimeDomainKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with) — bands, methods, surveys, orgs
  nextStageSlug?: string; // stage → followed_by next stage

  /* display */
  category?: TransientCategory;
  messenger?: string; // for a transient: the primary messenger(s), e.g. "Gravitational waves + light"
  order?: number; // for a stage: workflow order
  definition?: string;
  highlights?: string[];
}
