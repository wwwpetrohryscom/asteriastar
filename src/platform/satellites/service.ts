import { loadProduct, renderDeadline, type LoadOptions } from "@/platform/live-providers/client";
import { NO_VALUE_STATUSES, refreshStatus, type LiveEnvelope } from "@/platform/live-providers/envelope";
import { getLiveProduct, LIVE_PRODUCTS, LIVE_PROVIDERS, providerState, type LiveProviderDescriptor } from "@/platform/live-providers/registry";
import { getHealth, type ProviderHealth } from "@/platform/live-providers/health";
import { parseOem, type Ephemeris } from "@/platform/satellites/oem";
import { groundTrack, nodalPeriodMinutes, remainingCoverageHours, stateAt, type GroundTrackPoint, type SatelliteState } from "@/platform/satellites/ephemeris";
import { ecefToGeodetic, eme2000ToEcef } from "@/platform/satellites/frames";
import { findPasses, type Observer, type SatellitePass } from "@/platform/satellites/passes";

/**
 * The satellite service (Program CL).
 *
 * One satellite is served live, and that is a deliberate outcome rather than a starting point. The
 * ISS has an authoritative, documented, freely-usable operational ephemeris published by its own
 * operator. No other satellite does — the general catalogues of orbital elements are either behind
 * credentials whose terms forbid this use, or served by hosts that refuse automated access. So the
 * ISS is live and complete, and everything else is honestly absent.
 */

/** Fetch and parse the ISS ephemeris. Never throws; returns an envelope in every case. */
export function issEphemeris(opts: LoadOptions = {}): Promise<LiveEnvelope<Ephemeris>> {
  return loadProduct(
    "nasa:iss-ephemeris",
    (raw) => {
      const parsed = parseOem(raw);
      if (!parsed.ok) return { ok: false, problem: parsed.problem };
      return {
        ok: true,
        value: parsed.value,
        // The ephemeris is aged by OUR fetch, not by its own creation date: a file covering the
        // next fifteen days is not stale merely because it was generated three days ago. What
        // would make it stale is our copy being old, and that is what the fetch time measures.
        generatedAt: parsed.value.creationTime,
        validFrom: new Date(parsed.value.startMs).toISOString(),
        validUntil: new Date(parsed.value.stopMs).toISOString(),
      };
    },
    { deadlineMs: renderDeadline(), ...opts },
  );
}

export interface IssNow {
  state: SatelliteState;
  /** Nodal period measured from the ephemeris, minutes. */
  periodMinutes?: number;
  /** How much published trajectory remains ahead of now, hours. */
  coverageHours: number;
  /** The ground track either side of now. */
  track: GroundTrackPoint[];
  /** How many orbits the remaining ephemeris covers. */
  orbitsRemaining?: number;
}

/**
 * Where the ISS is at a given instant, with the context that makes the number meaningful.
 *
 * Returns null when the ephemeris does not cover the instant — which is a real state, not an error:
 * the file ends, and a position past its end would be a guess dressed as a measurement.
 */
export function issNow(env: LiveEnvelope<Ephemeris>, nowMs: number): IssNow | null {
  if (!env.data || NO_VALUE_STATUSES.has(env.status)) return null;
  const state = stateAt(env.data, nowMs);
  if (!state) return null;
  const periodMinutes = nodalPeriodMinutes(env.data);
  const coverageHours = remainingCoverageHours(env.data, nowMs);
  return {
    state,
    periodMinutes,
    coverageHours,
    // Roughly one orbit behind and one ahead, which is what a ground-track map wants to show.
    track: groundTrack(env.data, nowMs - 45 * 60_000, nowMs + 45 * 60_000, 60),
    orbitsRemaining: periodMinutes ? Math.floor((coverageHours * 60) / periodMinutes) : undefined,
  };
}

/** Passes for an explicit observer. Pure: the coordinates are arguments and are never retained. */
export function issPasses(env: LiveEnvelope<Ephemeris>, observer: Observer, fromMs: number, hours: number): SatellitePass[] {
  if (!env.data || NO_VALUE_STATUSES.has(env.status)) return [];
  return findPasses(env.data, observer, fromMs, fromMs + hours * 3_600_000);
}

