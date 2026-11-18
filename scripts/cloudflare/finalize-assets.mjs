/**
 * Runs after `opennextjs-cloudflare build`: puts the static-file header rules into the assets
 * directory, where Workers static assets reads them. Kept out of public/ so that `next start` and any
 * other host do not serve a `/_headers` file.
 */
import { copyFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "..");
const assets = join(root, ".open-next", "assets");
if (!existsSync(assets)) {
  console.error("✗ .open-next/assets not found — run `npx opennextjs-cloudflare build` first");
  process.exit(1);
}
copyFileSync(join(root, "cloudflare", "_headers"), join(assets, "_headers"));
console.log("✓ static-file headers written to .open-next/assets/_headers");
