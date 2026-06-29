import Link from "next/link";
import {
  ENTITY_TYPE_LABELS,
  entityGraphPath,
  getRecommendations,
} from "@/knowledge-graph";

/**
 * Graph-driven "you might also explore" recommendations, each with an honest,
 * graph-derived reason (shared connection or type). Renders nothing if none.
 */
export function EntityRecommendations({
  entityId,
  title = "You might also explore",
}: {
  entityId: string;
  title?: string;
}) {
  const recs = getRecommendations(entityId, 6);
  if (recs.length === 0) return null;

  return (
    <section aria-labelledby="recs-heading">
      <h2 id="recs-heading" className="font-display text-xl font-semibold text-fg">
        {title}
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recs.map(({ entity, reason }) => (
          <li key={entity.id}>
            <Link
              href={entityGraphPath(entity)}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]"
            >
              <span className="text-xs uppercase tracking-wider text-faint">
                {ENTITY_TYPE_LABELS[entity.type]}
              </span>
              <span className="mt-1 font-display text-lg font-semibold text-fg group-hover:text-nebula">
                {entity.name}
              </span>
              <span className="mt-2 text-xs text-faint">{reason}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
