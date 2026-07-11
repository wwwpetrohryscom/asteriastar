import Link from "next/link";
import type { Ref } from "@/lib/assistant/retrieval";

/** A grounded concept comparison — the real shared connections of two entities. */
export function ComparePanel({ a, b, shared }: { a: Ref; b: Ref; shared: Ref[] }) {
  return (
    <div className="scientific-card p-5">
      <p className="text-sm text-muted">The common ground between <Link href={a.href} className="font-semibold text-fg hover:text-nasa">{a.name}</Link> and <Link href={b.href} className="font-semibold text-fg hover:text-nasa">{b.name}</Link> — the {shared.length} entities they both connect to in the graph:</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {shared.map((s) => <li key={s.id}><Link href={s.href} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{s.name}</Link></li>)}
      </ul>
    </div>
  );
}

/** Grounded related concepts — the real neighbours of an entity. */
export function RelatedPanel({ center, related }: { center: Ref; related: Ref[] }) {
  return (
    <div className="scientific-card p-5">
      <p className="text-sm text-muted">Concepts related to <Link href={center.href} className="font-semibold text-fg hover:text-nasa">{center.name}</Link> — its real neighbours in the graph:</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {related.map((s) => <li key={s.id}><Link href={s.href} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{s.name}</Link></li>)}
      </ul>
    </div>
  );
}

/** A grounded explanation — an entity, its description, its links, and its sources. */
export function ExplainPanel({ entity, description, sources, links }: { entity: Ref; description?: string; sources?: readonly string[]; links: { relation: string; other: Ref }[] }) {
  return (
    <div className="scientific-card p-5">
      <div className="flex items-center justify-between gap-2">
        <Link href={entity.href} className="font-display text-lg font-semibold text-fg hover:text-nasa">{entity.name}</Link>
        {sources?.length ? <span className="text-xs text-faint">Sources: {sources.join(", ")}</span> : null}
      </div>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
      {links.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {links.map((l) => <li key={l.other.id}><Link href={l.other.href} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{l.other.name}</Link></li>)}
        </ul>
      ) : null}
      <p className="mt-3 text-xs text-faint">Assembled entirely from the entity&apos;s own description, relations, and cited sources — nothing added.</p>
    </div>
  );
}
