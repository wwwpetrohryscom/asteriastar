import Link from "next/link";
import type { InstRecord } from "@/knowledge-graph/data/institutions-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/institutions-catalog/types";
import { institutionsPath } from "@/lib/routes";

/** A card grid of institution types and organizations. */
export function InstCards({ records }: { records: InstRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id} className="flex flex-col scientific-card p-5">
          <div className="flex items-start justify-between gap-2">
            <Link href={institutionsPath(r.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-white hover:underline">{r.name}</Link>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-faint">{KIND_LABEL[r.kind]}</span>
          </div>
          {r.kind === "org" && r.locationLabel ? <div className="mt-0.5 text-xs text-faint">{r.locationLabel}</div> : null}
          <p className="mt-2 flex-1 text-sm text-muted">{r.description}</p>
        </li>
      ))}
    </ul>
  );
}

/** A chip list of reused (existing) organizations, linking to their graph pages. */
export function OrgChips({ refs }: { refs: { id: string; name: string; href?: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {refs.map((m) => (
        <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>
      ))}
    </ul>
  );
}
