/**
 * The guarded fetch every live-provider client goes through.
 *
 * External data is the one thing on this platform that is neither reviewed nor committed, so
 * it is treated as hostile input: the host must be on an allowlist, the scheme must be HTTPS,
 * redirects are refused rather than followed, the response is capped in size and time, and the
 * body is parsed as JSON or plain text and nothing else. No provider markup is ever produced.
 *
 * It never throws. Every failure — DNS, timeout, HTTP status, size, content type, malformed
 * JSON — comes back as a typed failure with a normalised reason, because a provider being down
 * must never break a page.
 */

/** Hosts a live-provider client may talk to. Anything not listed here is refused before DNS. */
export const ALLOWED_PROVIDER_HOSTS: readonly string[] = [
  "services.swpc.noaa.gov", // NOAA Space Weather Prediction Center data services
  "api.nasa.gov", // NASA open APIs (DONKI and others; requires a key)
  "kauai.ccmc.gsfc.nasa.gov", // NASA CCMC DONKI web service
  "ssd-api.jpl.nasa.gov", // JPL Solar System Dynamics / CNEOS APIs
  "celestrak.org", // CelesTrak orbital elements
  "minorplanetcenter.net", // IAU Minor Planet Center machine-readable data files
  "nasa-public-data.s3.amazonaws.com", // NASA public-data store: the ISS operational ephemeris
  "eclipse.gsfc.nasa.gov", // NASA/GSFC Eclipse Web Site: the five-millennium eclipse catalogues
  "ll.thespacedevs.com", // Launch Library 2: the aggregated launch schedule
];

const ALLOWED_HOST_SET = new Set(ALLOWED_PROVIDER_HOSTS);

/** Hard ceiling on any single provider response. Above this we refuse rather than buffer. */
export const MAX_RESPONSE_BYTES = 3_000_000;

/** Hard ceiling on any single provider request. */
export const DEFAULT_TIMEOUT_MS = 8_000;

export type FetchFailureReason =
  | "blocked_host"
  | "bad_url"
  | "timeout"
  | "network"
  | "http_status"
  | "redirect"
  | "too_large"
  | "content_type"
  | "malformed";

export interface FetchSuccess<T> {
  ok: true;
  value: T;
  /** Real wall-clock time of the request, in milliseconds. */
  latencyMs: number;
  /** When the request completed (ISO 8601, UTC). */
  fetchedAt: string;
  /** The provider's own `Last-Modified`/`Date` header, when it sends one. */
  serverDate?: string;
  bytes: number;
}

export interface FetchFailure {
  ok: false;
  reason: FetchFailureReason;
  /** A short, normalised message. Never upstream HTML, never a stack trace. */
  message: string;
  latencyMs: number;
  fetchedAt: string;
  /** HTTP status, when the failure was an HTTP one. */
  status?: number;
}

export type FetchResult<T> = FetchSuccess<T> | FetchFailure;

/**
 * Validate a provider URL before it is used. Returns the parsed URL or the reason it was
 * refused. Exported so the validator can assert the allowlist statically over the client code.
 */
export function checkProviderUrl(url: string): { ok: true; url: URL } | { ok: false; reason: FetchFailureReason; message: string } {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, reason: "bad_url", message: "not a valid absolute URL" };
  }
  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "blocked_host", message: `scheme ${parsed.protocol} is not permitted; provider requests must be HTTPS` };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: "bad_url", message: "credentials in a provider URL are not permitted" };
  }
  if (parsed.port && parsed.port !== "443") {
    return { ok: false, reason: "blocked_host", message: `port ${parsed.port} is not permitted` };
  }
  if (!ALLOWED_HOST_SET.has(parsed.hostname)) {
    return { ok: false, reason: "blocked_host", message: `host ${parsed.hostname} is not on the provider allowlist` };
  }
  return { ok: true, url: parsed };
}

