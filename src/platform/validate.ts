import { validateRegistries } from "@/platform/registry";
import { validateLocalization } from "@/platform/localization";
import { validateExtensions } from "@/platform/extensions";
import { validateComponents } from "@/platform/component-registry";
import { validateSearchCore } from "@/platform/search-core";
import { LAYERS, classifyModule } from "@/platform/layers";

/**
 * Platform-level validation: registries, localization readiness, extensions,
 * components, search core, and the layer model's internal consistency. The
 * static dependency/cycle check over real source imports lives in
 * scripts/check-architecture.ts (it needs filesystem access).
 */
export function validatePlatform(): string[] {
  const issues: string[] = [];
  issues.push(...validateRegistries());
  issues.push(...validateLocalization());
  issues.push(...validateExtensions());
  issues.push(...validateComponents());
  issues.push(...validateSearchCore());

  // Layer model sanity: unique ids/levels, and the dependency allowlist is a DAG
  // (no layer may depend on a shallower-or-equal layer that also depends back).
  const ids = new Set<string>();
  for (const l of LAYERS) {
    if (ids.has(l.id)) issues.push(`duplicate layer id: ${l.id}`);
    ids.add(l.id);
    for (const dep of l.mayDependOn) {
      const target = LAYERS.find((x) => x.id === dep);
      if (!target) issues.push(`layer ${l.id}: unknown dependency ${dep}`);
      else if (target.mayDependOn.includes(l.id)) {
        issues.push(`layer cycle between ${l.id} and ${dep}`);
      }
    }
  }
  // Every owned prefix must classify back to its own layer.
  for (const l of LAYERS) {
    for (const prefix of l.owns) {
      if (classifyModule(prefix) !== l.id) {
        issues.push(`layer ${l.id}: prefix "${prefix}" misclassifies`);
      }
    }
  }
  return issues;
}