/**
 * The slice of the ephemeris a browser needs to compute passes itself.
 *
 * This is what lets the passes page keep a reader's coordinates on their own device: the server
 * sends a window of state vectors, and the arithmetic happens locally. Sending the whole
 * fifteen-day file would be half a megabyte for a question that only needs the next day or two.
 */
export function ephemerisWindow(env: LiveEnvelope<Ephemeris>, fromMs: number, hours: number): { states: { t: number; p: [number, number, number]; v: [number, number, number] }[]; startMs: number; endMs: number } | null {
  if (!env.data) return null;
  const toMs = fromMs + hours * 3_600_000;
  const states = env.data.states
    .filter((s) => s.timeMs >= fromMs - 600_000 && s.timeMs <= toMs + 600_000)
    .map((s) => ({ t: s.timeMs, p: [s.position[0], s.position[1], s.position[2]] as [number, number, number], v: [s.velocity[0], s.velocity[1], s.velocity[2]] as [number, number, number] }));
  if (states.length < 8) return null;
  return { states, startMs: states[0].t, endMs: states[states.length - 1].t };
}

/**
 * Compare the frame transformation against the provider's own ascending-node longitudes.
 *
 * The ephemeris states, in its own comments, the Earth-fixed longitude of the ISS's first and last
 * ascending nodes as computed by NASA. Running our transform on the same file at the same epochs
 * and comparing is the only self-contained way to prove the coordinate chain is right rather than
 * merely plausible — a wrong precession direction produces a ground track displaced by a fraction
 * of a degree, which looks entirely reasonable until it is checked against something.
 */
export interface FrameCheck {
  node: "first" | "last";
  timeMs: number;
  expectedLongitudeDeg: number;
  computedLongitudeDeg: number;
  computedLatitudeDeg: number;
  longitudeErrorDeg: number;
  /** The along-track error the longitude discrepancy implies at the equator, metres. */
  groundErrorMetres: number;
}

export function verifyFrames(ephemeris: Ephemeris): FrameCheck[] {
  const out: FrameCheck[] = [];
  const nodes = ephemeris.ascendingNodes;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const state = stateAt(ephemeris, node.timeMs);
    if (!state) continue;
    const g = ecefToGeodetic(eme2000ToEcef(state.positionEci, node.timeMs));
    const error = ((g.longitudeDeg - node.longitudeDeg + 540) % 360) - 180;
    out.push({
      node: i === 0 ? "first" : "last",
      timeMs: node.timeMs,
      expectedLongitudeDeg: node.longitudeDeg,
      computedLongitudeDeg: g.longitudeDeg,
      computedLatitudeDeg: g.latitudeDeg,
      longitudeErrorDeg: error,
      // One degree of longitude at the equator is about 111.32 km.
      groundErrorMetres: Math.abs(error) * 111_320,
    });
  }
  return out;
}

/* ------------------------------------------------------------ provider view */

export interface SatelliteProviderReport {
  descriptor: LiveProviderDescriptor;
  state: ReturnType<typeof providerState>;
  products: { productKey: string; label: string; health?: ProviderHealth }[];
}

export function satelliteProviderReports(): SatelliteProviderReport[] {
  return LIVE_PROVIDERS.filter((p) => p.category === "orbital").map((descriptor) => {
    const products = LIVE_PRODUCTS.filter((p) => p.providerKey === descriptor.providerKey);
    return {
      descriptor,
      state: providerState(descriptor, products.map((p) => p.productKey)),
      products: products.map((p) => ({ productKey: p.productKey, label: p.label, health: getHealth(p.productKey) })),
    };
  });
}

export function reage<T extends object>(snapshot: T, nowIso: string): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(snapshot)) {
    const env = value as LiveEnvelope<unknown> | undefined;
    const product = env && typeof env === "object" && typeof env.productKey === "string" ? getLiveProduct(env.productKey) : undefined;
    out[key] = product && env ? refreshStatus(env, product.freshness, nowIso) : value;
  }
  return out as T;
}

export type { Ephemeris, Observer, SatellitePass, SatelliteState, GroundTrackPoint };