/** Trim an error to something safe to log and to show: no markup, no control characters, bounded. */
function normaliseMessage(input: unknown, max = 200): string {
  const raw = input instanceof Error ? input.message : String(input ?? "");
  // Strip C0/C1 control characters and angle brackets: the result is logged and may be shown,
  // and neither a terminal escape nor a fragment of upstream markup belongs in either place.
  return raw.replace(/[\u0000-\u001f\u007f-\u009f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) || "unknown error";
}

/**
 * Read a response body with a hard byte ceiling, so a provider that starts streaming hundreds
 * of megabytes cannot exhaust the function's memory. Returns null once the cap is passed.
 */
async function readCapped(res: Response, cap: number): Promise<{ text: string; bytes: number } | null> {
  const declared = Number(res.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > cap) return null;

  const body = res.body;
  if (!body) {
    const text = await res.text();
    const bytes = new TextEncoder().encode(text).length;
    return bytes > cap ? null : { text, bytes };
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      bytes += value.byteLength;
      if (bytes > cap) {
        await reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
  } finally {
    // The reader may already be released after a cancel; releasing twice is not an error
    // worth propagating out of a helper whose whole contract is "never throw".
    try { reader.releaseLock(); } catch { /* already released */ }
  }

  const merged = new Uint8Array(bytes);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.byteLength;
  }
  return { text: new TextDecoder("utf-8").decode(merged), bytes };
}

export interface ProviderFetchOptions {
  timeoutMs?: number;
  maxBytes?: number;
  /** Accepted top-level content types. Defaults to JSON. */
  accept?: "json" | "text";
}

/**
 * Fetch a provider URL and return parsed JSON, or a typed failure. Redirects are refused
 * (`redirect: "error"`), which is what stops an upstream 302 from moving the request to a host
 * the allowlist never approved.
 *
 * There are TWO places a request can fail, and both are caught: at the headers (DNS, connection,
 * timeout before a response line) and in the body (a timeout that fires mid-stream, a reset, a
 * truncated chunk). Missing the second is easy — the first `try` looks like it covers the request
 * — and it is the one a slow megabyte-scale response actually takes.
 */
export async function fetchProviderJson<T = unknown>(url: string, opts: ProviderFetchOptions = {}): Promise<FetchResult<T>> {
  const started = Date.now();
  const stamp = () => new Date().toISOString();

  const checked = checkProviderUrl(url);
  if (!checked.ok) {
    return { ok: false, reason: checked.reason, message: checked.message, latencyMs: 0, fetchedAt: stamp() };
  }

  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = opts.maxBytes ?? MAX_RESPONSE_BYTES;
  const accept = opts.accept ?? "json";

  let res: Response;
  try {
    res = await fetch(checked.url, {
      redirect: "error",
      signal: AbortSignal.timeout(timeoutMs),
      credentials: "omit",
      referrerPolicy: "no-referrer",
      headers: {
        Accept: accept === "json" ? "application/json" : "text/plain",
        "User-Agent": "AsteriaStar/1.0 (+https://asteriastar.com; scientific data platform)",
      },
    });
  } catch (err) {
    const latencyMs = Date.now() - started;
    const message = normaliseMessage(err);
    // AbortSignal.timeout aborts with a TimeoutError; a refused redirect surfaces as a
    // generic TypeError, so it is distinguished by message rather than by class.
    const reason: FetchFailureReason = /timeout|timed out|aborted/i.test(message)
      ? "timeout"
      : /redirect/i.test(message)
        ? "redirect"
        : "network";
    return { ok: false, reason, message, latencyMs, fetchedAt: stamp() };
  }

  const latencyMs = Date.now() - started;
  const fetchedAt = stamp();

  if (!res.ok) {
    return { ok: false, reason: "http_status", message: `provider returned HTTP ${res.status}`, status: res.status, latencyMs, fetchedAt };
  }

  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
  if (accept === "json" && contentType && !/(json|text\/plain)/.test(contentType)) {
    // A JSON endpoint answering with HTML is the classic signature of an error page or a
    // captive portal. Refusing it here is what stops upstream markup reaching a parser.
    return { ok: false, reason: "content_type", message: `expected JSON, provider sent ${contentType.split(";")[0]}`, latencyMs, fetchedAt };
  }

  let read: { text: string; bytes: number } | null;
  try {
    read = await readCapped(res, maxBytes);
  } catch (err) {
    // The body failed AFTER the headers arrived: a timeout that fired mid-stream, a reset
    // connection, a truncated chunk. `AbortSignal.timeout` covers the whole operation, not just
    // the headers, so this is the ordinary fate of a large response from a slow provider — and it
    // must come back as a typed failure like every other, never as a rejection.
    const message = normaliseMessage(err);
    const reason: FetchFailureReason = /timeout|timed out|aborted/i.test(message) ? "timeout" : "network";
    return { ok: false, reason, message: `response body failed mid-stream: ${message}`, latencyMs: Date.now() - started, fetchedAt };
  }
  if (!read) {
    return { ok: false, reason: "too_large", message: `response exceeded the ${maxBytes}-byte ceiling`, latencyMs, fetchedAt };
  }

  const serverDateHeader = res.headers.get("last-modified") ?? res.headers.get("date");
  const serverDate = serverDateHeader ? isoOrUndefined(serverDateHeader) : undefined;

  if (accept === "text") {
    return { ok: true, value: read.text as unknown as T, latencyMs, fetchedAt, serverDate, bytes: read.bytes };
  }

  try {
    return { ok: true, value: JSON.parse(read.text) as T, latencyMs, fetchedAt, serverDate, bytes: read.bytes };
  } catch (err) {
    return { ok: false, reason: "malformed", message: `response was not valid JSON: ${normaliseMessage(err, 80)}`, latencyMs, fetchedAt };
  }
}

/** Parse an HTTP-date into an ISO string, or undefined if it is not a date. */
function isoOrUndefined(value: string): string | undefined {
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t).toISOString() : undefined;
}
