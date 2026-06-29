import { getSources, type SourceKey } from "@/lib/sources";

/**
 * Lists the authoritative sources a page draws on. These are *source slots*:
 * they declare where verified information will come from. We never present
 * these organizations as endorsing the page.
 */
export function SourceList({
  keys,
  title = "Sources & references",
}: {
  keys: readonly SourceKey[];
  title?: string;
}) {
  const sources = getSources(keys);
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="sources-heading">
      <h2 id="sources-heading" className="font-display text-xl font-semibold text-fg">
        {title}
      </h2>
      <p className="mt-1 text-sm text-faint">
        Facts on this topic will be cited from these primary and reference sources.
      </p>
      <ul className="mt-4 space-y-3">
        {sources.map((source) => (
          <li
            key={source.key}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer nofollow"
                className="font-medium text-fg underline-offset-4 transition hover:text-nebula hover:underline"
              >
                {source.name}
              </a>
              <span className="text-xs text-faint">{source.organization}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{source.scope}</p>
            {source.usage && (
              <p className="mt-1.5 text-xs leading-relaxed text-faint">{source.usage}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
