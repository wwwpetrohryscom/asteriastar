/**
 * Normalisation of values that arrive from an external provider.
 *
 * React escapes text on render, so this is not the last line of defence against injection — it is
 * the first, and it exists for a second reason too: a provider string can be megabytes long, can
 * carry control characters that corrupt a log line, and can carry a number that is a string, a
 * null, or NaN. Everything from a provider passes through here before it becomes a typed value,
 * so the rest of the codebase can treat live data like any other data.
 *
 * No function here ever invents a value. Anything that cannot be normalised comes back
 * `undefined`, which the callers turn into an absent field rather than a zero.
 */

/** Longest provider string kept. Beyond this a message is truncated with an explicit marker. */
const MAX_TEXT = 4000;

/**
 * Clean a provider string: strip C0/C1 control characters (bar the newlines and tabs that give
 * a forecaster's message its shape), normalise line endings, collapse runs of blank lines, and
 * bound the length. Returns undefined for anything that is not a non-empty string.
 */
export function text(value: unknown, maxLength = MAX_TEXT): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!cleaned) return undefined;
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength)}…[truncated]` : cleaned;
}

/** A single-line provider string: as `text`, with every run of whitespace collapsed to a space. */
export function line(value: unknown, maxLength = 300): string | undefined {
  const t = text(value, maxLength * 4);
  if (!t) return undefined;
  const collapsed = t.replace(/\s+/g, " ").trim();
  return collapsed.length > maxLength ? `${collapsed.slice(0, maxLength)}…` : collapsed;
}

/**
 * A finite number from a provider. Accepts a number or a numeric string, because real feeds mix
 * the two in the same document. Rejects NaN, ±Infinity, booleans and null: a value we cannot
 * trust as a number must be absent, not zero.
 */
export function num(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

/** A finite number constrained to a physically-possible range; outside it, undefined. */
export function boundedNum(value: unknown, min: number, max: number): number | undefined {
  const n = num(value);
  if (n === undefined) return undefined;
  return n >= min && n <= max ? n : undefined;
}

/**
 * An ISO-8601 UTC timestamp from a provider.
 *
 * SWPC and DONKI both publish times that are UTC but not always marked as such: SWPC writes
 * `2026-08-29T14:27:00` with no zone, DONKI writes `2026-08-29T14:27Z` with no seconds, and the
 * alert stream writes `2026-08-29 11:42:21.657`. All three are UTC by documentation. A zoneless
 * string is therefore read as UTC explicitly rather than left to the runtime's local zone, which
 * would silently shift every timestamp by the deployment region's offset.
 */
export function timestamp(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const raw = value.trim();
  if (!raw) return undefined;

  // Normalise "YYYY-MM-DD hh:mm:ss[.sss]" to ISO, then attach Z if no zone is present.
  let candidate = raw.replace(" ", "T");
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(candidate);
  if (!hasZone) candidate = `${candidate}Z`;

  const ms = Date.parse(candidate);
  if (!Number.isFinite(ms)) return undefined;

  // A timestamp outside a plausible window for operational data is a parsing accident, not a
  // datum: 1990 predates every feed used here, and 2100 is not a real observation time.
  const year = new Date(ms).getUTCFullYear();
  if (year < 1990 || year > 2100) return undefined;

  return new Date(ms).toISOString();
}

/** A provider array, or an empty array. Never null, never a non-array coerced into one. */
export function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** A plain object from a provider, or undefined. */
export function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
}

/**
 * A GOES/DONKI flare class designation such as "M2.4" or "X1". Rejects anything that is not one:
 * the class letter drives how a flare is described, so an unrecognised string must not reach a
 * page as if it were a classification.
 */
export function flareClass(value: unknown): string | undefined {
  const l = line(value, 12);
  if (!l) return undefined;
  return /^[ABCMX]\d{1,2}(\.\d)?$/i.test(l) ? l.toUpperCase() : undefined;
}
