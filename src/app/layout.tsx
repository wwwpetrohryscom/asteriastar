import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WebmasterId } from "@/components/site/WebmasterId";
import { ScientificBackdrop } from "@/components/cosmos/ScientificBackdrop";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import { defaultTitle } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: defaultTitle, template: "%s · Asteria Star" },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: defaultTitle,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE.description,
  },
  category: "science",
};

export const viewport: Viewport = {
  themeColor: "#02050B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="cosmos flex min-h-full flex-col">
        <JsonLd data={[websiteSchema(), organizationSchema()]} />
        {/* Premium deep-space black with barely-visible scientific decoration.
            The homepage re-adds the photographic ambient layer over this; every
            other page keeps this quiet backdrop so content stays the focus. */}
        <ScientificBackdrop />

        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-white px-4 py-2 font-medium text-bg focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <WebmasterId />
      </body>
    </html>
  );
}
