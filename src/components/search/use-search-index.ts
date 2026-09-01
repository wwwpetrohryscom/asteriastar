"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchJournalSearchDocs } from "@/lib/journal/search";
import {
  SEARCH_INDEX_VERSION,
  shardPath,
  type SearchDoc,
  type SearchShard,
} from "@/lib/search/types";

/**
 * Lazily loads the generated search index.
 *
 * The shards are plain static JSON emitted at build time, so this is a couple
 * of cacheable GETs against the CDN — no API route and no search service. The
 * fetch is deferred until the visitor actually engages with search, which keeps
 * ~1.8 MB of index off the critical path of every page that merely renders the
 * search button.
 *
 * Two shards, resolved independently: `core` (hubs, topics, guides, tools and
 * named objects — 80 KB gzipped) settles first and the panel becomes usable
 * immediately, while `catalogue` (the deep long tail) streams in behind it and
 * widens the same query in place.
 *
 * A third source joins them: AsteriaStar Journal. Its index is NOT built into the shards, because
 * the Journal is a separate deployment — baking it in would mean rebuilding this application every
 * time an article is published, which is the one thing the split exists to prevent. It is fetched at
 * runtime alongside the shards and merged into the same ranking. If it fails, search simply has no
 * Journal rows; the platform's own index is complete without it, so this is not the same kind of
 * incompleteness as a missing catalogue shard and is not reported as one.
 *
 * Module-level caches rather than component state, so opening search a second
 * time — or mounting the header trigger and the /search page together — never
 * refetches.
 */

type Stage = "idle" | "loading" | "partial" | "ready" | "error";

let coreCache: SearchDoc[] | null = null;
let tailCache: SearchDoc[] | null = null;
let journalCache: SearchDoc[] | null = null;
let tailFailed = false;
let started = false;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

async function fetchShard(name: string): Promise<SearchDoc[]> {
  const res = await fetch(shardPath(name), { cache: "force-cache" });
  if (!res.ok) throw new Error(`search index shard ${name} unavailable (${res.status})`);
  const parsed = (await res.json()) as SearchShard;
  if (parsed.version !== SEARCH_INDEX_VERSION) {
    // A cached shard from an older deploy would rank against a shape this code
    // no longer understands. Failing loudly beats ranking against stale data.
    throw new Error(`search index version ${parsed.version} != expected ${SEARCH_INDEX_VERSION}`);
  }
  return parsed.docs ?? [];
}

let errored = false;

function begin() {
  if (started) return;
  started = true;
  // Announce the idle → loading transition through the same listener channel
  // the shard resolutions use, so `prime()` never calls setState itself.
  queueMicrotask(notify);
  // Independent promises, not Promise.all: the core shard must be usable the
  // moment it lands rather than waiting on the four-times-larger catalogue.
  fetchShard("core")
    .then((docs) => {
      coreCache = docs;
      notify();
    })
    .catch(() => {
      errored = true;
      notify();
    });
  // The Journal's own index, from the other deployment. It resolves to [] rather than rejecting on
  // every failure path, so there is no error branch to handle here — only rows or no rows.
  fetchJournalSearchDocs().then((docs) => {
    journalCache = docs;
    notify();
  });
  fetchShard("catalogue")
    .then((docs) => {
      tailCache = docs;
      notify();
    })
    .catch(() => {
      // The catalogue failing is survivable — core still answers many queries —
      // but it must not be reported as a complete index, or the UI would state
      // "no results" for a query the missing 6,000 documents would have
      // answered.
      tailFailed = true;
      notify();
    });
}

export interface SearchIndexState {
  docs: SearchDoc[];
  stage: Stage;
  /** True when the catalogue shard failed and only the core index is present. */
  degraded: boolean;
  /** Begin loading. Safe to call repeatedly, and cheap after the first call. */
  prime: () => void;
}

function snapshot(): { docs: SearchDoc[]; stage: Stage; degraded: boolean } {
  // Journal rows join whatever the platform index has resolved so far. They are additive: they never
  // change the stage, because the platform's own completeness is not affected by whether the
  // publication answered.
  const journal = journalCache ?? [];
  if (errored && !coreCache) return { docs: [], stage: "error", degraded: false };
  if (coreCache && tailCache) return { docs: [...coreCache, ...tailCache, ...journal], stage: "ready", degraded: false };
  // Core present, catalogue permanently failed: usable, but incomplete, and
  // said so rather than passed off as settled.
  if (coreCache && tailFailed) return { docs: [...coreCache, ...journal], stage: "ready", degraded: true };
  if (coreCache) return { docs: [...coreCache, ...journal], stage: "partial", degraded: false };
  return { docs: [], stage: started ? "loading" : "idle", degraded: false };
}

export function useSearchIndex(): SearchIndexState {
  const [state, setState] = useState(snapshot);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const listener = () => {
      if (alive.current) setState(snapshot());
    };
    listeners.add(listener);
    // Re-sync on mount in case a shard resolved between render and effect.
    listener();
    return () => {
      alive.current = false;
      listeners.delete(listener);
    };
  }, []);

  // Only kicks off the fetch; state arrives via the listener above. Calling
  // setState here would be a synchronous set inside an effect for callers that
  // prime on mount.
  const prime = useCallback(() => begin(), []);

  return { ...state, prime };
}
