/**
 * Open Data & Scientific APIs platform (Program L).
 *
 * A thin, deterministic, read-only projection of the Scientific Data Engine and
 * Knowledge Graph for external consumers (public API, SDKs, AI systems,
 * educators, researchers). Pages are views; entities are reality; this layer
 * never bypasses the engine and never fabricates data.
 */
export * from "@/platform/open-data/api";
export * from "@/platform/open-data/licenses";
export * from "@/platform/open-data/catalogue";
export * from "@/platform/open-data/endpoints";
export * from "@/platform/open-data/openapi";
export * from "@/platform/open-data/portal";
export { validateOpenData } from "@/platform/open-data/validation";
