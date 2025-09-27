# PLAN: Reisetagebuch Implementation

This plan turns the features in CONCEPT.md into a concrete, step‑by‑step implementation for this Jekyll site (GitHub Pages compatible, no custom plugins). It reflects the current repo state: day/country/city layouts exist, basic data files are present, CSS design tokens are scaffolded, and content lives under `journeys/` and `places/`.

## Guiding Principles
- Derive structure from content (no manual curation).
- Keep within GitHub Pages plugin whitelist (already using `jekyll-feed`, `jekyll-sitemap`, `jekyll-seo-tag`).
- Fast, accessible, light UI with reusable components.
- Only show items that have entries (incremental navigation rules).

## Prerequisites
1) Local dev: `bundle install` and `bundle exec jekyll serve`.
2) Ensure `_data/{countries.yml,journeys.yml,image-types.yml}` are accurate; extend as needed.
3) Confirm `timezone`, `baseurl`, `url` in `_config.yml`.

## Milestone 1 — Core Routing & URLs
1) Home page: create `index.html` with layout `home` (or `default`) to list journeys with at least one day entry, plus counts and date ranges.
2) Journey pages: keep `journeys/<journey>/index.md` with layout `journey` at `/journeys/<journey>/`.

## Milestone 2 — Base Layout & Sidebar
1) Create `_layouts/default.html` that:
   - Includes `jekyll-seo-tag` in `<head>` and loads `assets/css/style.scss` and a main JS bundle under `assets/js/`.
   - Wraps content in `.site-wrapper` with a fixed `.sidebar` and `.main-content .content-wrapper` per existing CSS.
   - Renders a skip link, header, and `{% include navigation.html %}` inside the sidebar.
2) Add `_includes/navigation.html` implementing the left menu structure per CSS:
   - Countries → Cities → Days (collapsible), only showing entries that exist.
   - Journeys section listing journeys that have ≥1 day entry.
   - Latest entries list (5–10 most recent days).
   - Link to global “Galerie”.

## Milestone 3 — Page Layouts
1) Create `_layouts/home.html` to show:
   - Only journeys with entries (group days by `page.journey`).
   - A grid of journey cards with icon, day count, and date range.
2) Create `_layouts/journey.html` for `/journeys/<journey>/`:
   - Summary (name/icon from `_data/journeys.yml`).
   - Cities visited (from the set of days for that journey).
   - Latest days and a link to “Alle Einträge”.
3) Keep and refine existing layouts:
   - `_layouts/country.html` and `_layouts/city.html` already list only populated children; ensure they use unified cards and include the city/country gallery.
   - `_layouts/day.html` prev/next logic is present; verify it navigates within city and falls back across cities/countries, as implemented.

## Milestone 4 — Reusable Components
1) Add `_includes/card.html` to support `type: 'journey' | 'country' | 'city' | 'day'` with consistent markup and badges.
2) Keep `_includes/page-header.html` and `_includes/breadcrumb.html` as header/breadcrumb components.
3) Add small includes as needed:
   - `_includes/stats.html` for counts (days, cities visited).
   - `_includes/pager.html` if list pagination is introduced (optional).

## Milestone 5 — Gallery & Media
1) Add `_includes/gallery.html` implementing CONCEPT rules:
   - Discover with `site.static_files` under `journeys/**/tag-*/`.
   - Scopes:
     - `all`: all discovered images.
     - `country`: only `main.*` for the given country (match via same `country` of owning day page).
     - `city`: only `main.*` for the given city.
   - Respect `_data/image-types.yml` for alt/title labels and friendly names.
   - Performance attributes on images: `loading="lazy"` and `decoding="async"`.
2) Modal viewer:
   - Create `_includes/modal.html` and `assets/js/modal.js` to handle open/close, keyboard (Esc/←/→), focus trapping, and swipe gestures where feasible.
   - Apply existing `.modal__*` CSS; ensure it’s inserted near the gallery container.
3) Media helpers (optional but recommended):
   - Add `_includes/media-img.html` to build consistent `<img>` tags with computed `alt` from country/city/day/image-type and accept `title` fallback.
   - Consider simple aspect-ratio wrappers to avoid CLS.

## Milestone 6 — Global Pages
1) “Alle Einträge” page (`entries/index.html`): list all days (newest first) using day cards.
2) “Galerie” page (`gallery/index.html`): include the global gallery with scope `all`.
3) “Besuchte Orte” page (`places/index.html`):
   - Show countries that have at least one city with entries; within a country, only show cities with entries.

## Milestone 7 — Data & Content Hygiene
1) Unify media paths in day content to the canonical storage under `journeys/<journey>/tag-<N>/...`.
   - Update `_templates/day-template.md` image references to `journeys/{{ page.journey }}/tag-{{ page.day }}/...` consistently.
   - Optionally provide a helper include for images to reduce duplication.
2) Ensure each city has a `places/<country>/<city>.md` index page (from `_templates/city-template.md`). Cities appear once the first day exists.
3) Ensure each journey has `journeys/<journey>/index.md` (layout `journey`).

## Milestone 8 — Design System & Accessibility
1) Continue building on `assets/css/style.scss` tokens and utilities.
2) Ensure semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, and a skip link.
3) Strong focus-visible styles already present in CSS; verify all interactive elements.
4) Provide accessible names for images and gallery controls (aria-labels, roles, focus order).

## Milestone 9 — Performance & SEO
1) Lazy-load and async decode already in gallery; add to inline day images where possible.
2) Add `<meta>` via `jekyll-seo-tag` and verify per-page titles/descriptions.
3) Generate `sitemap.xml` (plugin already enabled).

## Milestone 10 — QA & Launch
1) Local QA: run the site, click through navigation, test galleries and modal on desktop and mobile.
2) Validate 404s for images/links; ensure only existing media are shown (gallery logic must filter to existing files).
3) Cross-browser quick checks (Chromium/WebKit/Gecko if available).
4) Push to GitHub Pages; confirm baseurl handling.

## Step-by-Step Task List (Condensed)
1) Add `_layouts/default.html` with sidebar and content wrappers; wire CSS/JS; add skip link and `jekyll-seo-tag`.
2) Add `_includes/navigation.html` (countries → cities → days; journeys; latest entries; gallery link).
3) Add `_layouts/home.html` and root `index.html` using it; list journeys with entries.
4) Add `_layouts/journey.html` and refine `_layouts/{country,city,day}.html` to use shared components.
5) Add `_includes/card.html` and replace card usages in layouts.
6) Add `_includes/gallery.html`, `_includes/modal.html`, and `assets/js/modal.js` per CONCEPT.
7) Create global pages: `entries/index.html`, `gallery/index.html`, `places/index.html`.
8) Update `_templates/day-template.md`:
   - Add `permalink: /{{ page.country }}/{{ page.city }}/tag-{{ page.day }}/`.
   - Normalize all image/video URLs to `journeys/{{ page.journey }}/tag-{{ page.day }}/...`.
9) Migrate existing day posts (optional batch) to include `permalink` if missing.
10) QA, Lighthouse checks, deploy.

## Notes & Edge Cases
- When a city has no entries, it should not appear under a country or “Besuchte Orte”.
- The gallery must tolerate missing types: only render existing files; no placeholders.
- Avoid non-whitelisted Jekyll plugins; use Liquid and `site.static_files` for discovery.

## Success Criteria
- Content authors can add a day via the editorial workflow in CONCEPT.md without touching navigation.
- Home, journeys, countries, cities, days, and global pages all reflect new content automatically.
- Galleries are performant and accessible with keyboard and touch.

