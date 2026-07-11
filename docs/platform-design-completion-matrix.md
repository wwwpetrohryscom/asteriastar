# AsteriaStar Platform Design Completion Matrix

Date: 2026-07-11
Branch: `agent/platform-design-completion`

Scope: final non-home platform-wide visual pass. The approved homepage composition, content, and hierarchy were not redesigned. Shared bug fixes and branding assets were allowed where they affect global consistency and layout stability.

## System Changes Applied

| Area | Completion |
| --- | --- |
| Palette | Black surfaces (`#000000`, `#020304`, `#050708`), white/near-white text, red editorial accent, green only for positive status states. |
| Typography | Shared non-home hero and prose copy now use stronger contrast, larger editorial hierarchy, and wider reading rhythm. |
| Surfaces | Legacy `rounded... border white/10 bg-white/[0.02]` cards were replaced across app/components with `.scientific-card`. |
| Cards | Topic cards, gallery cards, stats, CTA bands, route cards, tool cards, graph cards, detail cards, and hub cards inherit the new scientific surface. |
| Tables | Existing tables retain structure and routes; shared table primitive added for new pages and repeated table wrappers were converted to black surfaces. |
| Semantics | Positive/active/live/available states use green. Warnings/stale/deprecated/prepared/mission-critical states use red. Planned/computed/reference states use neutral or red, not blue. |
| Imagery | Existing licensed NASA/ESA/ESO/Wikimedia registry remains the image source. No random web imagery was added. Image dimensions and lazy/priority behavior were preserved. |
| Logo | Component logo and generated SVG/PNG/ICO/PWA assets now use a flat telescope-diffraction star, black tile, white/silver forms, and red coordinate ticks. |
| Gradients | Non-home photographic overlays were changed to solid black scrims. Remaining gradients are limited to protected homepage composition, OG artwork, or technical CSS/SVG line construction. |
| CLS/performance | Footer has layout containment and solid overlays; the global root loading fallback was removed after trace QA showed it could push the footer during streamed initial render. Header search prefetch is disabled to avoid a non-critical `_rsc` payload on every page. |

## Route Family Matrix

