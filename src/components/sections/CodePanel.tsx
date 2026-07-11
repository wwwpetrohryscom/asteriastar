export function CodePanel({
  code,
  title,
  language = "text",
  className = "",
}: {
  code: string;
  title?: string;
  language?: string;
  className?: string;
}) {
  return (
    <figure className={`scientific-card ${className}`}>
      {title && (
        <figcaption className="border-b border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-faint">
          {title}
        </figcaption>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-muted">
        <code data-language={language}>{code}</code>
      </pre>
    </figure>
  );
}
