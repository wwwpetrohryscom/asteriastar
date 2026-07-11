import Link from "next/link";
import type { ObsRecord } from "@/knowledge-graph/data/observatory-catalog/types";
import { KIND_LABEL } from "@/knowledge-graph/data/observatory-catalog/types";
import { observatoryPath } from "@/lib/routes";

export function ObsStatusPill({ status }: { status?: string }) {
  if (!status) return null;
  const planned = /planned/i.test(status);
  const ended = /retired|completed|deorbited|collapsed/i.test(status);
  const tone = planned ? "text-nasa border-nasa/40 bg-nasa/10"
    : ended ? "text-muted border-white/10 bg-white/[0.03]"
    : "text-success-strong border-success/25 bg-success/10";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${tone}`}>{status}</span>;
}

function meta(r: ObsRecord): string {
  switch (r.kind) {
    case "observatory": return [r.observatoryType, r.country].filter(Boolean).join(" · ");
    case "telescope": return [r.telescopeClass, r.apertureM ? `${r.apertureM} m` : undefined].filter(Boolean).join(" · ");
    case "space-telescope": return [r.bandSlugs?.[0] && bandName(r.bandSlugs[0]), r.firstLight].filter(Boolean).join(" · ");
    case "instrument": return r.observatoryType ?? "";
    case "survey": return r.operationalPeriod ?? "";
    case "band": return r.wavelength ?? "";
    case "site": return [r.country, r.altitudeM && `${r.altitudeM.toLocaleString()} m`].filter(Boolean).join(" · ");
    default: return KIND_LABEL[r.kind];
  }
}
function bandName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Card grid for observatory entities (observatories, telescopes, instruments, surveys…). */
export function ObsCards({ records }: { records: ObsRecord[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((r) => (
        <li key={r.id}>
          <Link href={observatoryPath(r.slug)} className="group flex h-full flex-col scientific-card p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nasa">{r.name}</h3>
              {r.status && <ObsStatusPill status={r.status} />}
            </div>
            {meta(r) && <p className="mt-1 text-xs uppercase tracking-wide text-faint">{meta(r)}</p>}
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{r.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
