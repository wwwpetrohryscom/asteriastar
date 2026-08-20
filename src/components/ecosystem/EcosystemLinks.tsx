import {
  ECOSYSTEM_APPS,
  WEBSITE_CATEGORIES,
  websitesInCategory,
  type EcosystemApp,
} from "@/lib/ecosystem/projects";

/**
 * Shared, server-rendered building blocks for the ecosystem directory.
 *
 * Used by both the global bar's panel and the /ecosystem page so the two can
 * never drift: one registry, one set of link renderers.
 */

/** Outbound link attributes. Same rules everywhere, applied in one place. */
const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="h-2.5 w-2.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60 group-focus-visible:opacity-60">
      <path d="M4.5 2h5.5v5.5M10 2 4 8M8 10H2V4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Bare hostname, shown as the product's address. */
function domainOf(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

export function WebsiteLink({ name, url, description }: { name: string; url: string; description?: string }) {
  return (
    <a
      href={url}
      {...EXTERNAL}
      className="group flex flex-col gap-0.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-surface focus-visible:bg-surface"
    >
      <span className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-fg">
        {name}
        <ExternalIcon />
      </span>
      <span className="text-[0.6875rem] text-faint">{domainOf(url)}</span>
      {description ? <span className="mt-0.5 text-[0.6875rem] leading-relaxed text-faint">{description}</span> : null}
    </a>
  );
}

/** Platform buttons. Text labels, not store badge images: no third-party asset,
 *  no layout shift, and a screen reader announces the platform and the app. */
function PlatformLink({ href, platform, appName }: { href: string; platform: string; appName: string }) {
  return (
    <a
      href={href}
      {...EXTERNAL}
      className="rounded-md border border-silver/15 px-2 py-1 text-[0.6875rem] font-medium text-muted transition-colors hover:border-silver/35 hover:text-fg focus-visible:border-silver/35"
    >
      {platform}
      <span className="sr-only"> — {appName}</span>
    </a>
  );
}

export function AppCard({ app }: { app: EcosystemApp }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-silver/10 px-2.5 py-2">
      <span className="flex items-center gap-1.5">
        <span className="text-[0.8125rem] font-medium text-fg">{app.name}</span>
        <span className="rounded border border-silver/20 px-1 py-px text-[0.5625rem] font-medium uppercase tracking-wider text-faint">
          App
        </span>
      </span>
      {app.description ? <span className="text-[0.6875rem] leading-relaxed text-faint">{app.description}</span> : null}
      <span className="flex flex-wrap gap-1.5">
        {app.iosUrl ? <PlatformLink href={app.iosUrl} platform="App Store" appName={app.name} /> : null}
        {app.androidUrl ? <PlatformLink href={app.androidUrl} platform="Google Play" appName={app.name} /> : null}
        {app.websiteUrl ? <PlatformLink href={app.websiteUrl} platform="Website" appName={app.name} /> : null}
      </span>
    </div>
  );
}

/**
 * The full directory, server-rendered. Every ecosystem URL in the registry
 * appears here as a real `<a href>`, which is what makes the bar crawlable.
 */
export function EcosystemDirectory() {
  return (
    <div className="mx-auto grid max-w-7xl gap-x-6 gap-y-5 px-4 py-5 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
      {WEBSITE_CATEGORIES.map((category) => (
        <section key={category.id} aria-labelledby={`eco-cat-${category.id}`}>
          <h2
            id={`eco-cat-${category.id}`}
            className="mb-1.5 px-2.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-nasa"
          >
            {category.title}
          </h2>
          <div className="flex flex-col">
            {websitesInCategory(category.id).map((site) => (
              <WebsiteLink key={site.id} name={site.name} url={site.url} description={site.description} />
            ))}
          </div>
        </section>
      ))}

      <section aria-labelledby="eco-cat-apps" className="md:col-span-2 lg:col-span-3">
        <h2 id="eco-cat-apps" className="mb-1.5 px-2.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-nasa">
          Mobile Apps
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM_APPS.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>
    </div>
  );
}
