"use client";

/**
 * Privacy-safe search analytics.
 *
 * WHAT IS DELIBERATELY NOT SENT: the query text.
 *
 * This repository integrates WebmasterID as a plain third-party tracker script
 * with no consent gate and no documented custom-event schema. Free-text search
 * queries are the highest-risk payload a search feature can emit — people type
 * names, places and personal context into search boxes — so shipping them to a
 * third party with no consent mechanism in front of it is not a trade this
 * platform should make silently.
 *
 * What IS sent is structural and non-identifying: how long the query was, how
 * many results it produced, which group was clicked, and at what rank. That is
 * enough to answer the questions that actually improve search — "are people
 * getting zero results", "do they click the first result or the seventh",
 * "which groups matter" — without transmitting what anyone typed.
 *
 * Every call is a no-op when the tracker is absent, so search works identically
 * with the script blocked, and nothing here can throw into the UI.
 */

export type SearchEvent =
  | "search_open"
  | "search_query"
  | "search_result_click"
  | "search_no_results";

type Props = Record<string, string | number | boolean>;

interface TrackerGlobal {
  webmasterid?: { track?: (event: string, props?: Props) => void };
  wmid?: { track?: (event: string, props?: Props) => void };
}

/** Bucket a length so even the size of a query is coarse rather than exact. */
function lengthBucket(n: number): string {
  if (n <= 2) return "1-2";
  if (n <= 5) return "3-5";
  if (n <= 10) return "6-10";
  if (n <= 20) return "11-20";
  return "21+";
}

function send(event: SearchEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  try {
    const g = window as unknown as TrackerGlobal;
    const track = g.webmasterid?.track ?? g.wmid?.track;
    if (typeof track !== "function") return;
    track(event, props);
  } catch {
    // Analytics must never break search.
  }
}

export function trackSearchOpen(source: "keyboard" | "click"): void {
  send("search_open", { source });
}

export function trackSearchQuery(queryLength: number, resultCount: number): void {
  send("search_query", {
    query_length: lengthBucket(queryLength),
    result_count: resultCount,
    has_results: resultCount > 0,
  });
}

export function trackSearchNoResults(queryLength: number, fuzzyTried: boolean): void {
  send("search_no_results", { query_length: lengthBucket(queryLength), fuzzy_tried: fuzzyTried });
}

export function trackSearchResultClick(group: string, rank: number, surface: "overlay" | "page"): void {
  send("search_result_click", { group, rank, surface });
}
