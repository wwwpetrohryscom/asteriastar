import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const pExecFile = promisify(execFile);

/**
 * POST an ADQL query to a TAP `/sync` endpoint and return column names + rows.
 * Routed through curl because Node's undici fetch fails to decode the gzipped TAP
 * responses (TransformError). Uses async execFile (never the sync variant, which
 * stalls tsx's esbuild worker) and passes the query via a temp file so very long
 * IN-lists never hit an argv limit. Retries transient failures; throws after the last.
 */
export async function tapQuery(
  endpoint: string,
  adql: string,
  attempts = 4,
): Promise<{ cols: string[]; data: unknown[][] }> {
  const dir = mkdtempSync(join(tmpdir(), "tap-"));
  const qfile = join(dir, "query.adql");
  writeFileSync(qfile, adql);
  let lastErr: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const { stdout } = await pExecFile(
        "curl",
        [
          "-sS", "--compressed", "--max-time", "180",
          "--data-urlencode", "REQUEST=doQuery",
          "--data-urlencode", "LANG=ADQL",
          "--data-urlencode", "FORMAT=json",
          "--data-urlencode", `QUERY@${qfile}`,
          endpoint,
        ],
        { maxBuffer: 256 * 1024 * 1024, encoding: "utf8" },
      );
      const json = JSON.parse(stdout) as { metadata: { name: string }[]; data: unknown[][] };
      if (!Array.isArray(json.data)) throw new Error("no data array in TAP response");
      return { cols: json.metadata.map((m) => m.name), data: json.data };
    } catch (err) {
      lastErr = err;
      if (attempt === attempts) break;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}
