import Link from "next/link";
import type { GraphStatistics } from "@/lib/graph-explorer/algorithms";

/** Renders the REAL graph statistics — every number counted live from the actual knowledge graph. */
export function GraphStatsPanel({ stats }: { stats: GraphStatistics }) {
  const cards = [
    { label: "Entities", value: stats.entityCount.toLocaleString() },
    { label: "Relations", value: stats.relationCount.toLocaleString() },
    { label: "Entity types", value: stats.typeCount.toLocaleString() },
    { label: "Average links / entity", value: stats.averageDegree.toFixed(2) },
  ];
  return (
    <div className="space-y-8">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label} className="scientific-card p-5">
            <div className="font-display text-3xl font-bold text-fg tabular-nums">{c.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-faint">{c.label}</div>
          </li>
        ))}
      </ul>
      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="mostconn">
          <h3 id="mostconn" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Most-connected entities</h3>
          <ol className="mt-3 space-y-1.5">
            {stats.mostConnected.map((m) => (
              <li key={m.id} className="flex items-baseline justify-between gap-3 text-sm">
                <Link href={m.href} className="truncate font-medium text-fg hover:text-white">{m.name}</Link>
                <span className="shrink-0 tabular-nums text-faint">{m.degree.toLocaleString()} links</span>
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="toptypes">
          <h3 id="toptypes" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Largest entity types</h3>
          <ol className="mt-3 space-y-1.5">
            {stats.topTypes.map((t) => (
              <li key={t.type} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-muted">{t.label}</span>
                <span className="shrink-0 tabular-nums text-faint">{t.count.toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <p className="text-xs text-faint">Across {stats.byDomain.map((d) => `${d.count.toLocaleString()} ${d.domain}`).join(" · ")} entities. Every figure is counted live from the real graph.</p>
    </div>
  );
}
