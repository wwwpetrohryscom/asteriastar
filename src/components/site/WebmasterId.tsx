import Script from "next/script";

/**
 * WebmasterID analytics configuration. Public identifiers, safe to ship in the
 * client bundle. Overridable via env for staging without a code change.
 */
export const WEBMASTERID = {
  siteId: process.env.NEXT_PUBLIC_WEBMASTERID_SITE_ID ?? "wm_knpkrkxcizuzoa0s",
  endpoint:
    process.env.NEXT_PUBLIC_WEBMASTERID_ENDPOINT ??
    "https://webmasterid-ingest-api.vercel.app/api/events",
  src: "https://webmasterid.com/tracker.iife.min.js",
} as const;

/**
 * Loads the official WebmasterID tracker.
 *
 * The `@webmasterid/sdk-next` SDK is not used: this is a static-first (SSG)
 * app, and adding an unpinned third-party runtime dependency to the root layout
 * is an architecture risk. Per the integration guidance we fall back to the
 * official script, loaded through `next/script` — which guarantees it is
 * injected exactly once (deduped by `id`), runs after hydration
 * (`afterInteractive`, so no SSR/hydration mismatch and no render blocking),
 * and works identically in server-rendered and statically-generated output.
 */
export function WebmasterId() {
  return (
    <Script
      id="webmasterid-tracker"
      src={WEBMASTERID.src}
      strategy="afterInteractive"
      data-wmid={WEBMASTERID.siteId}
      data-endpoint={WEBMASTERID.endpoint}
    />
  );
}
