/**
 * Authority layer — the scientific-trust surface of the platform: evidence,
 * provenance, review, versioning, editorial status, data quality, and the
 * derived authority snapshot. Architecture-first; registries ship empty (no
 * fabricated facts, no fake review history).
 */
export * from "@/platform/authority/evidence";
export * from "@/platform/authority/provenance";
export * from "@/platform/authority/review";
export * from "@/platform/authority/versioning";
export * from "@/platform/authority/editorial";
export * from "@/platform/authority/quality";
export * from "@/platform/authority/authority";
export { validateAuthority } from "@/platform/authority/validate-authority";
