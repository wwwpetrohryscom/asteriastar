"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { bvToColor, projectRing, projectScene, radius3D, type Camera, type Scene3D } from "@/lib/universe-3d/projection3d";

/**
 * Interactive 3D viewer (Program BU) — progressive enhancement over the server-rendered StaticUniverse
 * SVG. Every point is a REAL measured position; the viewer only rotates, zooms, and filters the camera
 * over that data — it never generates a position. It renders on a 2D canvas (universally supported, no
 * WebGL dependency, build-safe). Before mount and when JavaScript is off, the static SVG `fallback`
 * shows instead, so the scene is always present. Rotation is manual; nothing auto-animates, so there is
 * nothing for reduced-motion to suppress, and the reduced-motion note is surfaced for clarity.
 */
export function UniverseViewer({
  scene,
  fallback,
  width = 720,
  height = 460,
}: {
  scene: Scene3D;
  fallback: React.ReactNode;
  width?: number;
  height?: number;
}) {
  // false during SSR/hydration and with JS off (so the static fallback shows), true on the client —
  // without a setState-in-effect. When false the server-rendered SVG remains the record of the scene.
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cam, setCam] = useState<Camera>(scene.camera);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const layers = useMemo(() => {
    const s = new Set<string>();
    for (const p of scene.points) if (p.layer) s.add(p.layer);
    return [...s];
  }, [scene.points]);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const visiblePoints = useMemo(
    () => scene.points.filter((p) => !p.layer || !hidden.has(p.layer)),
    [scene.points, hidden],
  );

  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // no 2D context ⇒ the static fallback remains the record
    const dpr = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#04060d";
    ctx.fillRect(0, 0, width, height);

    // reference rings
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1;
    for (const ring of scene.rings ?? []) {
      const { d } = projectRing(ring, cam, width, height);
      if (!d) continue;
      const path = new Path2D(d);
      ctx.stroke(path);
    }

    const projected = projectScene(visiblePoints, cam, width, height);
    const byId = new Map(projected.map((p) => [p.id, p]));

    // connectors
    ctx.strokeStyle = "rgba(138,180,255,0.30)";
    for (const s of scene.segments ?? []) {
      const a = byId.get(s.a.id);
      const b = byId.get(s.b.id);
      if (!a || !b) continue;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // points, far → near
    for (const p of projected) {
      ctx.beginPath();
      ctx.fillStyle = bvToColor(p.colorIndex);
      ctx.globalAlpha = 0.92;
      ctx.arc(p.sx, p.sy, radius3D(p), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // labels for the brightest
    const labelled = [...projected]
      .filter((p) => typeof p.magnitude === "number")
      .sort((a, b) => a.magnitude! - b.magnitude!)
      .slice(0, 10);
    ctx.fillStyle = "rgba(223,232,255,0.8)";
    ctx.font = "10px system-ui, sans-serif";
    for (const p of labelled) ctx.fillText(p.name, p.sx + 5, p.sy - 4);
  }, [isClient, cam, visiblePoints, scene.segments, scene.rings, width, height]);

  if (!isClient) return <>{fallback}</>;

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setCam((c) => ({ ...c, yaw: c.yaw + dx * 0.01, pitch: Math.max(-1.5, Math.min(1.5, c.pitch + dy * 0.01)) }));
  };
  const onUp = () => (drag.current = null);
  const onWheel = (e: React.WheelEvent) => {
    setCam((c) => ({ ...c, distance: Math.max(0.05, c.distance * (e.deltaY > 0 ? 1.1 : 0.9)) }));
  };

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#04060d]">
        <canvas
          ref={canvasRef}
          className="block w-full cursor-grab touch-none active:cursor-grabbing"
          style={{ height: "auto" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onWheel={onWheel}
          role="img"
          aria-label="Interactive projection of measured positions — drag to rotate, scroll to zoom. An accessible data table of the same objects follows."
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60">
        <span>Drag to rotate · scroll to zoom</span>
        <button
          type="button"
          className="rounded-md border border-white/15 px-2 py-0.5 text-white/70 hover:bg-white/5"
          onClick={() => setCam(scene.camera)}
        >
          Reset view
        </button>
        {layers.map((l) => (
          <label key={l} className="inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={!hidden.has(l)}
              onChange={() =>
                setHidden((h) => {
                  const n = new Set(h);
                  if (n.has(l)) n.delete(l);
                  else n.add(l);
                  return n;
                })
              }
            />
            {l}
          </label>
        ))}
      </div>
      {scene.coverageNote ? <p className="mt-2 text-xs text-white/50">{scene.coverageNote}</p> : null}
    </div>
  );
}
