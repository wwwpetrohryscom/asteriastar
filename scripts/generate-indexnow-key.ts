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
import { writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const key = (process.env.INDEXNOW_KEY ?? "").trim();

if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  const existing = readdirSync(PUBLIC_DIR).filter((f) => /^[a-zA-Z0-9-]{8,128}\.txt$/.test(f));
  if (existing.length > 0) {
    console.log(`[indexnow] INDEXNOW_KEY not set; keeping committed key file(s): ${existing.join(", ")}`);
  } else {
    console.warn("[indexnow] INDEXNOW_KEY not set and no committed key file found; /<key>.txt will 404.");
  }
  process.exit(0);
}

const file = join(PUBLIC_DIR, `${key}.txt`);
writeFileSync(file, key, "utf-8");
console.log(`[indexnow] Wrote key file public/${key}.txt`);
