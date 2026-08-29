import type { FetchFailureReason } from "@/platform/live-providers/fetch";

/**
 * Runtime health of the live providers.
 *
 * Every counter here is a real measurement of a real request made by this process. There is no
 * reliability score, no uptime percentage and no historical series: this deployment does not
 * retain operational telemetry, so inventing a long-run figure from a process that may be
 * seconds old would be exactly the kind of confident-sounding fiction the honesty model exists
 * to prevent.
 *
 * The consequence is stated wherever these numbers are shown: they describe *this* runtime
 * instance since it started, and a serverless cold start resets them. The Data Health dashboard
 * therefore probes providers live rather than reading a stored history.
 */

export type SchemaState =
  | "ok" // the response matched the shape the client expects
  | "unknown" // no successful fetch yet in this instance
  | "changed"; // the response parsed as JSON but not into the expected shape

export interface ProviderHealth {
  productKey: string;
  providerKey: string;
  lastAttemptAt?: string;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  lastFailureReason?: FetchFailureReason;
  lastFailureMessage?: string;
  /** Latency of the most recent completed request, in milliseconds. */
  lastLatencyMs?: number;
  /** Bytes of the most recent successful response. */
  lastBytes?: number;
  consecutiveFailures: number;
  successCount: number;
  failureCount: number;
  schemaState: SchemaState;
}

const health = new Map<string, ProviderHealth>();

function ensure(productKey: string, providerKey: string): ProviderHealth {
  let h = health.get(productKey);
  if (!h) {
    h = { productKey, providerKey, consecutiveFailures: 0, successCount: 0, failureCount: 0, schemaState: "unknown" };
    health.set(productKey, h);
  }
  return h;
}

export function recordAttempt(productKey: string, providerKey: string, atIso: string): void {
  const h = ensure(productKey, providerKey);
  h.lastAttemptAt = atIso;
}

export function recordSuccess(productKey: string, providerKey: string, atIso: string, latencyMs: number, bytes: number): void {
  const h = ensure(productKey, providerKey);
  h.lastSuccessAt = atIso;
  h.lastLatencyMs = latencyMs;
  h.lastBytes = bytes;
  h.consecutiveFailures = 0;
  h.successCount += 1;
  h.schemaState = "ok";
}

export function recordFailure(productKey: string, providerKey: string, atIso: string, reason: FetchFailureReason, message: string, latencyMs: number): void {
  const h = ensure(productKey, providerKey);
  h.lastFailureAt = atIso;
  h.lastFailureReason = reason;
  h.lastFailureMessage = message;
  h.lastLatencyMs = latencyMs;
  h.consecutiveFailures += 1;
  h.failureCount += 1;
}

/**
 * Record that a response arrived and parsed as JSON but did not match the expected shape. This
 * is tracked apart from a transport failure because it means something different: the provider
 * is up and the integration is out of date.
 */
export function recordSchemaChange(productKey: string, providerKey: string, atIso: string, detail: string): void {
  const h = ensure(productKey, providerKey);
  h.lastFailureAt = atIso;
  h.lastFailureReason = "malformed";
  h.lastFailureMessage = detail;
  h.consecutiveFailures += 1;
  h.failureCount += 1;
  h.schemaState = "changed";
}

export function getHealth(productKey: string): ProviderHealth | undefined {
  return health.get(productKey);
}

export function allHealth(): ProviderHealth[] {
  return [...health.values()].sort((a, b) => a.productKey.localeCompare(b.productKey));
}

/** Reset everything. Used by tests; there is no production caller. */
export function clearHealth(): void {
  health.clear();
}
