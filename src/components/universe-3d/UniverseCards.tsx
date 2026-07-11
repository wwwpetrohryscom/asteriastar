import Link from "next/link";
import { COVERAGE_LABEL, type UniverseSceneRecord } from "@/knowledge-graph/data/webgl-universe-catalog";
import { universeScenePath } from "@/lib/routes";

/** Cards for the 3D Universe hub — each scene with its honest coverage mode and whether it is interactive. */
export function UniverseCards({ scenes }: { scenes: UniverseSceneRecord[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {scenes.map((r) => (
        <li key={r.id}>
          <Link
            href={universeScenePath(r.slug)}
            className="group flex h-full flex-col scientific-card p-5 transition hover:border-white/25"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-fg group-hover:text-nasa">{r.name}</h3>
              {r.interactive ? (
                <span className="rounded-full border border-nasa/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-nasa">Interactive 3D</span>
              ) : (
                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-faint">Descriptive</span>
              )}
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{r.description}</p>
            <p className="mt-3 text-xs text-faint">{COVERAGE_LABEL[r.coverageMode]}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
