# SIFAP documentation portal

This Astro + React application publishes the complete repository in English, Spanish and Brazilian Portuguese. It is separate from the SIFAP application's Next.js frontend.

## Read online or in GitHub

The language editions are `main` (EN), `espanol` (ES) and `portugues-br` (PT-BR).
The website's persistent language selector opens the same source document in another edition.
Every Markdown document is rendered in full, including Copilot instructions, prompts, skills, personas and stage guides.
Each document also exposes its entire original Markdown, a byte-preserving download and a link to the immutable source commit.
Other versioned files have source views, image previews or original downloads.

## Run locally

Requirements: Node.js 24, npm, Git and local remote-tracking references for all three editions.

```bash
git fetch origin
cd site
npm ci
npm test
npm run build
npm run preview
```

The default URL comes from [`repository.json`](repository.json). For a local root-path build, set `SITE_URL=http://127.0.0.1:4321/` when building and previewing.
Never copy preview fixtures into a production release.

## Validate

```bash
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

The production build resolves all language branches to immutable commits. It fails for a missing edition, missing file, unchanged untranslated Markdown or prose, stale portal code, unresolved link, invalid anchor or altered original download.
Keep the non-Markdown files under `site/` identical across the three branches when updating the shared portal engine.
Reports are generated in `.generated/coverage.json` and `.generated/site-audit.json`.
The browser tests exercise language switching, full Markdown access, search, responsive layout, contrast, reading state and reduced motion.

## Content and design

- Source documents stay in the language branches; the portal does not maintain separate summaries.
- [`src/lib/i18n.ts`](src/lib/i18n.ts) contains interface translations, not repository documentation.
- [`src/styles/hub-editorial.css`](src/styles/hub-editorial.css) reuses the supplied Hub Editorial component stylesheet.
- [`src/styles/tokens.css`](src/styles/tokens.css) defines its typography, color and spacing tokens; portal-specific styles preserve readable contrast in both themes.
- React islands provide search, filters, stage navigation and reading preferences. The document text remains available without JavaScript.
- Fonts and search are self-hosted. Original technical sources and licenses remain unchanged.
- Original distribution notices are available in [`public/licenses/`](public/licenses/) and through the website's license catalog.

## GitHub Pages and privacy

The [Pages workflow](../.github/workflows/pages.yml) builds all three editions and validates the site before deployment.
[`scripts/pages-guard.mjs`](scripts/pages-guard.mjs) reads the actual repository and Pages visibility through the GitHub API.
A private repository is blocked from publishing to public or unverified Pages.
The guard runs before the build, before artifact publication and immediately before deployment.
The public team kit and private instructor kit must never share generated content.

## Architecture and requirements

- [ADR-0002](../docs/adr/0002-trilingual-documentation-portal.md)
- [REQ-PORTAL-001 through REQ-PORTAL-010](../specs/trilingual-portal.md)
