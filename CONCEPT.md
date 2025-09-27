# CONCEPT: Reisetagebuch (Travel Journal)

## Purpose & Vision
- A simple, beautiful, and incremental travel journal that grows with every day entry.
- Zero manual navigation maintenance: structure is derived from content files.
- Consistent experience across journeys, countries, cities, and days with reusable components.

## Audience
- Primary: authors documenting trips day-by-day.
- Secondary: friends/family readers following along via a clean, fast site.

## Content Model
- Journeys: declared in `_data/journeys.yml` with `key → { name, icon }`.
- Day entries: one Markdown per day with front matter:
  ```yaml
  ---
  layout: day
  title: <short title>
  date: YYYY-MM-DD
  journey: <journey-key>
  country: <country-key>
  city: <city-key>
  day: <N>
  weather: <optional string>
  ---
  ```
- Media per day: images/videos in `journeys/<journey-key>/tag-<N>/`.
  - Expected image names follow `_data/image-types.yml` (e.g., `main.jpg`, `morning.jpg`, `lunch.jpg`, `afternoon.jpg`, `evening.jpg`, `dinner.jpg`, `snack.jpg`, `selfie.jpg`, etc.).
  - Only existing files are shown. No placeholders.

## Information Architecture
- Home (`/`): lists only journeys that have at least one day entry; shows counts and date range.
- Journeys (`/journeys/<journey-key>/`): overview, stats, cities visited (only those with entries), latest days.
- Countries (`/<country>/`): lists only its cities that have entries.
- Cities (`/<country>/<city>/`): grid of day cards (newest first) and a scoped gallery.
- Day (`/<country>/<city>/tag-<N>/`): story content with badges, imagery, and prev/next navigation.
- Global pages: “Alle Einträge”, “Galerie”, “Besuchte Orte”.

## Navigation Behavior (Incremental Rules)
- Show journeys only if they have day entries.
- Under journeys, show cities only if they have day entries.
- “Besuchte Orte” shows countries with at least one city that has entries; hides empty cities.
- No manual curation required; Jekyll rebuild reflects new content automatically.

## Page Types & Components
- Cards: unified card for journey/city/day with compact layout and metadata badges.
- Badges: day number, weather, counts.
- Breadcrumbs: home → country → city → day.
- Gallery: reusable include with scopes `all`, `country`, `city`.
- Modal Viewer: keyboard (Esc/←/→) and touch swipe, focus management, lazy loading.

## Gallery & Media
- Image discovery scans `site.static_files` under `journeys/**/tag-*/`.
- Scope rules:
  - `all`: show all discovered images.
  - `country`: show only `main.*` images for the given country.
  - `city`: show only `main.*` images for the given city.
- Performance: `loading="lazy"`, `decoding="async"`, aspect-ratio placeholders to reduce CLS.
- Alt/title: generated from country/city/day and image type metadata.

## Design System & UX
- Visual tone: modern, compact, light mode only.
- CSS tokens in `assets/css/style.scss`: color, spacing, radius, elevation.
- Reusable classes: `.card`, `.badge`, `.grid`, `.gallery__*`, `.modal__*`, `.breadcrumb`.
- Accessibility: semantic landmarks, skip link, strong focus-visible, contrast-conscious UI.

## Data & Configuration
- Countries and cities: `_data/countries.yml` (names, emojis, flags) drive labels and ordering.
- Image types: `_data/image-types.yml` defines supported file name keys and display labels.
- Site config: `_config.yml` (baseurl, url, timezone, plugins via `github-pages`). No custom plugins outside GitHub Pages whitelist.

## Performance & Accessibility Targets
- Images ≤ 2 MB ideally; prefer right-sized assets; videos short.
- Avoid layout shift: use provided gallery containers (aspect-ratio).
- Lighthouse (local): Performance ≥ 90, Accessibility ≥ 95, Best Practices/SEO ≥ 90.

## Editorial Workflow
- Add a day:
  1) Create folder `journeys/<journey-key>/tag-<N>/` and drop images.
  2) Copy `_templates/day-template.md` to `journeys/<journey-key>/tag-<N>.md`.
  3) Fill front matter; write content.
- Add a city: create `places/<country>/<city>.md` from `_templates/city-template.md`, and add entries; city appears automatically once at least one day exists.
- Add a journey: declare it in `_data/journeys.yml`; the home page lists it once the first day is added.

## Non‑Goals & Constraints
- No manual nav trees or static lists to maintain.
- No dark mode (explicitly out of scope).
- Keep within GitHub Pages plugin set (no extra Jekyll plugins).
