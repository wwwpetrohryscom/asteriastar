import Link from "next/link";
import {
  ENTITY_TYPE_LABELS,
  GRAPH_VERSION_INFO,
  getRelationsForEntity,
  type GraphEntity,
} from "@/knowledge-graph";
import { DATASETS } from "@/lib/datasets";
import { datasetPath } from "@/lib/routes";

/**
 * "Data & provenance" — exposes an entity's machine-readable metadata: its
 * stable id, type/domain, relationship count, dataset membership, and the
 * (planned) API/download endpoints. Makes every entity self-documenting for
 * search engines, LLMs, researchers, and developers.
 */
export function EntityDataPanel({ entity }: { entity: GraphEntity }) {
  const relationCount = getRelationsForEntity(entity.id).length;
  const datasets = DATASETS.filter((d) => d.entityTypes.includes(entity.type));

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Stable ID", value: <code className="text-fg">{entity.id}</code> },
    { label: "Type", value: ENTITY_TYPE_LABELS[entity.type] },
    { label: "Domain", value: entity.domain },
    { label: "Relationships", value: relationCount },
    ...(entity.scientificName ? [{ label: "Scientific name", value: entity.scientificName }] : []),
    ...(entity.catalogNumbers?.length ? [{ label: "Catalog", value: entity.catalogNumbers.join(", ") }] : []),
    { label: "Graph version", value: GRAPH_VERSION_INFO.graphVersion },
  ];

  return (
    <section
      aria-labelledby="data-heading"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
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

      {datasets.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-xs uppercase tracking-wider text-faint">Dataset membership</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {datasets.map((d) => (
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
          <a href="/data/graph.json" className="text-nebula underline-offset-4 hover:underline">graph.json</a>{" "}
          ·{" "}
          <a href="/data/graph.jsonld" className="text-nebula underline-offset-4 hover:underline">graph.jsonld</a>
        </p>
        <p className="mt-1.5 text-xs text-faint">
          Planned API: <code>GET /api/v0/entities/{entity.id}</code>
        </p>
      </div>
    </section>
  );
}
