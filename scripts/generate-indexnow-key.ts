/**
 * Prebuild step: materialise the IndexNow key file from the environment.
 *
 * IndexNow requires a file at `/<key>.txt` whose contents are exactly the key.
 * This script writes `public/<INDEXNOW_KEY>.txt` from the `INDEXNOW_KEY`
 * environment variable so the key is never hardcoded in application code — the
 * only place the literal key lives is this generated (and committed) file, which
 * is the location the protocol requires.
 *
 * If `INDEXNOW_KEY` is not set, any already-committed key file is left in place
 * so the build never fails and the endpoint keeps working.
 */
import { writeFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const KEY_FILE = /^[a-zA-Z0-9-]{8,128}\.txt$/;
const key = (process.env.INDEXNOW_KEY ?? "").trim();

if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  const existing = readdirSync(PUBLIC_DIR).filter((f) => KEY_FILE.test(f));
  if (existing.length > 0) {
    console.log(`[indexnow] INDEXNOW_KEY not set; keeping committed key file(s): ${existing.join(", ")}`);
  } else {
    console.warn("[indexnow] INDEXNOW_KEY not set and no committed key file found; /<key>.txt will 404.");
  }
  process.exit(0);
}

// Rotation-safe: remove any stale key file(s) so exactly one verification file
// exists and it always matches the current INDEXNOW_KEY.
for (const f of readdirSync(PUBLIC_DIR).filter((f) => KEY_FILE.test(f) && f !== `${key}.txt`)) {
  rmSync(join(PUBLIC_DIR, f));
  console.log(`[indexnow] Removed stale key file public/${f}`);
}

const file = join(PUBLIC_DIR, `${key}.txt`);
writeFileSync(file, key, "utf-8");
console.log(`[indexnow] Wrote key file public/${key}.txt`);
