# Reisetagebuch

A GitHub Pages-powered travel journal built with Jekyll. Content for journeys, places, and galleries is stored as Markdown with YAML front matter, then rendered through custom layouts, partials, and Sass/JavaScript assets.

## Quick Start
- Install dependencies once with `bundle install`.
- Start a live preview at `http://127.0.0.1:4000/reisetagebuch` via `bundle exec jekyll serve --livereload`.
- Build the production output locally using `JEKYLL_ENV=production bundle exec jekyll build`.
- Run `bundle exec jekyll doctor` after changing data, layouts, or includes to surface configuration issues.

## Project Structure
- `_layouts/`, `_includes/`: Page shells and reusable fragments for journeys, day views, navigation, and cards.
- `_data/`: YAML data powering navigation, tags, and filters.
- `journeys/`, `places/`, `gallery/`: Markdown entries grouped by topic, each with descriptive front matter.
- `assets/css/style.scss`, `assets/js/`: Sass and vanilla JS (modules use BEM-flavoured class names such as `filter-bar__group`).
- `_templates/`: Starter files for new journeys, countries, and day entries; copy one to keep metadata aligned.
- `_site/`: Generated output; delete or ignore it instead of editing directly.

## Content Workflow
- Duplicate the closest template in `_templates/` when authoring new content and update front matter keys (`layout`, `title`, `journey`, `date`).
- Keep slugs and directories in `kebab-case` and use quoted titles for special characters or umlauts.
- Use Liquid helpers for links: `{{ site.baseurl }}/path` ensures GitHub Pages builds stay portable.

## Development Notes
- Stick to two-space indentation across Liquid, HTML, Sass, and JS to match existing style.
- New interactive behaviour should live in `assets/js/site.js` or `assets/js/modal.js` and avoid bundler-specific syntax.
- Check responsive layouts after significant CSS changes; the sidebar and gallery components have breakpoint-sensitive behaviour.

## Contributing
- Write concise, present-tense commit messages (e.g., `add sidebar filter`).
- Group related content, style, and data edits so each commit builds cleanly.
- In pull requests, describe user-facing changes, link any related issues or travel entries, and add screenshots for layout updates.
