import Link from "next/link";
import { constellationPath } from "@/lib/routes";
import type { ConstellationRecord } from "@/knowledge-graph/data/constellations-catalog/types";

const HEMI_LABEL: Record<string, string> = { northern: "Northern", southern: "Southern", equatorial: "Equatorial" };

export function ConstellationsTable({ records }: { records: ConstellationRecord[] }) {
  if (records.length === 0) {
    return <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted">No constellations match this view yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-faint">
            <th scope="col" className="px-4 py-3 font-medium">Constellation</th>
            <th scope="col" className="px-4 py-3 font-medium">Abbr</th>
            <th scope="col" className="px-4 py-3 font-medium">Hemisphere</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Area</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Rank</th>
            <th scope="col" className="px-4 py-3 font-medium">Season</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.map((c) => (
            <tr key={c.id} className="transition hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <Link href={constellationPath(c.slug)} className="font-medium text-fg underline-offset-4 hover:text-nebula hover:underline">{c.name}</Link>
                {c.meaning && <span className="block text-xs text-faint">{c.meaning}</span>}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{c.abbr}</td>
              <td className="px-4 py-3 text-muted">{c.hemisphere ? HEMI_LABEL[c.hemisphere] : "—"}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-fg">{c.areaSqDeg != null ? `${c.areaSqDeg.toLocaleString()} deg²` : "—"}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-muted">{c.rankByArea ?? "—"}</td>
              <td className="px-4 py-3 text-muted">{c.season ? c.season.charAt(0).toUpperCase() + c.season.slice(1) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
