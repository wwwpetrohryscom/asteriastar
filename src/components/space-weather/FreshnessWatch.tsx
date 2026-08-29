"use client";

import { useEffect, useState } from "react";
import { classifyFreshness, LIVE_STATUS_LABEL, type FreshnessPolicy, type LiveDataStatus } from "@/platform/live-providers/envelope";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";

/**
 * A freshness badge that keeps telling the truth after the page is cached.
 *
 * The server computes a status when it renders. That HTML is then cached — by the framework's
 * incremental cache, by a CDN, and by the reader's own browser tab left open overnight — so by the
 * time anyone reads the badge, "Live" may be a statement about a moment that has passed. This
 * island re-evaluates the SAME pure function against the browser's clock, so a reading that was
 * live when generated correctly reads as delayed, and then as stale, without a reload.
 *
 * It renders the server's status first so hydration matches exactly, then corrects itself on mount
 * and once a minute after that. It announces only when the status actually changes, so a reader
 * using a screen reader is told that data went stale and is not told the same thing every minute.
 */

const STATUS_TONE: Record<LiveDataStatus, StatusTone> = {
  live: "verified-green",
  recent: "verified-green",
  delayed: "stale",
  forecast: "neutral",
  computed: "neutral",
  historical: "neutral",
  stale: "stale",
  unavailable: "unavailable",
  provider_error: "warning-red",
};

/** A status that describes an ageing measurement, and so is worth re-evaluating client-side. */
const AGEABLE: ReadonlySet<LiveDataStatus> = new Set<LiveDataStatus>(["live", "recent", "delayed", "stale"]);

export function FreshnessWatch({
  serverStatus,
  referenceIso,
  policy,
}: {
  serverStatus: LiveDataStatus;
  /** The timestamp the status is computed from — the provider's, or our fetch time. */
  referenceIso?: string;
  policy?: FreshnessPolicy;
}) {
  const [status, setStatus] = useState<LiveDataStatus>(serverStatus);
  const [corrected, setCorrected] = useState(false);

  // The policy is destructured into primitives so the effect's dependencies are values, not the
  // identity of an object the server rebuilds on every render.
  const basis = policy?.basis;
  const liveWithin = policy?.liveWithinSeconds;
  const recentWithin = policy?.recentWithinSeconds;
  const staleAfter = policy?.staleAfterSeconds;

  useEffect(() => {
    if (!referenceIso || !basis || liveWithin === undefined || recentWithin === undefined || staleAfter === undefined) return;
    if (!AGEABLE.has(serverStatus)) return;
    const active: FreshnessPolicy = { basis, liveWithinSeconds: liveWithin, recentWithinSeconds: recentWithin, staleAfterSeconds: staleAfter };

    const evaluate = () => {
      const next = classifyFreshness(active, referenceIso, new Date().toISOString());
      // State updaters must stay pure — React may call them twice — so the comparison and both
      // updates happen here, outside the updater.
      setStatus((previous) => (previous === next ? previous : next));
      setCorrected((was) => was || next !== serverStatus);
    };

    evaluate();
    const timer = setInterval(evaluate, 60_000);
    return () => clearInterval(timer);
  }, [referenceIso, basis, liveWithin, recentWithin, staleAfter, serverStatus]);

  return (
    <span className="inline-flex items-center">
      <StatusBadge tone={STATUS_TONE[status]}>{LIVE_STATUS_LABEL[status]}</StatusBadge>
      {/*
        A single polite live region that is EMPTY until the status genuinely changes. Wiring the
        badge itself as a live region would make a screen reader re-announce every reading on every
        render; this announces the one thing a reader needs to know, once, when it happens.
      */}
      <span role="status" aria-live="polite" className="sr-only">
        {corrected ? `Data status changed to ${LIVE_STATUS_LABEL[status].toLowerCase()}.` : ""}
      </span>
    </span>
  );
}
