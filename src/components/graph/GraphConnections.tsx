import Link from "next/link";
import {
  DOMAIN_LABELS,
  entityGraphPath,
  getConnectionsByDomain,
  relationLabel,
  type Connection,
} from "@/knowledge-graph";

function ConnectionItem({ connection }: { connection: Connection }) {
  const { relation, other, outgoing } = connection;
  return (
    <li className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-faint">
        {relationLabel(relation.type, outgoing)}
      </span>
      <Link
        href={entityGraphPath(other)}
        className="font-medium text-fg underline-offset-4 transition hover:text-nebula hover:underline"
      >
        {other.name}
      </Link>
      {relation.note && <span className="text-xs text-faint">{relation.note}</span>}
    </li>
  );
}

function Group({
  title,
  connections,
  variant,
  note,
}: {
  title: string;
  connections: Connection[];
  variant: "science" | "culture" | "astrology";
  note?: string;
}) {
  if (connections.length === 0) return null;
  const styles = {
    science: { box: "border-white/10 bg-white/[0.02]", head: "text-halo" },
    culture: { box: "border-white/10 bg-white/[0.02]", head: "text-comet" },
    astrology: { box: "border-gold/25 bg-gold/[0.05]", head: "text-gold" },
  }[variant];
  return (
    <div className={`rounded-2xl border p-5 ${styles.box}`}>
      <h3 className={`font-display text-sm font-semibold ${styles.head}`}>{title}</h3>
      {note && <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>}
      <ul className="mt-3 space-y-3">
        {connections.map((c) => (
          <ConnectionItem key={`${c.relation.id}-${c.outgoing}`} connection={c} />
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders a graph entity's connections in three strictly-separate, labeled
 * groups (Scientific / Cultural & mythological / Astrology). Direction-aware
 * labels keep incoming relations readable. Returns null if there are none.
 */
export function GraphConnections({ entityId }: { entityId: string }) {
  const { science, culture, astrology } = getConnectionsByDomain(entityId);
  if (science.length === 0 && culture.length === 0 && astrology.length === 0) {
    return null;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Group title={DOMAIN_LABELS.science} connections={science} variant="science" />
      <Group title={DOMAIN_LABELS.culture} connections={culture} variant="culture" />
      <Group
        title={DOMAIN_LABELS.astrology}
        connections={astrology}
        variant="astrology"
        note="Astrological associations are symbolic, interpretive tradition — not scientific claims."
      />
    </div>
  );
}
