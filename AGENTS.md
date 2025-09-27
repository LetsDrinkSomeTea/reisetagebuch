# Repository Guidelines

## Project Structure & Module Organization
- Source: `_layouts/` (page templates), `_includes/` (partials), `assets/` (CSS/JS), `_data/` (YAML metadata), `_config.yml` (site config).
- Content: `journeys/` (trip timelines; files `tag-<n>.md` plus images) and `places/` (country/city pages). Reuse `_templates/` to scaffold new items.
- Build output: `_site/` is generated. Do not edit or commit manual changes there.

## Build, Test, and Development Commands
- Install deps: `bundle install` — installs GitHub Pages + Jekyll plugins.
- Run locally: `bundle exec jekyll serve --livereload` — serves at `http://localhost:4000/reisetagebuch`.
- Build production: `JEKYLL_ENV=production bundle exec jekyll build` — writes to `_site/`.
- Sanity checks: `bundle exec jekyll doctor` — reports common config/content issues.

## Coding Style & Naming Conventions
- Indentation: 2 spaces for HTML/Liquid, SCSS, and YAML. No tabs.
- Liquid: keep logic in `_includes/`; keep layouts declarative and readable.
- Filenames/slugs: lowercase kebab-case ASCII. Umlauts as ae/oe/ue (e.g., `daenemark/`, `goeteborg/`).
- Entries: `journeys/<slug>/tag-<n>.md` with images in the same folder. Image names must match `_data/image-types.yml` (e.g., `main.jpg`, `morning.jpg`, `dinner.jpg`).
- Assets: edit `assets/css/style.scss` and `assets/js/main.js`. Keep CSS modular and variables centralized.

## Testing Guidelines
- Local build must complete without errors or warnings.
- Spot-check new/changed pages and gallery modals on mobile and desktop sizes.
- Verify navigation updates (countries, cities, days) and breadcrumb paths.
- Keep images optimized (<2 MB each when possible) to preserve performance.

## Commit & Pull Request Guidelines
- Commits: imperative mood with scope prefixes when helpful: `content: add day 12 (Tokyo)`, `layout: tweak gallery modal`, `data: update countries.yml`.
- PRs: include summary, before/after screenshots for visual changes, and mention touched areas (`layouts`, `includes`, `data`, `assets`, `content`). Link related issues.
- CI/CD: main branch publishes via GitHub Pages. Only merge when local build is green.

## Notes for Agents
- Do not add unsupported Jekyll plugins (GitHub Pages whitelist applies via `github-pages` gem).
- Avoid editing `_site/`. Configuration lives in `_config.yml`; metadata in `_data/`.
