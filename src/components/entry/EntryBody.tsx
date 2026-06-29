import type { EntrySection } from "@/lib/content/entry-types";

/** Renders an entry's body: a sequence of headed sections with prose and lists. */
export function EntryBody({ sections }: { sections: EntrySection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading} aria-label={section.heading}>
          <h2 className="font-display text-xl font-semibold text-fg">
            {section.heading}
          </h2>
          {section.paragraphs?.map((paragraph, i) => (
            <p
              key={i}
              className="mt-3 leading-relaxed text-muted [&:first-of-type]:mt-3"
            >
              {paragraph}
            </p>
          ))}
          {section.list && section.list.length > 0 && (
            <ul className="mt-3 space-y-2">
              {section.list.map((item) => (
                <li key={item} className="flex gap-3 text-muted">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent,#a78bfa)]"
                  />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
