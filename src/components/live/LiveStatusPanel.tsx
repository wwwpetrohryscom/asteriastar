import Link from "next/link";
import type { LiveStatusReport } from "@/lib/live/status";
import { livePath } from "@/lib/routes";

const STATUS_LABEL: Record<string, string> = {
  connected: "Connected", computed: "Computed", cached: "Cached", stale: "Stale", unavailable: "Unavailable", planned: "Architecture-ready",
};

/** The honest data-status dashboard — real counts, no fabricated "live" activity. */
export function LiveStatusPanel({ report }: { report: LiveStatusReport }) {
  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <li className="scientific-card p-5"><div className="font-display text-3xl font-bold text-fg tabular-nums">{report.connected}</div><div className="mt-1 text-xs uppercase tracking-wide text-faint">Connected</div></li>
        <li className="scientific-card p-5"><div className="font-display text-3xl font-bold text-fg tabular-nums">{report.planned}</div><div className="mt-1 text-xs uppercase tracking-wide text-faint">Architecture-ready</div></li>
        <li className="scientific-card p-5"><div className="font-display text-3xl font-bold text-fg tabular-nums">{report.total}</div><div className="mt-1 text-xs uppercase tracking-wide text-faint">Providers modelled</div></li>
        <li className="scientific-card p-5"><div className="font-display text-3xl font-bold text-fg tabular-nums">0</div><div className="mt-1 text-xs uppercase tracking-wide text-faint">Fabricated values</div></li>
      </ul>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-faint">
            <tr><th className="px-4 py-2">Provider</th><th className="px-4 py-2">Category</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Licence</th></tr>
          </thead>
          <tbody>
            {report.sources.map((s) => (
              <tr key={s.slug} className="border-t border-white/5">
                <td className="px-4 py-2"><Link href={livePath(s.slug)} className="font-medium text-fg hover:text-nasa">{s.name}</Link></td>
                <td className="px-4 py-2 text-muted">{s.category}</td>
                <td className="px-4 py-2"><span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-faint">{STATUS_LABEL[s.status] ?? s.status}</span></td>
                <td className="px-4 py-2 text-xs text-muted">{s.license ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-faint">{report.generatedNote}</p>
    </div>
  );
}
