import { createHash } from "node:crypto";
import { GRAPH_VERSION_INFO } from "@/knowledge-graph";
import { API_LICENSE } from "@/platform/open-data/api";
import { buildGraphJson, buildGraphJsonLd } from "@/lib/open-platform/graph-exports";

/**
 * The bulk-download manifest (Program BX). Every entry's size and checksum are computed from the EXACT
 * bytes served by the corresponding export route (the same serialiser backs both), so nothing is
 * fabricated: a `sha256` is a real digest of real content, a `bytes` is a real byte count, and the
 * `release` is the real graph version. No download is invented; if a format is not generated, it is not
 * listed here (it is described as architecture-ready on the platform pages instead).
 */

export interface DownloadEntry {
  name: string;
  /** The URL where the file is served. */
  path: string;
  format: string;
  /** Real byte size of the served content. */
  bytes: number;
  /** Real SHA-256 hex digest of the served content. */
  sha256: string;
  license: string;
  /** The graph release this export corresponds to. */
  release: string;
  limitations?: string;
}

function measure(content: string): { bytes: number; sha256: string } {
  return { bytes: Buffer.byteLength(content, "utf8"), sha256: createHash("sha256").update(content).digest("hex") };
}

let cache: DownloadEntry[] | null = null;

/** Compute the real download manifest (memoised — the digests are deterministic for a given graph). */
export function computeDownloadManifest(): DownloadEntry[] {
  if (cache) return cache;
  const jm = measure(buildGraphJson());
  const lm = measure(buildGraphJsonLd());
  cache = [
    {
      name: "Knowledge graph — JSON",
      path: "/data/graph.json",
      format: "application/json",
      ...jm,
      license: API_LICENSE,
      release: GRAPH_VERSION_INFO.graphVersion,
      limitations: "The complete typed graph: every entity and relation. Interpretive (culture / astrology) edges are included with their domain — filter by domain for science only.",
    },
    {
      name: "Knowledge graph — JSON-LD",
      path: "/data/graph.jsonld",
      format: "application/ld+json",
      ...lm,
      license: API_LICENSE,
      release: GRAPH_VERSION_INFO.graphVersion,
      limitations: "RDF-compatible, SPARQL-ready shape (resolvable @id per node). A hosted SPARQL endpoint is architecture-ready, not yet live.",
    },
  ];
  return cache;
}

/** Human-readable byte size. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
