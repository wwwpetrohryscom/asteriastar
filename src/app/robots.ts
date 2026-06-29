import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { absoluteUrl } from "@/lib/routes";

/**
 * robots.txt — the whole public site is crawlable. Reserved, not-yet-built
 * areas (the future authenticated product area and any API) are disallowed up
 * front so they never leak into the index later.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
