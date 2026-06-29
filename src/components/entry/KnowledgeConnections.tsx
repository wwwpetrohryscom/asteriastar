import Link from "next/link";
import { getEntityForEntry } from "@/content/entries";
import {
  DOMAIN_LABELS,
  RELATION_LABELS,
  getConnectionsByDomain,
  type Connection,
} from "@/knowledge-graph";
import type { Entry } from "@/lib/content/entry-types";

function ConnectionItem({ connection }: { connection: Connection }) {
  const { relation, other } = connection;
  return (
    <li className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-faint">
        {RELATION_LABELS[relation.type]}
      </span>
      {other.entryPath ? (
        <Link
          href={other.entryPath}
          className="font-medium text-fg underline-offset-4 transition hover:text-nebula hover:underline"
        >
          {other.name}
        </Link>
      ) : (
        <span className="font-medium text-fg">{other.name}</span>
      )}
      {relation.note && (
        <span className="text-xs text-faint">{relation.note}</span>
      )}
    </li>
  );
}

function ConnectionGroup({
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
          <ConnectionItem key={c.relation.id} connection={c} />
        ))}
      </ul>
    </div>
  );
}

/**
 * "Knowledge connections" — an entry's links across the knowledge graph,
 * grouped into strictly separate sections so scientific, cultural, and
 * astrological connections are never visually mixed. Renders nothing if the
 * entry has no graph entity or no connections.
 */
export function KnowledgeConnections({ entry }: { entry: Entry }) {
  const entity = getEntityForEntry(entry);
  if (!entity) return null;

  const { science, culture, astrology } = getConnectionsByDomain(entity.id);
  if (science.length === 0 && culture.length === 0 && astrology.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="kg-heading">
      <h2 id="kg-heading" className="font-display text-xl font-semibold text-fg">
        Knowledge connections
      </h2>
      <p className="mt-1 text-sm text-faint">
        How this connects across Asteria Star — scientific, cultural, and
        astrological links are kept separate.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ConnectionGroup
          title={DOMAIN_LABELS.science}
          connections={science}
          variant="science"
        />
        <ConnectionGroup
          title={DOMAIN_LABELS.culture}
          connections={culture}
          variant="culture"
        />
        <ConnectionGroup
          title={DOMAIN_LABELS.astrology}
          connections={astrology}
          variant="astrology"
          note="Astrological associations are symbolic, interpretive tradition — not scientific claims."
        />
      </div>
    </section>
  );
}