| Family | Representative URL | Previous/current template | New system coverage | Hero | Imagery | Theme | Red/green semantics | Mobile/a11y/runtime QA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage control | `/` | Approved bespoke homepage | Not redesigned; shared logo/footer/tokens only | Home hero unchanged | Existing real image system | Shared black/red tokens | Shared red CTA/footer | Passed |
| Universal graph entity pages | `/explore/entity/moon/the-moon` | V6 entity experience | EditorialHero, StatGrid, related image cards, scientific surfaces | EditorialHero | Registry hero/gallery | Black/red/white | Green only for verified/live status | Passed |
| Solar System pages | `/solar-system`, `/solar-system/mars` | Hub/detail pages | HeroSection, scientific-card surfaces, related object links | Shared HeroSection/detail | Registry where available | Black/red/white | Neutral data, red source links | Passed |
| CMS/topic entries | `/astronomy-software`, `/observation-techniques` | Repeated hub/detail templates | HeroSection plus mechanical card upgrade | Shared HeroSection | Registry/fallback diagrams | Black/red/white | Neutral metadata | Passed |
| Stars | `/stars`, `/stars/sirius` | Star hub/detail/table | HeroSection, scientific-card, red links, neutral spectral text | Shared/detail hero | Registry when available | Black/red/white | Candidate/status badges green/red only | Passed |
| Exoplanets | `/exoplanets`, `/exoplanets/11-com-b` | Hub/detail/table | HeroSection, table/status color remap, cards | Shared/detail hero | Registry when available | Black/red/white | Habitable/positive green; warnings red | Passed |
| Comets | `/comets`, `/comets/halleys-comet` | Hub/detail/table | Cards/tables/live-sky notices converted | Shared/detail hero | Registry when available | Black/red/white | Live/prepared/warning red/green | Passed |
| Asteroids | `/asteroids`, `/asteroids/near-earth` | Hub/detail/filter pages | Cards, warnings, PHA badges, table surfaces | Shared HeroSection | Registry where available | Black/red/white | PHA/warning red, positive green | Passed |
| Meteorites | `/meteorites`, `/meteorites/abee` | Hub/detail/table | Cards/tables/live-sky panels converted | Shared/detail hero | Registry where available | Black/red/white | Prepared/warning red | Passed |
| Rockets and launch vehicles | `/rockets`, `/rockets/falcon-9` | Hub/detail/table | Lifecycle status remapped, cards/tables upgraded | Shared/detail hero | Registry where available | Black/red/white | Active green, planned red/neutral | Passed |
| Satellites | `/satellites`, `/satellites/hubble-space-telescope` | Hub/detail/table | Lifecycle status remapped, route cards upgraded | Shared/detail hero | Registry where available | Black/red/white | Operational green, planned neutral/red | Passed |
| Spacecraft systems | `/spacecraft-systems` | Engine hub/detail | Scientific-card detail modules and chips | Shared HeroSection | Registry where available | Black/red/white | Status only red/green | Passed |
| Missions and small-body missions | `/small-body-missions`, `/small-body-missions/osiris-rex` | Hub/detail/type/sample pages | Mission status remap, cards/tables upgraded | Shared/detail hero | Registry where available | Black/red/white | Active/completed green, cancelled red | Passed |
| Observatories/telescopes/frontier | `/observatories`, `/observatory-frontier` | Hub/detail cards | Cards, detail surfaces, image related objects | Shared HeroSection | Registry imagery | Black/red/white | Planned red/neutral, active green | Passed |
| Instruments | `/instruments`, `/instruments/spectroscopy` | Hub/detail cards | Cards/detail related links upgraded | Shared HeroSection | Registry where available | Black/red/white | Neutral metadata | Passed |
| Constellations | `/constellations`, `/constellations/orion` | Hub/detail/season/family pages | Cards, tables, Live Sky panels upgraded | Shared/detail hero | Registry/fallback charts | Black/red/white | Live/observable green; warnings red | Passed |
| Institutions | `/institutions`, `/institutions/nasa` | Hub/detail cards | Detail chips and cards upgraded | Shared HeroSection | Registry/logo where available | Black/red/white | Neutral institutional metadata | Passed |
| Space weather | `/sky/space-weather`, `/solar-physics` | Bespoke sky and solar pages | Sky panels remapped to red/green/neutral | Shared HeroSection/tools | Registry where available | Black/red/white | Safe/available green; warnings red | Passed |
| Human spaceflight | `/human-spaceflight` | Hub/detail cards | Status and cards remapped | Shared HeroSection | Registry where available | Black/red/white | Active green, planned red/neutral | Passed |
| History/timelines | `/history`, `/timeline` | Timeline card grids | Timeline/cards upgraded to scientific surfaces | Shared HeroSection | Registry where available | Black/red/white | Timeline markers red | Passed |
| Learning paths | `/learn`, `/learn/[path]` | Learning route cards | Mechanical card upgrade and red links | Shared HeroSection | Registry where available | Black/red/white | Neutral state | Passed |
| Discovery hubs | `/discover`, `/topic-index`, `/entity-index` | Topic grids | TopicCard + SectionGrid upgraded | Shared HeroSection | Registry where available | Black/red/white | Red active links | Passed |
| Galleries/images | `/images`, `/images/astrophotography` | Gallery cards/lightbox | GalleryCard, image badges, overlays upgraded | Shared HeroSection | Licensed registry only | Black/red/white | Open license green, other neutral | Passed |
| Scientific calculators | `/calculators`, `/sky/tonight`, `/sky/moon` | Tool panels/forms | Form focus, buttons, alerts, status badges remapped | Shared HeroSection/tool panels | No fake imagery | Black/red/white | Computed neutral, live green, stale red | Passed |
| Live Sky tools | `/live`, `/sky/events`, `/sky/this-month` | Live/prepared panels | StatusBadge remap and scientific panels | Shared HeroSection | No fabricated imagery | Black/red/white | Live green, prepared/stale red | Passed |
| Observation planners | `/observing`, `/sky/page` | Hub/detail/tool routes | Card/detail/tool surfaces upgraded | Shared HeroSection | Registry where available | Black/red/white | Observable/available green | Passed |
| Workspace pages | `/workspace` | Client workspace modules | Cards/forms/tabs upgraded mechanically | Shared page shell/cards | No random imagery | Black/red/white | Connected/saved green; errors red | Passed |
| Assistant pages | `/assistant`, `/assistant/compare` | Assistant tool/document pages | Cards/tool panels/nav states upgraded | Shared HeroSection/tool cards | No random imagery | Black/red/white | Grounded/verified green; limitations red | Passed |
| Graph explorer | `/graph`, `/connections/[slug]` | Graph cards/data panels | Graph cards/status chips upgraded | Shared HeroSection | Graph visuals only | Black/red/white | Relationship states neutral/green | Passed |
| Data portal | `/data`, `/datasets`, `/open-data` | Portal cards/status badges | Portal StatusBadge remapped; cards upgraded | Shared HeroSection | No random imagery | Black/red/white | Available/stable green; planned neutral | Passed |
| Developer portal/API docs | `/developers`, `/developers/api` | Documentation cards/code blocks | Buttons, code panels, API cards upgraded | Shared HeroSection/docs | No random imagery | Black/red/white | Available/stable green | Passed |
| Datasets/exports | `/datasets/[slug]`, `/datasets/[slug]/json` | Dataset pages/routes | Dataset cards/panels upgraded; API routes untouched | Shared HeroSection | No random imagery | Black/red/white | Available green | Passed |
| Policy/legal/trust | `/about`, `/editorial-policy`, `/sources-policy`, `/transparency` | EditorialPage/prose | Prose contrast and links upgraded | Shared HeroSection | No random imagery | Black/red/white | Warnings red, verified green | Passed |
| Not found/utility states | `/not-found`, empty/error states | Utility states | Empty/Error primitives added for new state usage; global loading fallback removed to prevent layout shift on streamed routes | Utility | None | Black/red/white | Error red | Passed |

