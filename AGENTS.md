# Repository Guidelines

## Project Structure & Module Organization
The site is a Jekyll project. Content lives in `journeys/`, `places/`, and `gallery/`, each with Markdown files that expose YAML front matter for metadata. Reusable layouts and partials sit in `_layouts/` and `_includes/`, while shared data (tags, navigation) belongs in `_data/`. Sass and JavaScript assets are under `assets/css/style.scss` and `assets/js/`. The generated `_site/` output is disposable—never edit it directly. Use `_templates/` as the starting point when creating new journey or day pages so front matter stays consistent.

## Build, Test, and Development Commands
Run `bundle install` after pulling new gems. Use `bundle exec jekyll serve --livereload` to preview the site locally at `http://127.0.0.1:4000/reisetagebuch`. For production parity builds, run `JEKYLL_ENV=production bundle exec jekyll build`. Execute `bundle exec jekyll doctor` whenever you adjust configuration or front matter to surface bad links, missing collections, or deprecated settings.

## Coding Style & Naming Conventions
Follow two-space indentation in Liquid, HTML, and SCSS, mirroring the existing files. Keep slugs and directories in `kebab-case` (e.g., `journeys/skandinavien-interrail/index.md`) and reuse the slug in the `journey` front matter key. Quote titles containing special characters. Follow the existing BEM-flavored class names (`grid--entries`, `filter-bar__group`) when extending styles. JavaScript modules remain vanilla and browser-friendly—prefer plain functions and avoid bundler-only syntax.

## Testing Guidelines
Before committing, run `bundle exec jekyll build` and spot-check the rendered pages in `_site/`. Use `bundle exec jekyll doctor` to ensure new includes and data entries resolve correctly. When adding interactive components, confirm they initialize via `assets/js/site.js` or `modal.js` across desktop and mobile breakpoints.

## Commit & Pull Request Guidelines
Commits in this repo are short, present-tense summaries (e.g., `add sidebar filter`). Group related page, style, and data changes together so each commit builds cleanly. For pull requests, provide a concise description of the user-visible change, link any issues or travel entries it relates to, and include desktop/mobile screenshots when layout or imagery shifts.

## Content Authoring Tips
Duplicate the closest template in `_templates/` to start new journeys or day entries. Ensure front matter includes `layout`, `title`, `journey`, and date fields as needed, and double-check that internal links use absolute Liquid URLs (`{{ site.baseurl }}`) to stay compatible with GitHub Pages hosting.
