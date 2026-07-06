import { buildGraphJson } from "@/lib/open-platform/graph-exports";

/**
 * Machine-readable export of the canonical knowledge graph (JSON).
 * Statically generated from the real typed graph — not fabricated. Served at
 * /data/graph.json. The exact same serialiser backs the download manifest, so the
 * advertised size and checksum match the served bytes.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildGraphJson(), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