## Bespoke Detail Component Coverage

The following `*Detail`, `*Cards`, and `*Table` families were included in the mechanical surface and semantic color pass:

`stars`, `exoplanets`, `comets`, `asteroids`, `meteorites`, `institutions`, `spacecraft-systems`, `interstellar`, `small-body-missions`, `instruments`, `space-weather/solar-physics`, `rockets`, `satellites`, `observatories`, `human-spaceflight`, `history/timeline`, `astronomy-software`, `methods/reference-systems`, `calculators`, `live`, `assistant`, `graph-explorer`, `data`, `workspace`, `images`, `cosmology`, `galaxies`, `deep-sky`, `planetary-geology`, `planetary-defense`, `space-engineering`, `space-infrastructure`, `space-medicine`, `space-policy`, `mission-operations`, `deep-space-network`, `deep-space-exploration`, `observation-techniques`, `astroinformatics`, `astrobiology`, `astrochemistry`, `multi-messenger`, `compact-objects`, `stellar-astrophysics`, `galactic-astronomy`, `comparative-planetology`, `future-exploration`, `citizen-astronomy`, `observatory-frontier`, and `time-domain`.

## QA Log

| Check | Status | Notes |
| --- | --- | --- |
| `npm run validate` | Passed | Architecture, media, data engine, open data, image registry, and knowledge graph validators passed. Media validator reports 1095 displayable images with license and attribution. |
| `npx tsc --noEmit` | Passed | TypeScript completed without errors. |
| `npm run lint` | Passed | ESLint completed without errors. |
| `npm run build` | Passed | Next.js production build generated 9234 static pages. Build still emits the existing Satori warning: `` `z-index` is currently not supported. `` |
| Runtime smoke | Passed | 45 representative app, API, SEO, sitemap, robots, and llms routes returned `200`. |
| Visual/responsive QA | Passed | Browser QA on `/`, `/rockets/saturn`, `/explore/entity/moon/the-moon`, `/developers`, and `/images`: no broken images, logo present, no horizontal overflow, no nested anchors, no console errors, no purple/violet/magenta classes. Mobile and desktop viewports were checked during the pass; final rebuild was rechecked at 1280x720. |
| Accessibility QA | Passed | Lighthouse accessibility: 100 on `/explore/entity/moon/the-moon`; 100 on `/developers`. Manual browser QA confirmed contrast theme and focusable header/logo surfaces render correctly. |
| Performance QA | Passed | Lighthouse after final production build: Moon entity route Performance 90, Accessibility 100, Best Practices 100, SEO 100, CLS 0, TBT 10 ms, total size 500 KB; Developers route Performance 94, Accessibility 100, Best Practices 96, SEO 100, CLS 0, TBT 10 ms, total size 554 KB. |
| Hydration QA | Passed | `/images` production hydration error was fixed by removing a nested anchor from gallery cards; final browser QA reports zero console errors and zero nested anchors. |
