import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Data Science, Artificial Intelligence & Machine Learning in Astronomy data model (Program AX) —
 * the computational layer of modern astronomy. It REUSES the Rubin Observatory and its alert
 * stream, the Transient Name Server, the photometry, spectral-classification and
 * gravitational-lensing methods, the galaxy morphologies, the transit exoplanet method, the Type Ia
 * supernova class, the redshift concept, and the reproducibility, data-pipeline and cross-matching
 * open-science practices already in the graph. The new entities are the machine-learning methods,
 * the astronomical applications, and the data-engineering workflows; the community alert brokers
 * are created with the existing alert-system type. Nothing is fabricated; benchmark datasets and
 * projects are named only where real.
 */

export type MlKind =
  | "method" // a machine-learning method / technique
  | "application" // an astronomical application of ML
  | "workflow" // a data-engineering workflow step
  | "broker"; // a community alert broker (reused alert-system type)

export const KIND_ENTITY_TYPE: Record<MlKind, EntityType> = {
  method: "ml_method",
  application: "ml_application",
  workflow: "ml_workflow",
  broker: "alert_system",
};

export const KIND_LABEL: Record<MlKind, string> = {
  method: "ML method",
  application: "Astronomical application",
  workflow: "Data-engineering workflow",
  broker: "Alert broker",
};

export interface MlRecord {
  id: string;
  slug: string;
  name: string;
  kind: MlKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  paradigmLabel?: string; // e.g. "Supervised" / "Unsupervised" / "Self-supervised" — only when well established
  definition?: string;
  highlights?: string[];
}
