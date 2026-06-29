import Link from "next/link";
import {
  ENTITY_TYPE_LABELS,
  entityGraphPath,
  getConnections,
  getEntityById,
  relationLabel,
} from "@/knowledge-graph";

const DOMAIN_DOT = {
  science: "bg-halo",
  culture: "bg-comet",
  astrology: "bg-gold",
} as const;

function PreviewCard({ id }: { id: string }) {
  const entity = getEntityById(id);
  if (!entity) return null;
  const connections = getConnections(entity.id).slice(0, 5);

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <p className="text-xs uppercase tracking-wider text-faint">
        {ENTITY_TYPE_LABELS[entity.type]}
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold text-fg">{entity.name}</h3>
      {entity.description && (
        <p className="mt-2 text-sm leading-relaxed text-muted">{entity.description}</p>
      )}
      <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
        {connections.map((c) => (
          <li key={`${c.relation.id}-${c.outgoing}`} className="flex items-baseline gap-2 text-sm">
            <span aria-hidden className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOMAIN_DOT[c.relation.domain === "editorial" ? "science" : c.relation.domain]}`} />
            <span className="text-faint">{relationLabel(c.relation.type, c.outgoing)}</span>
            <Link href={entityGraphPath(c.other)} className="text-fg underline-offset-4 transition hover:text-nebula hover:underline">
              {c.other.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={entityGraphPath(entity)}
        className="mt-5 text-sm font-medium text-nebula underline-offset-4 transition hover:underline"
      >
        Explore connections →
      </Link>
    </div>
  );
}

/** Homepage knowledge-graph preview: a few featured entities and their links. */
export function KnowledgeGraphPreview({ ids }: { ids: string[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {ids.map((id) => (
        <PreviewCard key={id} id={id} />
      ))}
    </div>
  );
}
