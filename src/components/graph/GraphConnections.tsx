import Link from "next/link";
import {
  FACET_LABELS,
  FACET_ORDER,
  entityGraphPath,
  getConnections,
  relationFacet,
  relationLabel,
  type Connection,
  type ConnectionFacet,
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
  facet,
  connections,
}: {
  facet: ConnectionFacet;
  connections: Connection[];
}) {
  if (connections.length === 0) return null;
  const astrology = facet === "astrology";
  const head =
    astrology ? "text-gold" : facet === "cultural" ? "text-comet" : "text-halo";
  const box = astrology
    ? "border-gold/25 bg-gold/[0.05]"
    : "border-white/10 bg-white/[0.02]";
  // Show at most a generous number per group to keep pages readable.
  const shown = connections.slice(0, 24);
  return (
    <div className={`rounded-2xl border p-5 ${box}`}>
      <h3 className={`font-display text-sm font-semibold ${head}`}>{FACET_LABELS[facet]}</h3>
      {astrology && (
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Astrological associations are symbolic, interpretive tradition — not
          scientific claims.
        </p>
      )}
      <ul className="mt-3 space-y-3">
        {shown.map((c) => (
          <ConnectionItem key={`${c.relation.id}-${c.outgoing}`} connection={c} />
        ))}
      </ul>
      {connections.length > shown.length && (
        <p className="mt-3 text-xs text-faint">
          +{connections.length - shown.length} more
        </p>
      )}
    </div>
  );
}

/**
 * Renders an entity's connections in strictly-separate, labeled facet groups
 * (Scientific / Observational / Mission / Discovery / Related / Cultural /
 * Astrology) — direction-aware, never mixing science with interpretive links.
 * Returns null when there are no connections.
 */
export function GraphConnections({ entityId }: { entityId: string }) {
  const connections = getConnections(entityId);
  if (connections.length === 0) return null;

  const byFacet = new Map<ConnectionFacet, Connection[]>();
  for (const c of connections) {
    const facet = relationFacet(c.relation.domain, c.relation.type);
    if (!byFacet.has(facet)) byFacet.set(facet, []);
    byFacet.get(facet)!.push(c);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {FACET_ORDER.map((facet) => (
        <Group key={facet} facet={facet} connections={byFacet.get(facet) ?? []} />
      ))}
    </div>
  );
}
