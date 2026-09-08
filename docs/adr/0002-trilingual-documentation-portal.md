# ADR-0002: Publish a trilingual, interactive documentation portal with Astro

> **Path:** [Team kit](../../README.md) > [Documentation](../README.md) > [ADRs](README.md)

| Field | Value |
|---|---|
| Status | accepted |
| Date | 2026-09-07 |
| Scope | Documentation delivery, not the SIFAP application frontend |
| Decision source | User request for complete EN, ES and PT-BR repository editions and GitHub Pages |

## Context

Readers need to follow the same material in GitHub or through an accessible website.
The portal must expose every tracked file, not a manually curated subset.
The English, Spanish and Brazilian Portuguese editions use `main`, `espanol` and `portugues-br`.
Application development still follows the existing Java 21 and Next.js 15 architecture.

The visual reference is [Agentic DevOps Hub](https://agenticdevopsplatform.ai/en/).
Its measured design uses warm off-white surfaces, a dark hero, Inter typography, monospaced labels, thin rules and four accent colors.
The implementation uses an original SIFAP layout and artwork, not the reference site's brand, photograph or copy.

## Decision

Build a separate Astro application in `site/`, using static generation and focused React 19 islands for browser-side interactions, as explicitly requested by the user.
GitHub Pages serves static files; search, filtering, theme selection, reading progress and animations still run interactively in the browser.
The language selector remains visible on desktop and mobile and links to the same logical document.

At build time, resolve the three Git branches to immutable commits and inventory their tracked files.
Render Markdown as sanitized documentation, provide source views and original downloads for other files, and preserve technical source bytes.
Record source paths, commit IDs and coverage in the generated catalog.
Production builds reject missing language editions, missing documents and broken internal routes rather than silently substituting English.

Use separate deployments for public and private repositories.
A private repository may deploy only after the GitHub Pages API confirms `public: false`.
Check this before publishing artifacts to Pages and again immediately before deployment.
An unavailable or ambiguous privacy setting stops publication; it never enables public access as a fallback.

## Dependency justification

| Dependency | Purpose |
|---|---|
| Astro | Static routes and typed component templates without a mandatory client framework |
| `@astrojs/react`, React 19, React DOM and their types | Hydrated search, filters, theme and reading controls while keeping documentation server-rendered |
| `@storybook/icons` | The outlined icon set supplied with the user's Hub Editorial design reference, without adopting Storybook branding |
| `@astrojs/markdown-remark` | Astro-compatible Markdown rendering, code blocks and heading metadata |
| `rehype-raw`, `rehype-sanitize` | Preserve supported Markdown HTML while removing executable or unsafe markup |
| Mermaid | Render the diagrams already present in the repository, with strict security settings |
| Pagefind | Local, language-aware search without an external indexing service |
| `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono` | Self-hosted, openly licensed fonts matching the reference's typography |
| `@astrojs/check`, TypeScript 5, Node.js types | Strict template and TypeScript validation |
| Node.js built-in test runner | Test Git ingestion, paths, language coverage and deployment guards without another testing framework |
| Playwright | Verify the actual responsive, interactive website, language navigation, search and text contrast in a browser |
| `parse5` | Audit real HTML nodes without mistaking escaped Markdown/code examples for live links or IDs |

Pin resolved versions in the lockfile.
Use Node.js 24 for the portal; do not change the application runtime requirements.
Localization dictionaries used by the interface are application resources, not duplicate translated documentation on `main`.

## Alternatives considered

| Alternative | Reason not selected |
|---|---|
| Plain GitHub-rendered Markdown | Does not provide the requested design, complete file catalog, search or interactive reading experience |
| Next.js static export | Viable, but overlaps conceptually with the separate SIFAP application frontend; Astro keeps hydration limited to interactive islands |
| An embedded copy of the reference website | Would copy unrelated branding/content and would not solve Git-based content coverage |
| External translation or search services | Would add recurring services and could expose private instructor material |

## Consequences

- Every source document stays versioned in its language branch and remains usable without the website.
- The same engine serves both repository audiences without mixing their content.
- GitHub Pages needs an explicit build workflow and a correct base URL, including private Pages' separate hostname.
- Translations and anchor compatibility are release gates, not silent fallbacks.
- Browser interactions respect keyboard navigation, small screens and reduced-motion preferences.

## Related requirements

See [the portal requirements](../../specs/trilingual-portal.md).

## References

- [Astro documentation](https://docs.astro.build/en/getting-started/)
- [GitHub Pages access control](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Visual reference](https://agenticdevopsplatform.ai/en/)
