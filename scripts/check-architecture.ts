import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, normalize } from "node:path";
import { classifyModule, mayDepend, type LayerId } from "../src/platform/layers";

/**
 * Static architecture check.
 *
 * Scans every import edge in src/ and enforces the platform layer dependency
 * allowlist (see src/platform/layers.ts). Because the allowlist is a DAG, a pass
 * also proves the layer dependency graph is acyclic — no circular dependencies
 * between layers, and the Graph layer never imports a layer above it.
 *
 * Cross-cutting utilities (lib/routes, lib/site, lib/seo, lib/navigation) are
 * unclassified and exempt; edges touching them are skipped.
 */

const SRC = join(process.cwd(), "src");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

/** src-relative module path, e.g. "knowledge-graph/helpers". */
function srcRel(absPath: string): string {
  return absPath.slice(SRC.length + 1).replace(/\.(ts|tsx)$/, "").replace(/\/index$/, "");
}

const IMPORT_RE = /(?:import|export)\s+(?:[^"';]*?\sfrom\s+)?["']([^"']+)["']/g;

function resolveSpec(fromRel: string, spec: string): string | null {
  if (spec.startsWith("@/")) return spec.slice(2).replace(/\/index$/, "");
  if (spec.startsWith(".")) {
    const resolved = normalize(join(dirname(fromRel), spec)).replace(/\\/g, "/");
    return resolved.replace(/\/index$/, "");
  }
  return null; // bare package import — not ours
}

const violations: string[] = [];
const layerEdges = new Set<string>();
let edgeCount = 0;

for (const file of walk(SRC)) {
  const fromRel = srcRel(file);
  const fromLayer = classifyModule(fromRel);
  if (!fromLayer) continue;
  // The Scientific Data Engine must be framework-independent (future CLI/API):
  // no React, no Next.js, no UI imports.
  const isEngine = fromRel === "platform/data-engine" || fromRel.startsWith("platform/data-engine/");
  const src = readFileSync(file, "utf8");
  let m: RegExpExecArray | null;
  while ((m = IMPORT_RE.exec(src))) {
    const spec = m[1];
    if (isEngine) {
      if (/^(react|react-dom|next)(\/|$)/.test(spec)) {
        violations.push(`${fromRel}: data engine must be framework-independent — forbidden import "${spec}"`);
      }
      if (spec.startsWith("@/components") || spec.startsWith("@/app")) {
        violations.push(`${fromRel}: data engine must not import UI — forbidden import "${spec}"`);
      }
    }
    const target = resolveSpec(fromRel, spec);
    if (!target) continue;
    const toLayer = classifyModule(target);
    if (!toLayer || toLayer === fromLayer) continue;
    edgeCount++;
    layerEdges.add(`${fromLayer}>${toLayer}`);
    if (!mayDepend(fromLayer, toLayer)) {
      violations.push(`${fromRel} (${fromLayer}) → ${target} (${toLayer}) — disallowed by layer contract`);
    }
  }
}

// Defensive: confirm the observed layer edge set is acyclic (it must be, since
// every edge passed mayDepend, and mayDependOn is a DAG).
function hasLayerCycle(): string | null {
  const adj = new Map<LayerId, LayerId[]>();
  for (const e of layerEdges) {
    const [a, b] = e.split(">") as [LayerId, LayerId];
    (adj.get(a) ?? adj.set(a, []).get(a)!).push(b);
  }
  const state = new Map<LayerId, number>();
  const stack: LayerId[] = [];
  let cycle: string | null = null;
  function dfs(n: LayerId) {
    if (cycle) return;
    state.set(n, 1);
    stack.push(n);
    for (const nx of adj.get(n) ?? []) {
      if (state.get(nx) === 1) cycle = [...stack, nx].join(" → ");
      else if (!state.get(nx)) dfs(nx);
      if (cycle) return;
    }
    stack.pop();
    state.set(n, 2);
  }
  for (const n of adj.keys()) if (!state.get(n)) dfs(n);
  return cycle;
}

const cycle = hasLayerCycle();
if (cycle) violations.push(`layer cycle detected: ${cycle}`);

if (violations.length > 0) {
  console.error(`\n✗ ${violations.length} architecture violation(s):`);
  for (const v of violations) console.error(`  • ${v}`);
  process.exit(1);
}

console.log(`✓ Architecture valid — ${edgeCount} cross-layer import edges, ${layerEdges.size} distinct layer edges, no violations`);
