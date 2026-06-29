/**
 * Asteria Platform Core — public surface.
 *
 * Every client (website, future mobile/desktop/API/AI) consumes the platform
 * through this barrel: the layer model, entity runtime, universal registry,
 * metadata generation, search core, localization, extensions, and the component
 * registry.
 */
export * from "@/platform/layers";
export * from "@/platform/localization";
export * from "@/platform/extensions";
export * from "@/platform/runtime";
export * from "@/platform/registry";
export * from "@/platform/metadata";
export * from "@/platform/search-core";
export * from "@/platform/component-registry";
export { validatePlatform } from "@/platform/validate";
