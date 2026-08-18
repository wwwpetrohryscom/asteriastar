"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
 * Module-level caches rather than component state, so opening search a second
 * time — or mounting the header trigger and the /search page together — never
 * refetches.
 */

type Stage = "idle" | "loading" | "partial" | "ready" | "error";

let coreCache: SearchDoc[] | null = null;
let tailCache: SearchDoc[] | null = null;
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
  fetchShard("catalogue")
    .then((docs) => {
      tailCache = docs;
      notify();
    })
    .catch(() => {
      // The catalogue failing is survivable — core still answers most queries.
      tailCache = [];
      notify();
    });
}

export interface SearchIndexState {
  docs: SearchDoc[];
  stage: Stage;
  /** Begin loading. Safe to call repeatedly, and cheap after the first call. */
  prime: () => void;
}

function snapshot(): { docs: SearchDoc[]; stage: Stage } {
  if (errored && !coreCache) return { docs: [], stage: "error" };
  if (coreCache && tailCache) return { docs: [...coreCache, ...tailCache], stage: "ready" };
  if (coreCache) return { docs: coreCache, stage: "partial" };
  return { docs: [], stage: started ? "loading" : "idle" };
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
