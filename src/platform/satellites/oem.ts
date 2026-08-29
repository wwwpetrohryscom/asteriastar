import { line, num, timestamp } from "@/platform/live-providers/normalise";
import type { Vec3 } from "@/platform/satellites/frames";

/**
 * Parser for the CCSDS Orbit Ephemeris Message, as NASA publishes it for the ISS.
 *
 * NASA/JSC's Flight Operations Directorate publishes the station's operational trajectory as a
 * standard OEM: a header, a metadata block naming the reference frame and time system, and a few
 * thousand state vectors at four-minute spacing over fifteen days. This is not a two-line element
 * set and no SGP4 propagation is involved — it is the trajectory the flight controllers use,
 * distributed by the operator.
 *
 * The parser is strict about the two things that would be catastrophic to assume: the REFERENCE
 * FRAME and the TIME SYSTEM. A future file in a different frame, or in TAI rather than UTC, would
 * still parse as perfectly well-formed numbers and would place the station in the wrong place
 * without any other symptom. So both are read and checked, and a file that does not declare what
 * this code expects is rejected rather than interpreted.
 */

export interface StateVector {
  /** Epoch in UTC milliseconds. */
  timeMs: number;
  /** Position in the file's reference frame, kilometres. */
  position: Vec3;
  /** Velocity in the file's reference frame, kilometres per second. */
  velocity: Vec3;
}

/** An ascending-node crossing, as the file's own comments record it. */
export interface AscendingNode {
  /** Epoch of the crossing, UTC milliseconds. */
  timeMs: number;
  orbit?: number;
  /** The Earth-fixed longitude of the crossing, degrees east, as computed by NASA. */
  longitudeDeg: number;
}

export interface Ephemeris {
  objectName: string;
  objectId?: string;
  originator?: string;
  /** When the provider generated this file. */
  creationTime?: string;
  referenceFrame: string;
  timeSystem: string;
  centerName?: string;
  /** The usable span of the ephemeris, UTC milliseconds. */
  startMs: number;
  stopMs: number;
  /** State vectors in time order. */
  states: StateVector[];
  /** The ascending nodes the file states, used to verify the frame transformation. */
  ascendingNodes: AscendingNode[];
  /** Station mass in kilograms, when the file records it. */
  massKg?: number;
  /** Free-text comments the file carries, normalised. Never rendered as markup. */
  comments: string[];
}

export type OemParseResult = { ok: true; value: Ephemeris } | { ok: false; problem: string };

/** The frame and time system this code is written for. Anything else is refused, not guessed at. */
const EXPECTED_FRAMES = new Set(["EME2000", "J2000"]);
const EXPECTED_TIME_SYSTEM = "UTC";

/** `2026-08-28T15:03:31.758` with no zone marker — the OEM declares UTC in its metadata instead. */
function oemTime(value: string): number | undefined {
  const iso = timestamp(value);
  return iso ? Date.parse(iso) : undefined;
}

/**
 * `COMMENT ISS first asc. node: EPOCH = 2026-08-28T15:03:31.758 $ ORBIT = 2298 $ LAN(DEG) = 98.81658`
 *
 * These lines are the reason the frame transformation can be verified at all: they carry NASA's own
 * Earth-fixed longitude for a moment the ephemeris also covers, so the two can be compared.
 */
const NODE_RE = /asc\.\s*node\s*:\s*EPOCH\s*=\s*(\S+).*?LAN\(DEG\)\s*=\s*(-?[\d.]+)/i;
const ORBIT_RE = /ORBIT\s*=\s*(\d+)/i;

export function parseOem(raw: unknown): OemParseResult {
  if (typeof raw !== "string") return { ok: false, problem: "expected the OEM as text" };
  const lines = raw.split(/\r?\n/);
  if (!lines.some((l) => l.startsWith("CCSDS_OEM_VERS"))) {
    return { ok: false, problem: "response does not begin with a CCSDS_OEM_VERS header" };
  }

  const header = new Map<string, string>();
  const comments: string[] = [];
  const ascendingNodes: AscendingNode[] = [];
  const states: StateVector[] = [];
  let inMetadata = false;
  let seenMetadata = false;

  for (const rawLine of lines) {
    const l = rawLine.trim();
    if (!l) continue;

    if (l === "META_START") { inMetadata = true; continue; }
    if (l === "META_STOP") { inMetadata = false; seenMetadata = true; continue; }

    if (l.startsWith("COMMENT")) {
      const body = l.slice("COMMENT".length).trim();
      const node = NODE_RE.exec(body);
      if (node) {
        const timeMs = oemTime(node[1]);
        const longitudeDeg = num(node[2]);
        if (timeMs !== undefined && longitudeDeg !== undefined && longitudeDeg >= -360 && longitudeDeg <= 360) {
          ascendingNodes.push({ timeMs, longitudeDeg, orbit: num(ORBIT_RE.exec(body)?.[1]) });
        }
      }
      const text = line(body, 300);
      if (text) comments.push(text);
      continue;
    }

    const kv = /^([A-Z_0-9]+)\s*=\s*(.*)$/.exec(l);
    if (kv) { header.set(kv[1], kv[2].trim()); continue; }

    // Anything else inside the data section is a state vector: epoch then six numbers.
    if (!seenMetadata || inMetadata) continue;
    const parts = l.split(/\s+/);
    if (parts.length < 7) continue;
    const timeMs = oemTime(parts[0]);
    if (timeMs === undefined) continue;
    const n = parts.slice(1, 7).map((p) => num(p));
    if (n.some((v) => v === undefined)) continue;
    const [px, py, pz, vx, vy, vz] = n as number[];
    // A state vector inside the Earth is a parsing accident, not an orbit.
    if (Math.hypot(px, py, pz) < 6000) continue;
    states.push({ timeMs, position: [px, py, pz], velocity: [vx, vy, vz] });
  }

  const referenceFrame = header.get("REF_FRAME") ?? "";
  const timeSystem = header.get("TIME_SYSTEM") ?? "";
  if (!EXPECTED_FRAMES.has(referenceFrame)) {
    return { ok: false, problem: `reference frame is "${referenceFrame || "absent"}"; this integration only understands ${[...EXPECTED_FRAMES].join(" or ")}` };
  }
  if (timeSystem !== EXPECTED_TIME_SYSTEM) {
    return { ok: false, problem: `time system is "${timeSystem || "absent"}"; this integration only understands ${EXPECTED_TIME_SYSTEM}` };
  }
  if (states.length < 2) return { ok: false, problem: `only ${states.length} usable state vector(s) in the file` };

  states.sort((a, b) => a.timeMs - b.timeMs);

  const start = oemTime(header.get("USEABLE_START_TIME") ?? header.get("START_TIME") ?? "") ?? states[0].timeMs;
  const stop = oemTime(header.get("USEABLE_STOP_TIME") ?? header.get("STOP_TIME") ?? "") ?? states[states.length - 1].timeMs;
  const massComment = comments.find((c) => /^MASS\s*=/.test(c));

  return {
    ok: true,
    value: {
      objectName: header.get("OBJECT_NAME") ?? "unknown",
      objectId: header.get("OBJECT_ID"),
      originator: header.get("ORIGINATOR"),
      creationTime: timestamp(header.get("CREATION_DATE") ?? ""),
      referenceFrame,
      timeSystem,
      centerName: header.get("CENTER_NAME"),
      startMs: start,
      stopMs: stop,
      states,
      ascendingNodes,
      massKg: massComment ? num(massComment.split("=")[1]) : undefined,
      comments,
    },
  };
}
