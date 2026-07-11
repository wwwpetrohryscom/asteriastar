import Link from "next/link";
import type { ResolvedEntity } from "@/platform/data-engine";
import { datasetPath } from "@/lib/routes";

/**
 * "Data & provenance" — exposes an entity's machine-readable metadata: its
 * stable id, type/domain, relationship count, dataset membership, and the
 * (planned) API/download endpoints. Driven entirely by the Scientific Data
 * Engine's resolved entity — no manual assembly, no graph internals.
 */
export function EntityDataPanel({ resolved }: { resolved: ResolvedEntity }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Stable ID", value: <code className="text-fg">{resolved.id}</code> },
    { label: "Type", value: resolved.typeLabel },
    { label: "Domain", value: resolved.domainLabel },
    { label: "Relationships", value: resolved.relationCount },
    ...(resolved.scientificName ? [{ label: "Scientific name", value: resolved.scientificName }] : []),
    ...(resolved.catalogNumbers.length ? [{ label: "Catalog", value: resolved.catalogNumbers.join(", ") }] : []),
    { label: "Graph version", value: resolved.version.graphVersion },
  ];

  return (
    <section
      aria-labelledby="data-heading"
      className="scientific-card p-5"
    >
      <h2 id="data-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">
        Data &amp; provenance
      </h2>
      <dl className="mt-3 divide-y divide-white/5">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between gap-4 py-2 text-sm">
            <dt className="text-faint">{r.label}</dt>
            <dd className="text-right font-medium text-fg">{r.value}</dd>
          </div>
        ))}
      </dl>

      {resolved.datasets.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-xs uppercase tracking-wider text-faint">Dataset membership</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {resolved.datasets.map((d) => (
              <li key={d.slug}>
                <Link href={datasetPath(d.slug)} className="text-sm text-muted underline-offset-4 transition hover:text-fg hover:underline">
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-xs uppercase tracking-wider text-faint">Open data</p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          In the graph export:{" "}
          <a href="/data/graph.json" className="text-nasa underline-offset-4 hover:underline">graph.json</a>{" "}
          ·{" "}
          <a href="/data/graph.jsonld" className="text-nasa underline-offset-4 hover:underline">graph.jsonld</a>
        </p>
        <p className="mt-1.5 text-xs text-faint">
          Planned API: <code>GET /api/v0/entities/{resolved.id}</code>
        </p>
      </div>
    </section>
  );
}
