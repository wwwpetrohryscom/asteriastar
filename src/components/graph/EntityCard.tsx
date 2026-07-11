import Link from "next/link";
import { ENTITY_TYPE_LABELS, entityGraphPath, type GraphEntity } from "@/knowledge-graph";

const DOMAIN_DOT: Record<GraphEntity["domain"], string> = {
  science: "bg-white",
  culture: "bg-white",
  astrology: "bg-nasa",
};

/** A compact card for a knowledge-graph entity, linking to its page. */
export function EntityCard({ entity }: { entity: GraphEntity }) {
  return (
    <Link
      href={entityGraphPath(entity)}
      className="group flex flex-col scientific-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${DOMAIN_DOT[entity.domain]}`} />
        <span className="text-xs uppercase tracking-wider text-faint">
          {ENTITY_TYPE_LABELS[entity.type]}
        </span>
      </div>
      <h3 className="mt-2 font-display text-lg font-semibold text-fg group-hover:text-nasa">
        {entity.name}
      </h3>
      {entity.description && (
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">
          {entity.description}
        </p>
      )}
    </Link>
  );
}
