import type { ReactNode } from "react";

export type Stat = { label: string; value: ReactNode; unit?: string; hint?: string };

/**
 * Premium statistic cards (NASA-style): large values, quiet labels, generous
 * spacing. Replaces cramped data tables. Empty/undefined values are dropped.
 */
export function StatGrid({
  stats,
  heading,
  className = "",
}: {
  stats: Stat[];
  heading?: string;
  className?: string;
}) {
  const shown = stats.filter((s) => s.value !== undefined && s.value !== null && s.value !== "");
  if (shown.length === 0) return null;

  return (
    <section className={className} aria-label={heading ?? "Key figures"}>
      {heading && (
        <h2 className="mb-6 flex items-center gap-2.5 font-display text-2xl font-bold text-fg sm:text-3xl">
          <span aria-hidden className="inline-block h-4 w-1 rounded-full bg-nasa-red" />
          {heading}
        </h2>
      )}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((s, i) => (
          <div
            key={i}
            className="scientific-card p-5 transition duration-300 hover:border-nasa/50"
          >
            <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{s.label}</dt>
            <dd className="mt-2 font-display text-2xl font-bold leading-tight text-fg sm:text-3xl">
              {s.value}
              {s.unit && <span className="ml-1 align-baseline text-base font-medium text-muted">{s.unit}</span>}
            </dd>
            {s.hint && <p className="mt-1 text-xs text-faint">{s.hint}</p>}
          </div>
        ))}
      </dl>
    </section>
  );
}
