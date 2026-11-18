/**
 * Collapses byte-identical Turbopack server chunks before OpenNext bundles the Worker.
 *
 * WHY: Turbopack emits the server half of the knowledge graph as one 2.4 MB chunk PER ROUTE that uses
 * it — 49 copies whose bytes differ only in the trailing `//# sourceMappingURL=` comment (measured on
 * main ebb7006). On a Node server that costs disk; in a Worker, where OpenNext statically bundles every
 * chunk into one script, it is ~131 MB of the 160 MB of app code and puts the script far over the
 * Workers size limit (10 MiB compressed on Workers Paid).
 *
 * WHAT: within `.next/server/chunks` (and the standalone copy OpenNext reads from), every chunk whose
 * content — ignoring the source-map comment — equals an earlier chunk's is replaced by
 * `module.exports = require("<that chunk>")`. Turbopack loads a chunk by requiring its path and
 * installing the module factories it exports; a duplicate now hands back the same factories, which
 * were already installed under the same module ids. Nothing else changes: every chunk path that a
 * route manifest names still exists and still resolves.
 *
 * Runs as part of the OpenNext build (`buildCommand` in open-next.config.ts), after `next build`.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "..");
const SOURCE_MAP_COMMENT = /\n\/\/# sourceMappingURL=[^\n]*\s*$/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".js")) out.push(full);
  }
  return out;
}

function dedupe(chunksDir) {
  if (!existsSync(chunksDir)) return null;
  const files = walk(chunksDir).sort();
  const firstByHash = new Map();
  let removedBytes = 0;
  let replaced = 0;
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    if (content.startsWith("module.exports = require(")) continue; // already a shim (re-run)
    const body = content.replace(SOURCE_MAP_COMMENT, "");
    const hash = createHash("sha256").update(body).digest("hex");
    const original = firstByHash.get(hash);
    if (!original) {
      firstByHash.set(hash, file);
      continue;
    }
    let target = relative(dirname(file), original).split("\\").join("/");
    if (!target.startsWith(".")) target = `./${target}`;
    writeFileSync(file, `module.exports = require(${JSON.stringify(target)});\n`);
    removedBytes += content.length;
    replaced += 1;
  }
  return { files: files.length, replaced, removedBytes };
}

const targets = [
  join(root, ".next", "server", "chunks"),
  join(root, ".next", "standalone", ".next", "server", "chunks"),
];
let any = false;
for (const dir of targets) {
  const result = dedupe(dir);
  if (!result) continue;
  any = true;
  console.log(
    `✓ ${relative(root, dir)}: ${result.replaced} of ${result.files} chunks were duplicates ` +
      `(${(result.removedBytes / 1e6).toFixed(1)} MB) → now require their first copy`,
  );
}
if (!any) {
  console.error("✗ no .next/server/chunks found — run `next build` first");
  process.exit(1);
}
