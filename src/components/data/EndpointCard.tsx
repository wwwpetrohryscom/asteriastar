import { StatusBadge } from "@/components/data/StatusBadge";
import type { EndpointDef } from "@/platform/open-data/endpoints";

/**
 * Renders one API endpoint: method + path, status, description, its parameter
 * table, an honest example (implemented endpoints only), and the response shape.
 */
export function EndpointCard({ endpoint }: { endpoint: EndpointDef }) {
  const impl = endpoint.status === "implemented";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-300">
            {endpoint.method}
          </span>
          <span className="text-fg">{endpoint.path}</span>
        </div>
        <StatusBadge status={impl ? "implemented" : "planned"} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{endpoint.description}</p>

      {endpoint.params.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-faint">
                <th className="pb-2 pr-4 font-medium">Parameter</th>
                <th className="pb-2 pr-4 font-medium">In</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {endpoint.params.map((p) => (
                <tr key={p.name} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-fg">
                    {p.name}
                    {p.required && <span className="ml-1 text-rose-300" title="required">*</span>}
                  </td>
                  <td className="py-2 pr-4 text-xs text-faint">{p.in}</td>
                  <td className="py-2 pr-4 text-xs text-faint">{p.type}</td>
                  <td className="py-2 text-xs text-muted">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">Returns</p>
          <p className="mt-1 font-mono text-xs text-muted">{endpoint.returns}</p>
        </div>
        {impl && endpoint.example && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">Try it</p>
            <a
              href={endpoint.example}
              className="mt-1 block break-all rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-xs text-nebula underline-offset-4 hover:underline"
            >
              {endpoint.example}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
