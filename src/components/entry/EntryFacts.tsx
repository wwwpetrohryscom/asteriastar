import type { EntryFact } from "@/lib/content/entry-types";

/** A compact "fast facts" card: label/value pairs in a definition list. */
export function EntryFacts({
  facts,
  title = "Fast facts",
}: {
  facts: EntryFact[];
  title?: string;
}) {
  if (facts.length === 0) return null;
  return (
    <section
      aria-labelledby="facts-heading"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
    >
      <h2 id="facts-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">
        {title}
      </h2>
      <dl className="mt-3 divide-y divide-white/5">
        {facts.map((fact) => (
          <div key={fact.label} className="flex justify-between gap-4 py-2.5">
            <dt className="text-sm text-faint">{fact.label}</dt>
            <dd className="text-right text-sm font-medium text-fg">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
