import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WebsiteLink, AppCard } from "@/components/ecosystem/EcosystemLinks";
import {
  ECOSYSTEM_APPS,
  ECOSYSTEM_COUNTS,
  ECOSYSTEM_PATH,
  WEBSITE_CATEGORIES,
  websitesInCategory,
  ECOSYSTEM_WEBSITES,
} from "@/lib/ecosystem/projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/routes";

const DESCRIPTION =
  `The HELPERG ecosystem directory: ${ECOSYSTEM_COUNTS.websites} websites and ${ECOSYSTEM_COUNTS.apps} mobile apps, ` +
  "each with its official address. AsteriaStar is one of them — this page is the navigation index, not a replacement for any product's own site.";

export const metadata: Metadata = buildMetadata({
  title: "HELPERG Ecosystem",
  description: DESCRIPTION,
  path: ECOSYSTEM_PATH,
});

export default function EcosystemPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Ecosystem", url: ECOSYSTEM_PATH },
  ];

  /**
   * ItemList of the directory's entries.
   *
   * Deliberately NOT Organization/sameAs: these are separate products, and
   * declaring every one of them as a social profile of AsteriaStar — or
   * asserting that they are all one legal entity — would be a false claim in
   * structured data. A CollectionPage containing an ItemList of links is what
   * this page actually is.
   */
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "HELPERG ecosystem products",
    description: DESCRIPTION,
    url: absoluteUrl(ECOSYSTEM_PATH),
    numberOfItems: ECOSYSTEM_COUNTS.websites + ECOSYSTEM_COUNTS.apps,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: [
      ...ECOSYSTEM_WEBSITES.map((site, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: site.name,
        url: site.url,
      })),
      ...ECOSYSTEM_APPS.map((app, i) => ({
        "@type": "ListItem",
        position: ECOSYSTEM_WEBSITES.length + i + 1,
        name: app.name,
        // An app's canonical address is its store listing; iOS is used when
        // both exist purely so one item has one url.
        url: app.iosUrl ?? app.androidUrl ?? app.websiteUrl,
      })),
    ],
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "HELPERG Ecosystem", description: DESCRIPTION, url: ECOSYSTEM_PATH }),
          itemList,
        ]}
      />

      <HeroSection
        eyebrow="HELPERG"
        title="The HELPERG ecosystem"
        lead={
          <>
            {ECOSYSTEM_COUNTS.websites} websites and {ECOSYSTEM_COUNTS.apps} mobile apps. AsteriaStar is one of
            them. Every entry below links to that product&rsquo;s own official address — this page is a directory,
            not a second home for anything listed on it.
          </>
        }
        compact
      />

      <Container className="pb-20">
        <div className="mb-8">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        <div className="flex flex-col gap-10">
          {WEBSITE_CATEGORIES.map((category) => (
            <section key={category.id} aria-labelledby={`ecosystem-${category.id}`}>
              <h2
                id={`ecosystem-${category.id}`}
                className="text-lg font-semibold tracking-tight text-fg"
              >
                {category.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-faint">{category.summary}</p>
              <div className="mt-4 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {websitesInCategory(category.id).map((site) => (
                  <WebsiteLink key={site.id} name={site.name} url={site.url} description={site.description} />
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="ecosystem-apps">
            <h2 id="ecosystem-apps" className="text-lg font-semibold tracking-tight text-fg">
              Mobile Apps
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-faint">
              Native applications for iOS and Android. Each app is listed once, with a button for every platform it
              actually ships to — a missing button means no listing was published for that platform.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {ECOSYSTEM_APPS.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
