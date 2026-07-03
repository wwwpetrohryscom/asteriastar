import Link from "next/link";
import { constellationPath } from "@/lib/routes";
import type { ConstellationRecord } from "@/knowledge-graph/data/constellations-catalog/types";

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.7rem] text-muted">
      <span className="text-faint">{label}</span>
      <span className="text-fg">{value}</span>
    </span>
  );
}

export function ConstellationsCards({ records }: { records: ConstellationRecord[] }) {
  if (records.length === 0) {
    return <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted">No constellations match this view yet.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((c) => (
        <li key={c.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-baseline justify-between gap-2">
            <Link href={constellationPath(c.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{c.name}</Link>
            <span className="shrink-0 font-mono text-[0.7rem] text-faint">{c.abbr}</span>
          </div>
          <p className="mt-1 flex-1 text-sm text-muted">{c.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Fact label="Area" value={c.areaSqDeg != null ? `${c.areaSqDeg.toLocaleString()} deg²` : null} />
            <Fact label="Rank" value={c.rankByArea} />
            <Fact label="Season" value={c.season ? c.season.charAt(0).toUpperCase() + c.season.slice(1) : null} />
            {c.zodiac && <Fact label="Zodiac" value="Yes" />}
          </div>
        </li>
      ))}
    </ul>
  );
}
