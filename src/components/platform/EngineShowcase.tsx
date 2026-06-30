import Link from "next/link";
import { engine, ENGINE_MODULES } from "@/platform/data-engine";
import { entityGraphPath } from "@/knowledge-graph";

/**
 * Live demonstration of the Scientific Data Engine: the engine modules, the
 * graph-derived scientific queries (with real counts), and a traversal example.
 * Everything here is produced by the engine — no manual assembly.
 */
export function EngineShowcase() {
  const queries = engine.query.all().map((q) => engine.query.run(q.id)!);
  const unsupported = engine.query.unsupported();

  const startId = "space_telescope:james-webb-space-telescope";
  const traversal = engine.traversal.traverse(startId, { maxDepth: 2, domain: "scientific", maxNodes: 12 });

  return (
    <section aria-labelledby="engine-heading" className="space-y-6">
      <div>
        <h2 id="engine-heading" className="font-display text-2xl font-bold">Scientific Data Engine</h2>
        <p className="mt-2 max-w-2xl text-muted">
          The execution layer — {ENGINE_MODULES.length} pure, framework-independent
          modules. Every consumer resolves reality through the engine; nothing
          reads the graph directly.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {ENGINE_MODULES.map((m) => (
            <li key={m} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-xs text-muted">{m}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scientific queries */}
        <div>
          <h3 className="font-display text-lg font-semibold text-fg">Scientific queries</h3>
          <p className="mt-1 text-sm text-faint">Graph-derived, no hardcoded lists.</p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-white/5">
                {queries.map((q) => (
                  <tr key={q.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-4 py-2 text-muted">{q.label}</td>
                    <td className="px-4 py-2 text-right font-mono text-fg">{q.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-faint">
            Not implemented (would require measurement data we don&apos;t fabricate):{" "}
            {unsupported.map((u) => u.label).join(", ")}.
          </p>
        </div>

        {/* Traversal example */}
        <div>
          <h3 className="font-display text-lg font-semibold text-fg">Graph traversal</h3>
          <p className="mt-1 text-sm text-faint">
            Scientific walk from <span className="text-muted">{traversal?.start.name}</span> (depth 2).
          </p>
          <ul className="mt-3 space-y-1.5">
            {traversal?.nodes.slice(0, 10).map((n) => (
              <li key={n.entity.id} className="flex items-center gap-2 text-sm">
                <span className="w-6 shrink-0 text-right font-mono text-xs text-faint">{n.distance}</span>
                <Link href={entityGraphPath(n.entity)} className="text-muted transition hover:text-fg">{n.entity.name}</Link>
                {n.viaRelation && <span className="text-xs text-faint">· {n.viaRelation.replace(/_/g, " ")}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
