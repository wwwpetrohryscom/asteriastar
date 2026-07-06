import Link from "next/link";
import type { NeighborNode } from "@/lib/graph-explorer/algorithms";

/** Renders a real breadth-first neighbourhood of an entity, grouped by distance. */
export function NeighborhoodPanel({ center, nodes }: { center: NeighborNode | null; nodes: NeighborNode[] }) {
  if (!center) return null;
  const byDist = new Map<number, NeighborNode[]>();
  for (const n of nodes) {
    const arr = byDist.get(n.distance) ?? [];
    arr.push(n);
    byDist.set(n.distance, arr);
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-sm text-muted">Neighbourhood of <Link href={center.href} className="font-semibold text-fg hover:text-halo">{center.name}</Link>, expanded over the real relations — {nodes.length} entities:</p>
      <div className="mt-4 space-y-4">
        {[...byDist.entries()].sort((a, b) => a[0] - b[0]).map(([dist, arr]) => (
          <div key={dist}>
            <div className="text-xs uppercase tracking-wide text-faint">{dist === 1 ? "Directly linked" : `${dist} hops away`} · {arr.length}</div>
            <ul className="mt-2 flex flex-wrap gap-2">
              {arr.map((n) => (
                <li key={n.id}><Link href={n.href} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{n.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Renders a real shortest path — a chain of genuine relations — between two entities. */
export function PathPanel({ path, from, to }: { path: NeighborNode[] | null; from: string; to: string }) {
  if (!path || path.length === 0) {
    return <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">No path found between {from} and {to} within the search depth.</div>;
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-sm text-muted">A shortest chain of {path.length - 1} relations from <span className="font-semibold text-fg">{path[0].name}</span> to <span className="font-semibold text-fg">{path[path.length - 1].name}</span>:</p>
      <ol className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {path.map((n, i) => (
          <li key={n.id} className="flex items-center gap-2">
            <Link href={n.href} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 font-medium text-fg hover:border-halo/50 hover:text-halo">{n.name}</Link>
            {i < path.length - 1 ? <span className="text-halo">→</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
